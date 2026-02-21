package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. HeaderからAuthorizationを取得
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "認証ヘッダーが必要です"})
			c.Abort()
			return
		}

		// 2. "Bearer <token>" 形式のチェック
		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "認証形式が不正です (Bearer token)"})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// 3. トークンの検証
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// 署名アルゴリズムの確認
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			// 環境変数などから秘密鍵を取得（GenerateToken時と同じ鍵）
			return []byte(os.Getenv("JWT_SECRET_KEY")), nil
		})

		// 4. エラーチェックとClaimsの取得
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "有効なトークンではありません"})
			c.Abort()
			return
		}

		// 5. 中身（Claims）をContextに保存（後続のHandlerで使うため）
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// これで各Handlerで c.Get("user_id") のように取り出せる
			c.Set("user_id", claims["user_id"])
			c.Set("role", claims["role"])
			c.Set("store_id", claims["store_id"])
		}

		c.Next()
	}
}