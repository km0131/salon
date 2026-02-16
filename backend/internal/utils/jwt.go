package utils

import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("salon-app-secret-2026-debug") // 本来は環境変数から読み込む

func GenerateToken(userID uint, userName string, role string, storeID uint, storeName string) (string, error) {
    claims := jwt.MapClaims{
        "user_id": userID,
        "user_name": userName,
        "role":    role,
        "store_id": storeID,
        "store_name": storeName,
        "exp":     time.Now().Add(time.Hour * 24).Unix(), // 24時間有効
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(secretKey)
}