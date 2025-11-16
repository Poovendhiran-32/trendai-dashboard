from typing import Optional, Dict, Any
from datetime import datetime
import uuid
from motor.motor_asyncio import AsyncIOMotorDatabase

from utils.hashing import hash_password, verify_password
from utils.jwt_handler import create_access_token, create_refresh_token

class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db.users
    
    async def register_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new user"""
        # Check if user already exists
        existing_user = await self.users_collection.find_one({"email": user_data["email"]})
        if existing_user:
            return {"success": False, "error": "User with this email already exists"}
        
        # Hash password
        hashed_password = hash_password(user_data["password"])
        
        # Create user document
        user_doc = {
            "id": str(uuid.uuid4()),
            "email": user_data["email"],
            "name": f"{user_data['firstName']} {user_data['lastName']}",
            "firstName": user_data["firstName"],
            "lastName": user_data["lastName"],
            "company": user_data["company"],
            "role": user_data.get("role", "user"),
            "industry": user_data["industry"],
            "password": hashed_password,
            "isActive": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert user
        result = await self.users_collection.insert_one(user_doc)
        
        if result.inserted_id:
            # Remove password from response
            user_doc.pop("password")
            user_doc["_id"] = str(result.inserted_id)
            
            return {
                "success": True,
                "user": user_doc,
                "message": "User registered successfully"
            }
        else:
            return {"success": False, "error": "Failed to create user"}
    
    async def authenticate_user(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate a user and return tokens"""
        # Find user by email
        user = await self.users_collection.find_one({"email": email})
        
        if not user:
            return {"success": False, "error": "Invalid email or password"}
        
        # Verify password
        if not verify_password(password, user["password"]):
            return {"success": False, "error": "Invalid email or password"}
        
        # Check if user is active
        if not user.get("isActive", True):
            return {"success": False, "error": "Account is deactivated"}
        
        # Create tokens
        token_data = {
            "sub": user["email"],
            "user_id": user.get("id", str(user["_id"])),
            "role": user.get("role", "user")
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        # Update last login
        await self.users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"lastLogin": datetime.utcnow()}}
        )
        
        # Remove password from response
        user.pop("password")
        user["_id"] = str(user["_id"])
        
        return {
            "success": True,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user
        }
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        user = await self.users_collection.find_one({"email": email})
        if user:
            user.pop("password", None)
            user["_id"] = str(user["_id"])
        return user
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        user = await self.users_collection.find_one({"id": user_id})
        if user:
            user.pop("password", None)
            user["_id"] = str(user["_id"])
        return user
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user information"""
        # Remove fields that shouldn't be updated directly
        update_data.pop("password", None)
        update_data.pop("email", None)
        update_data.pop("id", None)
        
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await self.users_collection.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            user = await self.get_user_by_id(user_id)
            return {"success": True, "user": user}
        else:
            return {"success": False, "error": "User not found or no changes made"}
    
    async def change_password(self, user_id: str, old_password: str, new_password: str) -> Dict[str, Any]:
        """Change user password"""
        user = await self.users_collection.find_one({"id": user_id})
        
        if not user:
            return {"success": False, "error": "User not found"}
        
        # Verify old password
        if not verify_password(old_password, user["password"]):
            return {"success": False, "error": "Invalid current password"}
        
        # Hash new password
        hashed_password = hash_password(new_password)
        
        # Update password
        result = await self.users_collection.update_one(
            {"id": user_id},
            {"$set": {"password": hashed_password, "updatedAt": datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            return {"success": True, "message": "Password changed successfully"}
        else:
            return {"success": False, "error": "Failed to change password"}