package products

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v5"
	"gorm.io/gorm"
)

// Helpers

func parseID(c *echo.Context) (int, error) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return 0, echo.NewHTTPError(http.StatusBadRequest, "Could not parse ID as integer")
	}
	return id, nil
}

func loadProductByID(db *gorm.DB, id int) (*Product, error) {
	var product Product
	if r := db.First(&product, "id = ?", id); r.Error != nil {
		if errors.Is(r.Error, gorm.ErrRecordNotFound) {
			return nil, echo.NewHTTPError(http.StatusNotFound, "Product with provided ID not found")
		}
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "Database error")
	}
	return &product, nil
}

// CRUD

// Select all products
func SelectAll(c *echo.Context, db *gorm.DB) error {
	var products []Product
	db.Find(&products)
	return c.JSON(http.StatusOK, products)
}

// Find product by id
func SelectById(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	p, err := loadProductByID(db, id)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	return c.JSON(http.StatusOK, p)
}

// Update products
func UpdateById(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	p, err := loadProductByID(db, id)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}

	if err := c.Bind(p); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}
	if r := db.Save(p); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, p.ID)
}

// Delete a product
func DeleteById(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	p, err := loadProductByID(db, id)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}

	if r := db.Delete(p); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, p.ID)
}

// Insert a product
func Insert(c *echo.Context, db *gorm.DB) error {
	p := new(Product)
	if err := c.Bind(p); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}
	if r := db.Create(p); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, p.ID)
}

// Registering

func RegisterRoutes(e *echo.Echo, db *gorm.DB) {
	e.GET("/products/", func(c *echo.Context) error { return SelectAll(c, db) })
	e.GET("/products/:id", func(c *echo.Context) error { return SelectById(c, db) })
	e.PUT("/products/:id", func(c *echo.Context) error { return UpdateById(c, db) })
	e.DELETE("/products/:id", func(c *echo.Context) error { return DeleteById(c, db) })
	e.POST("/products/", func(c *echo.Context) error { return Insert(c, db) })
}
