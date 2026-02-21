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
    swaggerFiles "github.com/swaggo/files"
    ginSwagger "github.com/swaggo/gin-swagger"

    // 自前パッケージはすべて salon-app/backend に統一
    "salon-app/backend/internal/db"
    "salon-app/backend/internal/handler"
    "salon-app/backend/internal/middleware"
    "salon-app/backend/internal/model"
    _ "salon-app/backend/docs"
)
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

    v0 := r.Group("/api/v0")
    {
        v0.GET("/ping", handler.PingHandler)
        v0.POST("/login", handler.LoginHandler)   // ログイン
    }

    v1 := r.Group("/api/v1")
    v1.Use(middleware.AuthRequired())
    {
        v1.GET("/store", handler.GetStoreHandler)//店舗一覧
        v1.GET("/customer", handler.GetCustomerHandler)//顧客一覧
        v1.GET("/course", handler.GetCourseHandler)//コース一覧
        v1.GET("/ticket", handler.GetTicketHandler)//チケット一覧
        v1.GET("/visit", handler.GetVisitHandler)//来店履歴一覧
        v1.GET("/users", handler.GetUserListHandler)//スタッフ一覧
        v1.POST("/signup", handler.SignUpHandler) // 新規登録
        v1.POST("/store-registration", handler.StoreRegistrationHandler) // 店舗登録
        v1.POST("/course-registration", handler.CourseRegistrationHandler) // コース登録
        v1.POST("/visit-registration", handler.VisitRegistrationHandler) // 来店登録
        v1.POST("/customer-registration", handler.CustomerRegistrationHandler) // 顧客登録
        v1.POST("/customer-search", handler.GetCustomerSearchHandler)//顧客検索(苗字：ひらがな)
        v1.PUT("/store/:id", handler.UpdateStoreHandler)//店舗更新
        v1.PUT("/users/:id", handler.UpdateUserHandler)//スタッフ更新
        v1.PUT("/customer/:id", handler.UpdateCustomerHandler)//顧客更新
        v1.PUT("/visit/:id", handler.UpdateVisitHandler)//来店履歴更新
        v1.PUT("/course/:id", handler.UpdateCourseHandler)//コース更新
        v1.PUT("/ticket/:id", handler.UpdateTicketHandler)//チケット更新
        v1.DELETE("/course/:id", handler.DeleteCourseHandler)//コース削除
    }

    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    r.Run(":8080")
}