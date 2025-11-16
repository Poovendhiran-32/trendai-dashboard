from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid
import pandas as pd
import io
from motor.motor_asyncio import AsyncIOMotorDatabase

class DataService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.datasets_collection = db.datasets
        self.predictions_collection = db.predictions
    
    async def upload_dataset(self, file_content: bytes, filename: str, user_id: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Upload and process a dataset"""
        try:
            # Read CSV/Excel file
            if filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(file_content))
            elif filename.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(io.BytesIO(file_content))
            else:
                return {"success": False, "error": "Unsupported file format. Please upload CSV or Excel files."}
            
            # Basic validation
            if df.empty:
                return {"success": False, "error": "Dataset is empty"}
            
            # Detect date column
            date_column = self._detect_date_column(df)
            
            # Detect value columns (numeric columns)
            value_columns = df.select_dtypes(include=['number']).columns.tolist()
            
            # Create dataset document
            dataset_id = str(uuid.uuid4())
            dataset_doc = {
                "id": dataset_id,
                "userId": user_id,
                "filename": filename,
                "uploadedAt": datetime.utcnow(),
                "rowCount": len(df),
                "columnCount": len(df.columns),
                "columns": df.columns.tolist(),
                "dateColumn": date_column,
                "valueColumns": value_columns,
                "metadata": metadata or {},
                "status": "processed",
                "dataPreview": df.head(10).to_dict('records'),
                "statistics": {
                    "mean": df[value_columns].mean().to_dict() if value_columns else {},
                    "median": df[value_columns].median().to_dict() if value_columns else {},
                    "std": df[value_columns].std().to_dict() if value_columns else {},
                    "min": df[value_columns].min().to_dict() if value_columns else {},
                    "max": df[value_columns].max().to_dict() if value_columns else {},
                }
            }
            
            # Store full data as records
            dataset_doc["data"] = df.to_dict('records')
            
            # Insert dataset
            result = await self.datasets_collection.insert_one(dataset_doc)
            
            if result.inserted_id:
                dataset_doc["_id"] = str(result.inserted_id)
                # Remove full data from response (too large)
                dataset_doc.pop("data", None)
                
                return {
                    "success": True,
                    "dataset": dataset_doc,
                    "message": "Dataset uploaded and processed successfully"
                }
            else:
                return {"success": False, "error": "Failed to save dataset"}
                
        except Exception as e:
            return {"success": False, "error": f"Error processing dataset: {str(e)}"}
    
    def _detect_date_column(self, df: pd.DataFrame) -> Optional[str]:
        """Detect the date column in a dataframe"""
        # Common date column names
        date_keywords = ['date', 'time', 'timestamp', 'datetime', 'period', 'month', 'year', 'day']
        
        for col in df.columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in date_keywords):
                try:
                    pd.to_datetime(df[col])
                    return col
                except:
                    continue
        
        # Try to detect by parsing
        for col in df.columns:
            try:
                pd.to_datetime(df[col])
                return col
            except:
                continue
        
        return None
    
    async def get_datasets(self, user_id: Optional[str] = None, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """Get datasets for a user or all datasets (admin)"""
        query = {}
        if user_id:
            query["userId"] = user_id
        
        datasets = await self.datasets_collection.find(query).skip(offset).limit(limit).to_list(limit)
        
        # Convert ObjectId to string and remove full data
        for dataset in datasets:
            dataset["_id"] = str(dataset["_id"])
            dataset.pop("data", None)  # Don't send full data in list
        
        total = await self.datasets_collection.count_documents(query)
        
        return {
            "success": True,
            "datasets": datasets,
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    async def get_dataset_by_id(self, dataset_id: str, include_data: bool = False) -> Optional[Dict[str, Any]]:
        """Get a specific dataset by ID"""
        dataset = await self.datasets_collection.find_one({"id": dataset_id})
        
        if dataset:
            dataset["_id"] = str(dataset["_id"])
            if not include_data:
                dataset.pop("data", None)
        
        return dataset
    
    async def delete_dataset(self, dataset_id: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Delete a dataset"""
        query = {"id": dataset_id}
        if user_id:
            query["userId"] = user_id
        
        result = await self.datasets_collection.delete_one(query)
        
        if result.deleted_count > 0:
            # Also delete associated predictions
            await self.predictions_collection.delete_many({"datasetId": dataset_id})
            return {"success": True, "message": "Dataset deleted successfully"}
        else:
            return {"success": False, "error": "Dataset not found or unauthorized"}
    
    async def save_prediction(self, prediction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save prediction results"""
        prediction_doc = {
            "id": str(uuid.uuid4()),
            "datasetId": prediction_data.get("datasetId"),
            "userId": prediction_data.get("userId"),
            "modelType": prediction_data.get("modelType", "prophet"),
            "predictions": prediction_data.get("predictions", []),
            "metrics": prediction_data.get("metrics", {}),
            "insights": prediction_data.get("insights", []),
            "createdAt": datetime.utcnow(),
            "parameters": prediction_data.get("parameters", {})
        }
        
        result = await self.predictions_collection.insert_one(prediction_doc)
        
        if result.inserted_id:
            prediction_doc["_id"] = str(result.inserted_id)
            return {"success": True, "prediction": prediction_doc}
        else:
            return {"success": False, "error": "Failed to save prediction"}
    
    async def get_predictions(self, dataset_id: Optional[str] = None, user_id: Optional[str] = None, limit: int = 50) -> Dict[str, Any]:
        """Get predictions"""
        query = {}
        if dataset_id:
            query["datasetId"] = dataset_id
        if user_id:
            query["userId"] = user_id
        
        predictions = await self.predictions_collection.find(query).sort("createdAt", -1).limit(limit).to_list(limit)
        
        for prediction in predictions:
            prediction["_id"] = str(prediction["_id"])
        
        return {
            "success": True,
            "predictions": predictions,
            "total": len(predictions)
        }