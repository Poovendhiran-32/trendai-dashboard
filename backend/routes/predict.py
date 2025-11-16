from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from database import get_database
from services.data_service import DataService
from ml.predictor import TimeSeriesPredictor
from routes.auth import get_current_user

router = APIRouter(prefix="/api/predict", tags=["Predictions"])

class PredictionRequest(BaseModel):
    datasetId: str
    dateColumn: str
    valueColumn: str
    forecastPeriods: int = 30
    modelType: str = "arima"  # arima or prophet

@router.post("/analyze", response_model=dict)
async def analyze_and_predict(
    request: PredictionRequest,
    current_user: dict = Depends(get_current_user)
):
    """Analyze dataset and generate predictions"""
    db = await get_database()
    data_service = DataService(db)
    
    # Get dataset
    dataset = await data_service.get_dataset_by_id(request.datasetId, include_data=True)
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Check authorization
    if current_user.get("role") != "admin" and dataset.get("userId") != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this dataset"
        )
    
    # Validate columns
    if request.dateColumn not in dataset.get("columns", []):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Date column '{request.dateColumn}' not found in dataset"
        )
    
    if request.valueColumn not in dataset.get("columns", []):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Value column '{request.valueColumn}' not found in dataset"
        )
    
    # Perform analysis
    predictor = TimeSeriesPredictor()
    
    try:
        analysis_result = predictor.analyze(
            dataset.get("data", []),
            request.dateColumn,
            request.valueColumn,
            request.forecastPeriods
        )
        
        if not analysis_result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=analysis_result.get("error", "Analysis failed")
            )
        
        # Save prediction results
        prediction_data = {
            "datasetId": request.datasetId,
            "userId": current_user["user_id"],
            "modelType": request.modelType,
            "predictions": analysis_result.get("forecast", {}).get("forecast", []),
            "metrics": analysis_result.get("forecast", {}).get("metrics", {}),
            "insights": analysis_result.get("insights", []),
            "parameters": {
                "dateColumn": request.dateColumn,
                "valueColumn": request.valueColumn,
                "forecastPeriods": request.forecastPeriods
            }
        }
        
        save_result = await data_service.save_prediction(prediction_data)
        
        # Return complete analysis
        return {
            "success": True,
            "analysis": analysis_result,
            "predictionId": save_result.get("prediction", {}).get("id") if save_result.get("success") else None
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during analysis: {str(e)}"
        )

@router.get("/trends/{dataset_id}", response_model=dict)
async def get_trends(
    dataset_id: str,
    date_column: str,
    value_column: str,
    current_user: dict = Depends(get_current_user)
):
    """Get trend analysis for a dataset"""
    db = await get_database()
    data_service = DataService(db)
    
    dataset = await data_service.get_dataset_by_id(dataset_id, include_data=True)
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Check authorization
    if current_user.get("role") != "admin" and dataset.get("userId") != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    predictor = TimeSeriesPredictor()
    predictor.prepare_data(dataset.get("data", []), date_column, value_column)
    
    trend_data = predictor.detect_trend()
    
    return {
        "success": True,
        "trend": trend_data
    }

@router.get("/seasonality/{dataset_id}", response_model=dict)
async def get_seasonality(
    dataset_id: str,
    date_column: str,
    value_column: str,
    current_user: dict = Depends(get_current_user)
):
    """Get seasonal decomposition for a dataset"""
    db = await get_database()
    data_service = DataService(db)
    
    dataset = await data_service.get_dataset_by_id(dataset_id, include_data=True)
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Check authorization
    if current_user.get("role") != "admin" and dataset.get("userId") != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    predictor = TimeSeriesPredictor()
    predictor.prepare_data(dataset.get("data", []), date_column, value_column)
    
    seasonal_data = predictor.seasonal_decomposition()
    
    return {
        "success": True,
        "seasonality": seasonal_data
    }