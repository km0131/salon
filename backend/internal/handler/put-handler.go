package handler

import (
	"github.com/gin-gonic/gin"
	"salon-app/backend/internal/db"
	"salon-app/backend/internal/model"
	"salon-app/backend/internal/utils"
)


// @Summary      コース一覧
// @Description  コース一覧
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Course
// @Router       /course [put]
func UpdateStoreHandler(c *gin.Context) {
    id := c.Param("id") // URLの末尾（/api/v1/stores/5）からIDを取得
    var store model.Store

    // 1. 指定されたIDのデータがDBにあるか確認
    if err := db.DB.First(&store, id).Error; err != nil {
        c.JSON(404, gin.H{"error": "店舗が見つかりません"})
        return
    }

    // 2. フロントから届いた新しい名前などを読み込む
    if err := c.ShouldBindJSON(&store); err != nil {
        c.JSON(400, gin.H{"error": "入力データが正しくありません"})
        return
    }

    // 3. DBを更新する
    db.DB.Save(&store)

    c.JSON(200, store)
}



// @Summary      顧客更新
// @Description  顧客更新
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Customer
// @Router       /customer/:id [put]
func UpdateCustomerHandler(c *gin.Context) {
    id := c.Param("id")
    var customer model.Customer
    if err := db.DB.First(&customer, id).Error; err != nil {
        c.JSON(404, gin.H{"error": "Customer not found"})
        return
    }

    var req CustomerUpdateRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "Invalid input"})
        return
    }

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

    if err := db.DB.Save(&customer).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to update customer"})
        return
    }
    c.JSON(200, customer)
}


// @Summary      来店履歴更新
// @Description  来店履歴更新
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Visit
// @Router       /visit/:id [put]
func UpdateVisitHandler(c *gin.Context) {
    id := c.Param("id")
    var visit model.Visit
    if err := db.DB.First(&visit, id).Error; err != nil {
        c.JSON(404, gin.H{"error": "Visit not found"})
        return
    }

    var req VisitUpdateRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "Invalid input"})
        return
    }

    visit.CustomerID = req.CustomerID
    visit.CourseID = req.CourseID
    visit.TicketID = req.TicketID
    visit.VisitCount = req.VisitCount
    visit.StoreID = req.StoreID
    visit.Memo = req.Memo

    if err := db.DB.Save(&visit).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to update visit"})
        return
    }
    c.JSON(200, visit)
}


// @Summary      スタッフ更新
// @Description  スタッフ更新
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.User
// @Router       /users/:id [put]
func UpdateUserHandler(c *gin.Context) {
    id := c.Param("id")
    var user model.User
    if err := db.DB.First(&user, id).Error; err != nil {
        c.JSON(404, gin.H{"error": "User not found"})
        return
    }

    var req UserUpdateRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "Invalid input"})
        return
    }

    user.Name = req.Name
    user.Email = req.Email
    user.Role = req.Role
    user.StoreID = req.StoreID

    // パスワード更新がある場合のみハッシュ化してセット
    if req.Password != "" {
        hashed, err := utils.HashPassword(req.Password)
        if err != nil {
            c.Error(err)
            c.JSON(500, gin.H{"error": "Failed to hash password"})
            return
        }
        user.Password = hashed
    }

    if err := db.DB.Save(&user).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to update user"})
        return
    }
    c.JSON(200, user)
}

// @Summary      コース更新
// @Description  コース更新
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Course
// @Router       /course/:id [put]
func UpdateCourseHandler(c *gin.Context) {
    id := c.Param("id")
    var course model.Course
    if err := db.DB.First(&course, id).Error; err != nil {
        c.JSON(404, gin.H{"error": "Course not found"})
        return
    }

    var req CourseUpdateRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "Invalid input"})
        return
    }

    course.Name = req.Name
    course.Price = req.Price
    course.TotalCount = req.TotalCount
    course.StoreID = req.StoreID

    if err := db.DB.Save(&course).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to update course"})
        return
    }
    c.JSON(200, course)
}

// @Summary      チケット更新
// @Description  チケット更新
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Ticket
// @Router       /ticket/:id [put]
func UpdateTicketHandler(c *gin.Context) {
    id := c.Param("id")
    var ticket model.Ticket
    if err := db.DB.First(&ticket, id).Error; err != nil {
        c.JSON(404, gin.H{"error": "Ticket not found"})
        return
    }

    var req TicketUpdateRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(err)
        c.JSON(400, gin.H{"error": "Invalid input"})
        return
    }

    // ticket.Name = req.Name
    // ticket.Price = req.Price
    ticket.TotalCount = req.TotalCount
    ticket.StoreID = req.StoreID

    if err := db.DB.Save(&ticket).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to update ticket"})
        return
    }
    c.JSON(200, ticket)
}
