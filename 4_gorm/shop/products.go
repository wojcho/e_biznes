package shop

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"gorm.io/gorm"
)

// CRUD

type productPayload struct {
	Name string `json:"name" form:"name"`
	Price uint  `json:"price" form:"price"`
	CategoryIDs []uint `json:"category_ids" form:"category_ids"`
}

// Select all products
func selectAllProducts(c *echo.Context, db *gorm.DB) error {
	var products []Product
	db.Preload("Categories").Find(&products)
	return c.JSON(http.StatusOK, products)
}

// Find product by id
func selectByIdProducts(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	p, err := loadByID[Product](db, id, "Categories")
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	return c.JSON(http.StatusOK, p)
}

// Update products
func updateByIdProducts(c *echo.Context, db *gorm.DB) error {
	id, _ := parseID(c)
	p, _ := loadByID[Product](db, id, "Categories")
	var payload productPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}
	p.Name = payload.Name
	p.Price = payload.Price
	if r := db.Save(p); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	if payload.CategoryIDs != nil {
		var cats []Category
		db.Find(&cats, payload.CategoryIDs)
		if err := db.Model(p).Association("Categories").Replace(&cats); err != nil {
			return c.JSON(http.StatusInternalServerError, "Association error")
		}
	}
	return c.JSON(http.StatusOK, p.ID)
}

// Delete a product
func deleteByIdProducts(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	p, err := loadByID[Product](db, id, "Categories")
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}

	if r := db.Delete(p); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, p.ID)
}

// Insert a product
func insertProducts(c *echo.Context, db *gorm.DB) error {
	var payload productPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}
	p := Product{Name: payload.Name, Price: payload.Price}
	if r := db.Create(&p); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	if len(payload.CategoryIDs) > 0 {
		var cats []Category
		db.Find(&cats, payload.CategoryIDs) // loads matching IDs
		if err := db.Model(&p).Association("Categories").Replace(&cats); err != nil {
			return c.JSON(http.StatusInternalServerError, "Association error")
		}
	}
	return c.JSON(http.StatusOK, p.ID)
}

// Registering

func RegisterRoutesProducts(e *echo.Echo, db *gorm.DB) {
	e.GET("/products/", func(c *echo.Context) error { return selectAllProducts(c, db) })
	e.GET("/products/:id", func(c *echo.Context) error { return selectByIdProducts(c, db) })
	e.PUT("/products/:id", func(c *echo.Context) error { return updateByIdProducts(c, db) })
	e.DELETE("/products/:id", func(c *echo.Context) error { return deleteByIdProducts(c, db) })
	e.POST("/products/", func(c *echo.Context) error { return insertProducts(c, db) })
}
