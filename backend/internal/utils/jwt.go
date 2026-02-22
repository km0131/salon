package utils

import (
    "time"
    "os"
    "github.com/golang-jwt/jwt/v5"
)

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
    return token.SignedString([]byte(os.Getenv("JWT_SECRET_KEY")))
}