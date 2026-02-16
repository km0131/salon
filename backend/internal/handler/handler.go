package handler

import (
)

type SignUpRequest struct {
	Name     string `json:"name" binding:"required"`
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required,min=4,max=16"`
	Role     string `json:"role"     binding:"required,oneof=admin manager"` // adminかmanagerのみ許可
	StoreID  uint   `json:"store_id" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required,min=4,max=16"`
}

type StoreRegistrationRequest struct {
	Name string `json:"name" binding:"required"`
}

