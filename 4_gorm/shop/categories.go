package shop

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"gorm.io/gorm"
)

func selectAllCategories(c *echo.Context, db *gorm.DB) error {
	var cats []Category
	db.Find(&cats)
	return c.JSON(http.StatusOK, cats)
}

func selectByIdCategory(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	cat, err := loadByID[Category](db, id)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	return c.JSON(http.StatusOK, cat)
}

func insertCategory(c *echo.Context, db *gorm.DB) error {
	cat := new(Category)
	if err := c.Bind(cat); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}
	if r := db.Create(cat); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, cat.ID)
}

func updateCategory(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	cat, err := loadByID[Category](db, id)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	if err := c.Bind(cat); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}
	if r := db.Save(cat); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, cat.ID)
}

func deleteCategory(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	cat, err := loadByID[Category](db, id)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	if r := db.Delete(cat); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, cat.ID)
}

func RegisterRoutesCategories(e *echo.Echo, db *gorm.DB) {
	e.GET("/categories/", func(c *echo.Context) error { return selectAllCategories(c, db) })
	e.GET("/categories/:id", func(c *echo.Context) error { return selectByIdCategory(c, db) })
	e.POST("/categories/", func(c *echo.Context) error { return insertCategory(c, db) })
	e.PUT("/categories/:id", func(c *echo.Context) error { return updateCategory(c, db) })
	e.DELETE("/categories/:id", func(c *echo.Context) error { return deleteCategory(c, db) })
}
