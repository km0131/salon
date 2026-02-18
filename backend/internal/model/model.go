package model

import (
	"time"

	"gorm.io/gorm"
)

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
    Store    Store  `json:"store" gorm:"foreignKey:StoreID"`//外部から呼び出し
}

type Store struct {
    gorm.Model 
    Name     string `json:"name"` //店舗名
} //user.Store.Nameで呼び出せる

type Customer struct {
    gorm.Model
    // 名前（フリガナ含め分けているのはGood!）
    LastName      string `json:"last_name" gorm:"size:50;not null"`
    FirstName     string `json:"first_name" gorm:"size:50;not null"`
    LastNameKana  string `json:"last_name_kana" gorm:"size:50"`
    FirstNameKana string `json:"first_name_kana" gorm:"size:50"`

    // 住所（ポストくん構成）
    ZipCode  string `json:"zip_code" gorm:"size:7"`
    PrefName string `json:"pref_name" gorm:"size:20"` // 文字列で持つパターン
    Address1 string `json:"address1" gorm:"size:255"` // 市区町村・町域
    Address2 string `json:"address2" gorm:"size:255"` // ビル・マンション名

    // 属性情報
    Sex       string    `json:"sex" gorm:"size:10"`
    BirthDate time.Time `json:"birth_date" gorm:"type:date"` // 日付型がおすすめ
    Phone     string    `json:"phone" gorm:"size:20"`      // uintからstringへ変更

    // 店舗紐付け
    StoreID uint  `json:"store_id"`
    Store   Store `json:"store" gorm:"foreignKey:StoreID"`
}

type Course struct {
    gorm.Model
    Name string `json:"name"`
    Price int `json:"price"`
    StoreID uint `json:"store_id"`
    Store Store `json:"store" gorm:"foreignKey:StoreID"`
}

type Visit struct {
    gorm.Model
    // 誰が（顧客ID）
    CustomerID uint     `json:"customer_id" gorm:"not null"`
    Customer   Customer `json:"customer" gorm:"foreignKey:CustomerID"`

    // どのコースで（コースID）
    CourseID   uint     `json:"course_id" gorm:"not null"`
    Course     Course   `json:"course" gorm:"foreignKey:CourseID"`

    // どの店舗に（店舗ID）
    StoreID    uint     `json:"store_id" gorm:"not null"`
    Store      Store    `json:"store" gorm:"foreignKey:StoreID"`
    
    // メモ（「今日は髪色を変えた」などの補足用。不要なら削除OK）
    Memo       string   `json:"memo" gorm:"size:500"`
}
