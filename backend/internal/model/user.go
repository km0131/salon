package model

import "gorm.io/gorm"

type User struct { // 大文字にする
    gorm.Model
    Name  string `json:"name"`
    Email string `json:"email" gorm:"unique"`
}