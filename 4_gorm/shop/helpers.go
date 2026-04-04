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

// Load data from any model by ID with optional preloads
func loadByID[T any](db *gorm.DB, id uint, preloads ...string) (*T, error) {
	var model T

	query := db
	for _, preload := range preloads {
		query = query.Preload(preload)
	}

	if r := query.First(&model, "id = ?", id); r.Error != nil {
		if errors.Is(r.Error, gorm.ErrRecordNotFound) {
			return nil, echo.NewHTTPError(http.StatusNotFound, "Record with provided ID not found")
		}
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "Database error")
	}
	return &model, nil
}
