package handler

import (
	"time"
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

type CourseRegistrationRequest struct {
	Name string `json:"name" binding:"required"`
	Price int `json:"price" binding:"required"`
	TotalCount int `json:"total_count" binding:"required"`
	StoreID uint `json:"store_id" binding:"required"`
}

type VisitRegistrationRequest struct {
	CustomerID uint `json:"customer_id" binding:"required"`
	CourseID uint `json:"course_id" binding:"required"`
	TicketID *uint `json:"ticket_id"`
	VisitCount int `json:"visit_count"`
	StoreID uint `json:"store_id" binding:"required"`
	Memo string `json:"memo"`
}

type CustomerRegistrationRequest struct {
	LastName      string `json:"last_name" binding:"required"`
	FirstName     string `json:"first_name" binding:"required"`
	LastNameKana  string `json:"last_name_kana"`
	FirstNameKana string `json:"first_name_kana"`
	ZipCode  string `json:"zip_code"`
	PrefName string `json:"pref_name"`
	Address1 string `json:"address1"`
	Address2 string `json:"address2"`
	Sex       string    `json:"sex"`
	BirthDate time.Time `json:"birth_date"`
	Phone     string    `json:"phone"`
	StoreID uint `json:"store_id" binding:"required"`
}

type CustomerSearchRequest struct {
	LastNameKana string `json:"last_name_kana" binding:"required"`
}

type StoreUpdateRequest struct {
	Name string `json:"name" binding:"required"`
}
