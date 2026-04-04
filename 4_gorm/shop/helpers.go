package shop

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v5"
	"gorm.io/gorm"
)

// Parse the id parameter from the URL and convert it to int
func parseID(c *echo.Context) (uint, error) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return 0, echo.NewHTTPError(http.StatusBadRequest, "Could not parse ID as integer")
	}
	if id <= 0 {
		return 0, echo.NewHTTPError(http.StatusBadRequest, "ID has to be larger than 0")
	}
	return uint(id), nil
}

func ByID(id uint) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("id = ?", id)
	}
}

func WithCategories() func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Preload("Categories")
	}
}

func WithContainedCategories() func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Preload("Contained.Categories")
	}
}

func loadByID[T any](db *gorm.DB, id uint, scopes ...func(*gorm.DB) *gorm.DB) (*T, error) {
	var model T
	query := db.Scopes(ByID(id))
	if len(scopes) > 0 {
		query = query.Scopes(scopes...)
	}
	if err := query.First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, echo.NewHTTPError(http.StatusNotFound, "Record with provided ID not found")
		}
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "Database error")
	}
	return &model, nil
}
