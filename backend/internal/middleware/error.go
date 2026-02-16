package middleware

import (
	"os"

	"github.com/gin-gonic/gin"
)

// ErrorHandler is a middleware that handles errors collected in gin.Context.
// It returns a detailed JSON response if any errors occurred during the request life cycle.
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Only handle errors if there are any
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			
			// Get debug mode from environment
			debug := os.Getenv("GIN_MODE") != "release"

			if debug {
				// In debug mode, return the full error message
				c.JSON(c.Writer.Status(), gin.H{
					"error":   err.Error(),
					"details": err.Meta,
					"message": "An internal error occurred",
				})
			} else {
				// In production, return a generic message to avoid leaking internal details
				c.JSON(c.Writer.Status(), gin.H{
					"error":   "Internal Server Error",
					"message": "An unexpected error occurred. Please try again later.",
				})
			}
		}
	}
}
