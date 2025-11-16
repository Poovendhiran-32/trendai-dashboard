from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Optional
import json

from database import get_database
from services.data_service import DataService
from routes.auth import get_current_user

router = APIRouter(prefix="/api/data", tags=["Data Management"])

@router.post("/upload", response_model=dict)
async def upload_dataset(
    file: UploadFile = File(...),
    metadata: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """Upload a dataset (CSV or Excel)"""
    # Validate file type
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV and Excel files are supported"
        )
    
    # Read file content
    content = await file.read()
    
    # Parse metadata if provided
    metadata_dict = None
    if metadata:
        try:
            metadata_dict = json.loads(metadata)
        except:
            pass
    
    # Upload and process
    db = await get_database()
    data_service = DataService(db)
    
    result = await data_service.upload_dataset(
        content,
        file.filename,
        current_user["user_id"],
        metadata_dict
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result

@router.get("/datasets", response_model=dict)
async def get_datasets(
    limit: int = 100,
    offset: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """Get user's datasets"""
    db = await get_database()
    data_service = DataService(db)
    
    # Regular users see only their datasets, admins see all
    user_id = None if current_user.get("role") == "admin" else current_user["user_id"]
    
    result = await data_service.get_datasets(user_id, limit, offset)
    return result

@router.get("/datasets/{dataset_id}", response_model=dict)
async def get_dataset(
    dataset_id: str,
    include_data: bool = False,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific dataset"""
    db = await get_database()
    data_service = DataService(db)
    
    dataset = await data_service.get_dataset_by_id(dataset_id, include_data)
    
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
    
    return {"success": True, "dataset": dataset}

@router.delete("/datasets/{dataset_id}", response_model=dict)
async def delete_dataset(
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a dataset"""
    db = await get_database()
    data_service = DataService(db)
    
    # Admins can delete any dataset, users only their own
    user_id = None if current_user.get("role") == "admin" else current_user["user_id"]
    
    result = await data_service.delete_dataset(dataset_id, user_id)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"]
        )
    
    return result

@router.get("/predictions", response_model=dict)
async def get_predictions(
    dataset_id: Optional[str] = None,
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """Get predictions"""
    db = await get_database()
    data_service = DataService(db)
    
    # Regular users see only their predictions
    user_id = None if current_user.get("role") == "admin" else current_user["user_id"]
    
    result = await data_service.get_predictions(dataset_id, user_id, limit)
    return result