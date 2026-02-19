package handler

import (
	"github.com/gin-gonic/gin"
	"salon-app/backend/internal/db"
	"salon-app/backend/internal/model"
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

// @Summary      スタッフ一覧 (ユーザー一覧)
// @Description  スタッフ一覧取得
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.User
// @Router       /users [get]
func GetUserListHandler(c *gin.Context) {
    var users []model.User
    // StoreもPreloadしておく（表示用）
    if err := db.DB.Preload("Store").Find(&users).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to fetch users"})
        return
    }
    // model.User の Password は json:"-" なので自動で隠れるが念のため
    c.JSON(200, users)
}

// @Summary      来店履歴一覧
// @Description  来店履歴一覧取得
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Visit
// @Router       /visit [get]
func GetVisitHandler(c *gin.Context) {
    var visits []model.Visit
    if err := db.DB.Preload("Customer").Preload("Course").Preload("Store").Find(&visits).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to fetch visits"})
        return
    }
    c.JSON(200, visits)
}

// @Summary      来店履歴検索
// @Description  来店履歴検索
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Visit
// @Router       /visit/search [get]
func GetVisitSearchHandler(c *gin.Context) {
    var visits []model.Visit
    if err := db.DB.Preload("Customer").Preload("Course").Preload("Store").Find(&visits).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to fetch visits"})
        return
    }
    c.JSON(200, visits)
}

// @Summary      顧客一覧
// @Description  顧客一覧取得
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Customer
// @Router       /customer [get]
func GetCustomerHandler(c *gin.Context) {
    var customers []model.Customer
    if err := db.DB.Preload("Store").Find(&customers).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to fetch customers"})
        return
    }
    c.JSON(200, customers)
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

// @Summary      チケット一覧
// @Description  チケット一覧
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} map[string]string
// @Router       /ticket [get]
func GetTicketHandler(c *gin.Context) {
    var tickets []struct {
        ID   uint   `json:"id"`
        Name string `json:"name"`
    }
    if err := db.DB.Model(&model.Ticket{}).Select("id", "name").Find(&tickets).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to fetch tickets"})
        return
    }
    c.JSON(200, gin.H{"tickets": tickets})
}


// @Summary      コース一覧
// @Description  コース一覧
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200 {object} model.Course
// @Router       /course [get]
func GetCourseHandler(c *gin.Context) {
    var courses []model.Course
    if err := db.DB.Find(&courses).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to get courses"})
        return
    }
    c.JSON(200, courses)
}
