// @title Salon App API
// @version 1.0
// @description これはサロン顧客管理用APIです。
// @host localhost:8080
// @BasePath /api/v1
package main // ← 必ず1行目！

import (
    "time"
    "fmt"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "salon-app/backend/internal/handler" 
    "salon-app/backend/internal/utils"   
    swaggerFiles "github.com/swaggo/files"
    ginSwagger "github.com/swaggo/gin-swagger"

    "salon-app/backend/internal/db"
    "salon-app/backend/internal/middleware"
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
    var stores []struct {
        ID   uint   `json:"id"`
        Name string `json:"name"`
    }
    if err := db.DB.Model(&model.Store{}).Select("id", "name").Find(&stores).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to fetch stores"})
        return
    }
    c.JSON(200, gin.H{"stores": stores})
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
        fmt.Printf("【重要ログ】JSONバインド失敗の原因: %v\n", err)
        c.Error(err)
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }
    hashed, err := utils.HashPassword(req.Password)
    if err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "ハッシュ化失敗"})
        return
    }
    //DBに保存する構造体を定義
    var user model.User
    user.Name = req.Name
    user.Email = req.Email
    user.Password = hashed
    user.StoreID = req.StoreID
    user.Role = req.Role
    if err := db.DB.Create(&user).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to create user"})
        return
    }
    c.JSON(200, gin.H{"message": "登録完了"})
}

// @Summary      店舗登録
// @Description  店舗登録
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /store-registration [post]
func StoreRegistrationHandler(c *gin.Context) {
    var req handler.StoreRegistrationRequest // APIの構造体を定義
    if err := c.ShouldBindJSON(&req); err != nil { //APIの値をチェック
        c.Error(err)
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }
    //DBに保存する構造体を定義
    var store model.Store
    store.Name = req.Name
    if err := db.DB.Create(&store).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to register store"})
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
        c.Error(err)
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }

    // データベースからユーザーを検索
    var user model.User
    if err := db.DB.Preload("Store").Where("email = ?", req.Email).First(&user).Error; err != nil {
        // ユーザーが見つからない場合
        c.Error(err)
        c.JSON(401, gin.H{"error": "メールアドレスがありません"})
        return
    }

    // パスワードの照合 (Argon2)
    // 保存されているハッシュ(user.Password)と、入力された平文(req.Password)を比較
    match, err := utils.CheckPassword(req.Password, user.Password)
    if err != nil || !match {
        c.Error(err)
        c.JSON(401, gin.H{"error": "パスワードが正しくありません"})
        return
    }

    // JWTトークンの生成
    // ログイン成功！ユーザーIDと権限（Role）をトークンに詰め込む
    token, err := utils.GenerateToken(user.ID, user.Name, user.Role, user.StoreID, user.Store.Name)
    if err != nil {
        c.Error(err)
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

// @Summary      コース登録
// @Description  コース登録
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /course-registration [post]
func CourseRegistrationHandler(c *gin.Context) {
    var req handler.CourseRegistrationRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }
    var course model.Course
    course.Name = req.Name
    course.Price = req.Price
    course.TotalCount = req.TotalCount
    course.StoreID = req.StoreID
    if err := db.DB.Create(&course).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to register course"})
        return
    }
    c.JSON(200, gin.H{"message": "登録完了"})
}

// @Summary      来店登録
// @Description  来店登録
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /visit-registration [post]
func VisitRegistrationHandler(c *gin.Context) {
    var req handler.VisitRegistrationRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }
    var visit model.Visit
    visit.CustomerID = req.CustomerID
    visit.CourseID = req.CourseID
    visit.TicketID = req.TicketID
    visit.VisitCount = req.VisitCount
    visit.StoreID = req.StoreID
    visit.Memo = req.Memo
    if err := db.DB.Create(&visit).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to register visit"})
        return
    }
    c.JSON(200, gin.H{"message": "登録完了"})
}

// @Summary      顧客登録
// @Description  顧客登録
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /customer-registration [post]
func CustomerRegistrationHandler(c *gin.Context) {
    var req handler.CustomerRegistrationRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }
    var customer model.Customer
    customer.LastName = req.LastName
    customer.FirstName = req.FirstName
    customer.LastNameKana = req.LastNameKana
    customer.FirstNameKana = req.FirstNameKana
    customer.ZipCode = req.ZipCode
    customer.PrefName = req.PrefName
    customer.Address1 = req.Address1
    customer.Address2 = req.Address2
    customer.Sex = req.Sex
    customer.BirthDate = req.BirthDate
    customer.Phone = req.Phone
    customer.StoreID = req.StoreID
    if err := db.DB.Create(&customer).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to register customer"})
        return
    }
    c.JSON(200, gin.H{"message": "登録完了"})
}

func main() {
    db.InitDB()
    db.DB.AutoMigrate(&model.User{}, &model.Store{}, &model.Customer{}, &model.Course{}, &model.Visit{}, &model.Ticket{})

    r := gin.Default()

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        // Headersに "Authorization" と "X-Requested-With" を追加
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
        ExposeHeaders:    []string{"Content-Length"},
        MaxAge:           12 * time.Hour,
    }))

    r.Use(middleware.ErrorHandler())

    v1 := r.Group("/api/v1")
    {
        // main関数の中のインライン定義ではなく、上で定義した関数を使う
        v1.GET("/ping", PingHandler)
        v1.GET("/store", GetStoreHandler)//店舗一覧
        v1.POST("/signup", SignUpHandler) // 新規登録
        v1.POST("/login", LoginHandler)   // ログイン
        v1.POST("/store-registration", StoreRegistrationHandler) // 店舗登録
        v1.POST("/course-registration", CourseRegistrationHandler) // コース登録
        v1.POST("/visit-registration", VisitRegistrationHandler) // 来店登録
        v1.POST("/customer-registration", CustomerRegistrationHandler) // 顧客登録
    }

    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    r.Run(":8080")
}