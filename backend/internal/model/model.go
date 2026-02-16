package model

import "gorm.io/gorm"

//gorm.Modelは以下の定義を含んでいる
// ID        uint           `gorm:"primaryKey"`
// CreatedAt time.Time
// UpdatedAt time.Time
// DeletedAt gorm.DeletedAt `gorm:"index"`

type User struct {
    gorm.Model
    Name     string `json:"name"`
    Email    string `json:"email" gorm:"unique;not null"`
    // PasswordはJSONレスポンスに含めないよう `json:"-"` を指定します
    Password string `json:"-" gorm:"not null"` 
    // 権限（例: admin, staff, customer）
    Role     string `json:"role" gorm:"default:customer"` 
    StoreID  uint   `json:"store_id"`
    Store    Store  `json:"store" gorm:"foreignKey:StoreID;-"`//外部から呼び出し
}

type Store struct {
    gorm.Model 
    Name     string `json:"name"` //店舗名
} //user.Store.Nameで呼び出せる



