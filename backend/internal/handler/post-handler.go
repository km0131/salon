package handler

import (
	"fmt"
	"log"
	
	"github.com/gin-gonic/gin"
	"salon-app/backend/internal/db"
	"salon-app/backend/internal/model"
	"salon-app/backend/internal/utils"
)

// @Summary      新規登録
// @Description  新規登録
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /signup [post]
func SignUpHandler(c *gin.Context) {
    var req SignUpRequest // APIの構造体を定義
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
    var req StoreRegistrationRequest // APIの構造体を定義
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
    var req LoginRequest
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
    var req CourseRegistrationRequest
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
    var req VisitRegistrationRequest
    var ticket model.Ticket
    if err := c.ShouldBindJSON(&req); err != nil {
        log.Printf("BindJSON error: %v", err)
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }
    //　コースの検索
    var course model.Course
    if err := db.DB.First(&course, req.CourseID).Error; err != nil {
        c.JSON(404, gin.H{"error": "コースが見つかりません"})
        return
    }
    // チケットの検索
    result := db.DB.Where("customer_id = ? AND course_id = ? AND is_completed = ?", 
             req.CustomerID, req.CourseID, false).First(&ticket)
    // なければ作成
    if result.Error != nil {
        // なければ新規チケットを Course.TotalCount で作成
        ticket = model.Ticket{
            CustomerID:   req.CustomerID,
            CourseID:     req.CourseID,
            TotalCount:   course.TotalCount,
            CurrentCount: 0,      // まだ 0 回消化
            IsCompleted:  false,
            StoreID:      req.StoreID,
        }
        db.DB.Create(&ticket)
    }
    // チケットの更新
    ticket.CurrentCount += 1
    // 今回の＋1で規定回数に達した（または超えた）かチェック
    if ticket.CurrentCount >= ticket.TotalCount {
        ticket.IsCompleted = true
        log.Printf("チケットを使い切りました！ (ID: %d, Count: %d/%d)", 
            ticket.ID, ticket.CurrentCount, ticket.TotalCount)
    }
    if err := db.DB.Save(&ticket).Error; err != nil {
        log.Printf("チケットの更新に失敗: %v", err)
        c.JSON(500, gin.H{"error": "チケットの更新に失敗しました"})
        return
    }
    //　来店記録の作成
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
    var req CustomerRegistrationRequest
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

// @Summary      顧客検索(苗字：ひらがな)
// @Description  顧客検索(苗字：ひらがな)
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Customer
// @Router       /customer-search [get]
func GetCustomerSearchHandler(c *gin.Context) {
    // 1人ではなく、複数人を格納するためにスライス（[]）で定義
    var customers []model.Customer
    var req CustomerSearchRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "入力が正しくありません"})
        return
    }

    fmt.Println("検索開始")
    fmt.Println(req.LastNameKana)

    // 文字列が空の場合は検索せずに空配列を返す（DB負荷軽減）
    if req.LastNameKana == "" {
        c.JSON(200, []model.Customer{})
        return
    }

    query := "%" + req.LastNameKana + "%"
    if err := db.DB.Where("last_name_kana LIKE ?", query).Limit(10).Find(&customers).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "検索中にエラーが発生しました"})
        return
    }

    fmt.Println("検索結果")
    fmt.Println(customers)

    // 結果が0件でも空のスライス [] が返るので、フロントで扱いやすくなります
    c.JSON(200, customers)
}