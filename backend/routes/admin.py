from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional

from database import get_database
from services.auth_service import AuthService
from services.data_service import DataService
from routes.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

def require_admin(current_user: dict = Depends(get_current_user)):
    """Dependency to require admin role"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

@router.get("/users", response_model=dict)
async def get_all_users(
    limit: int = 100,
    offset: int = 0,
    admin_user: dict = Depends(require_admin)
):
    """Get all users (admin only)"""
    db = await get_database()
    users_collection = db.users
    
    users = await users_collection.find().skip(offset).limit(limit).to_list(limit)
    
    # Remove passwords
    for user in users:
        user.pop("password", None)
        user["_id"] = str(user["_id"])
    
    total = await users_collection.count_documents({})
    
    return {
        "success": True,
        "users": users,
        "total": total,
        "limit": limit,
        "offset": offset
    }

@router.get("/users/{user_id}", response_model=dict)
async def get_user(
    user_id: str,
    admin_user: dict = Depends(require_admin)
):
    """Get specific user details (admin only)"""
    db = await get_database()
    auth_service = AuthService(db)
    
    user = await auth_service.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"success": True, "user": user}

@router.patch("/users/{user_id}/status", response_model=dict)
async def update_user_status(
    user_id: str,
    is_active: bool,
    admin_user: dict = Depends(require_admin)
):
    """Activate or deactivate a user (admin only)"""
    db = await get_database()
    users_collection = db.users
    
    result = await users_collection.update_one(
        {"id": user_id},
        {"$set": {"isActive": is_active}}
    )
    
    if result.modified_count > 0:
        return {
            "success": True,
            "message": f"User {'activated' if is_active else 'deactivated'} successfully"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

@router.get("/datasets", response_model=dict)
async def get_all_datasets(
    limit: int = 100,
    offset: int = 0,
    admin_user: dict = Depends(require_admin)
):
    """Get all datasets (admin only)"""
    db = await get_database()
    data_service = DataService(db)
    
    result = await data_service.get_datasets(user_id=None, limit=limit, offset=offset)
    return result

@router.delete("/datasets/{dataset_id}", response_model=dict)
async def delete_any_dataset(
    dataset_id: str,
    admin_user: dict = Depends(require_admin)
):
    """Delete any dataset (admin only)"""
    db = await get_database()
    data_service = DataService(db)
    
    result = await data_service.delete_dataset(dataset_id, user_id=None)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"]
        )
    
    return result

@router.get("/stats", response_model=dict)
async def get_system_stats(admin_user: dict = Depends(require_admin)):
    """Get system statistics (admin only)"""
    db = await get_database()
    
    # Count documents in collections
    users_count = await db.users.count_documents({})
    datasets_count = await db.datasets.count_documents({})
    predictions_count = await db.predictions.count_documents({})
    
    # Get active users count
    active_users = await db.users.count_documents({"isActive": True})
    
    return {
        "success": True,
        "stats": {
            "totalUsers": users_count,
            "activeUsers": active_users,
            "totalDatasets": datasets_count,
            "totalPredictions": predictions_count
        }
    }