package handler

import (
	"github.com/gin-gonic/gin"
	"salon-app/backend/internal/db"
	"salon-app/backend/internal/model"
)

// @Summary      コース削除
// @Description  指定したIDのコースを論理削除します
// @Tags         course
// @Accept       json
// @Produce      json
// @Param        id   path      int  true  "Course ID"
// @Success      200  {object}  map[string]string
// @Router       /course/{id} [delete]
func DeleteCourseHandler(c *gin.Context) {
    // 1. URLパラメータからIDを取得
    id := c.Param("id")
    if id == "" {
        c.JSON(400, gin.H{"error": "ID is required"})
        return
    }

    // 2. 指定されたIDのレコードを削除（gorm.Modelなので自動で論理削除になる）
    // 第二引数に id を渡すことで、WHERE id = ? が自動で生成されます
    if err := db.DB.Delete(&model.Course{}, id).Error; err != nil {
        c.Error(err)
        c.JSON(500, gin.H{"error": "Failed to delete course"})
        return
    }

    // 3. 成功レスポンス
    c.JSON(200, gin.H{"message": "Course deleted successfully", "id": id})
}