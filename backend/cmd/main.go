// @title Salon App API
// @version 1.0
// @description これはサロン顧客管理用APIです。
// @host localhost:8080
// @BasePath /api/v1
package main // ← 必ず1行目！

import (
    "time"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "salon-app/backend/internal/handler" 
    "salon-app/backend/internal/utils"   
    swaggerFiles "github.com/swaggo/files"
    ginSwagger "github.com/swaggo/gin-swagger"

    "salon-app/backend/internal/db"
    "salon-app/backend/internal/model"
    _ "salon-app/backend/docs" 
)

// @Summary      疎通確認
// @Description  サーバーの生存確認用
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /ping [get]
func PingHandler(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello from Go Backend!"})
}

// @Summary      店舗一覧
// @Description  店舗一覧
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /store [get]
func GetStoreHandler(c *gin.Context) {
    var names []string
    if err := db.DB.Model(&model.Store{}).Pluck("name", &names).Error; err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, gin.H{"stores": names})
}

// @Summary      新規登録
// @Description  新規登録
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /signup [post]
func SignUpHandler(c *gin.Context) {
    var req handler.SignUpRequest // APIの構造体を定義
    if err := c.ShouldBindJSON(&req); err != nil { //APIの値をチェック
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }
    hashed, err := utils.HashPassword(req.Password)
    if err != nil {
        c.JSON(500, gin.H{"error": "ハッシュ化失敗"})
        return
    }
    //DBに保存する構造体を定義
    var user model.User
    user.Name = req.Name
    user.Email = req.Email
    user.Password = hashed
    if err := db.DB.Create(&user).Error; err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, gin.H{"message": "登録完了"})
}

// @Summary      ログイン
// @Description  ログイン
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /login [post]
func LoginHandler(c *gin.Context) {
    var req handler.LoginRequest
    // リクエストのバリデーション（EmailとPasswordがあるか）
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }

    // データベースからユーザーを検索
    var user model.User
    if err := db.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
        // ユーザーが見つからない場合
        c.JSON(401, gin.H{"error": "メールアドレスがありません"})
        return
    }

    // パスワードの照合 (Argon2)
    // 保存されているハッシュ(user.Password)と、入力された平文(req.Password)を比較
    match, err := utils.CheckPassword(req.Password, user.Password)
    if err != nil || !match {
        c.JSON(401, gin.H{"error": "パスワードが正しくありません"})
        return
    }

    // JWTトークンの生成
    // ログイン成功！ユーザーIDと権限（Role）をトークンに詰め込む
    token, err := utils.GenerateToken(user.ID, user.Name, user.Role, user.StoreID, user.Store.Name)
    if err != nil {
        c.JSON(500, gin.H{"error": "トークンの生成に失敗しました"})
        return
    }

    // 成功レスポンス（トークンを返す）
    c.JSON(200, gin.H{
        "message": "ログイン成功",
        "token":   token, // フロントエンドはこれを受け取って保存する
        "user": gin.H{
            "name": user.Name,
            "role": user.Role,
        },
    })
}

func main() {
    db.InitDB()
    db.DB.AutoMigrate(&model.User{})

    r := gin.Default()

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
        MaxAge:           12 * time.Hour,
    }))

    v1 := r.Group("/api/v1")
    {
        // main関数の中のインライン定義ではなく、上で定義した関数を使う
        v1.GET("/ping", PingHandler)
        v1.GET("/store", GetStoreHandler)//店舗一覧
        v1.POST("/signup", SignUpHandler) // 新規登録
        v1.POST("/login", LoginHandler)   // ログイン
    }

    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    r.Run(":8080")
}