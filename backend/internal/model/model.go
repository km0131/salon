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

// Course (コースマスタ)
// 店舗が提供するサービスのマスターデータ。単発メニューやセット回数券の基本情報を定義。
type Course struct {
    gorm.Model
    Name       string `json:"name"`        // コース名称 (例: "全身脱毛 5回パック", "カット")
    Price      int    `json:"price"`       // 販売価格 (税込み/税抜きは運用に合わせる)
    TotalCount int    `json:"total_count"` // 規定回数。単発は1、回数券は5や10などを設定
    StoreID    uint   `json:"store_id"`    // 所属店舗ID。多店舗展開時に使用
    Store      Store  `json:"store" gorm:"foreignKey:StoreID"` // 店舗情報へのリレーション
}

// Ticket (顧客保有チケット)
// 顧客が購入した回数券の現在の消化状況を管理する。残数管理の核となるテーブル。
type Ticket struct {
    gorm.Model
    CustomerID   uint   `json:"customer_id"`   // 購入した顧客のID
    CourseID     uint   `json:"course_id"`     // どのコースのチケットか
    CurrentCount int    `json:"current_count"` // 現在までに消化した回数 (来店ごとにインクリメント)
    TotalCount   int    `json:"total_count"`   // 購入時の最大回数 (Courseマスタからコピー)
    IsCompleted  bool   `json:"is_completed"`  // 全回数を使い切ったかどうかのフラグ
    StoreID      uint   `json:"store_id"`      // 購入・発行した店舗のID
    // リレーション
    Customer     Customer `json:"customer" gorm:"foreignKey:CustomerID"`
    Course       Course   `json:"course" gorm:"foreignKey:CourseID"`
}

// Visit (来店記録)
// 実際の日々の施術・来店記録。チケット消化との紐付けも行う。
type Visit struct {
    gorm.Model
    CustomerID uint   `json:"customer_id"` // 来店した顧客のID
    CourseID   uint   `json:"course_id"`   // 今回実施したコースのID
    
    // TicketID:
    // 回数券利用の場合はTicketIDを保存。単発(その場で支払い)の場合は null。
    // ポインタ(*uint)にすることで、DB上でNULLを許容する。
    TicketID   *uint  `json:"ticket_id"`    
    
    // VisitCount:
    // この来店がそのチケットにとって「何回目」だったかをスナップショットとして記録。
    // チケット残数計算の履歴の整合性を保つために保持。
    VisitCount int    `json:"visit_count"`  
    
    StoreID    uint   `json:"store_id"`     // 来店した店舗のID
    Memo       string `json:"memo" gorm:"size:500"` // 施術内容や顧客の反応などのメモ
    
    // リレーション
    Customer   Customer `json:"customer" gorm:"foreignKey:CustomerID"`
    Course     Course   `json:"course" gorm:"foreignKey:CourseID"`
    Ticket     *Ticket  `json:"ticket" gorm:"foreignKey:TicketID"`
}