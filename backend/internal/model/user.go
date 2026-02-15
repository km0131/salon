package model

import "gorm.io/gorm"

type User struct {
    gorm.Model
    Name     string `json:"name"`
    Email    string `json:"email" gorm:"unique;not null"`
    // PasswordはJSONレスポンスに含めないよう `json:"-"` を指定します
    Password string `json:"-" gorm:"not null"` 
    // 権限（例: admin, staff, customer）
    Role     string `json:"role" gorm:"default:customer"` 
}