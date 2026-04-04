package shop

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"gorm.io/gorm"
)

// CRUD

type basketMutationPayload struct {
	ItemIDs []uint `json:"itemIds"`
}

// Select all baskets
func selectAllBaskets(c *echo.Context, db *gorm.DB) error {
	var baskets []Basket
	db.Scopes(WithContainedCategories()).Find(&baskets)
	return c.JSON(http.StatusOK, baskets)
}

// Find basket by id
func selectByIdBaskets(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	b, err := loadByID[Basket](db, id, WithContainedCategories())
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	return c.JSON(http.StatusOK, b)
}

func updateByIdBaskets(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	b, err := loadByID[Basket](db, id, WithContainedCategories())
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}

	var payload basketMutationPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}

	// If item IDs provided, load those products and replace association
	if payload.ItemIDs != nil {
		var items []Product
		if len(payload.ItemIDs) > 0 {
			if r := db.Find(&items, payload.ItemIDs); r.Error != nil {
				return c.JSON(http.StatusInternalServerError, "Database error")
			}
		}
		// Replace association
		if r := db.Model(b).Association("Contained").Replace(&items); r != nil {
			return c.JSON(http.StatusInternalServerError, "Database error")
		}
	}

	if r := db.Save(b); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, b.ID)
}

// Delete a basket
func deleteByIdBaskets(c *echo.Context, db *gorm.DB) error {
	id, err := parseID(c)
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}
	b, err := loadByID[Basket](db, id, WithContainedCategories())
	if err != nil {
		return c.JSON(err.(*echo.HTTPError).Code, err.Error())
	}

	// Clear associations first
	if r := db.Model(b).Association("Contained").Clear(); r != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	if r := db.Delete(b); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, b.ID)
}

// Insert a basket

func insertBaskets(c *echo.Context, db *gorm.DB) error {
	var payload basketMutationPayload
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}

	b := &Basket{}
	if r := db.Create(b); r.Error != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}

	if payload.ItemIDs != nil && len(payload.ItemIDs) > 0 {
		var items []Product
		if r := db.Find(&items, payload.ItemIDs); r.Error != nil {
			return c.JSON(http.StatusInternalServerError, "Database error")
		}
		// Alternatively Append could be used, but just in case there was some old data, which there should not be, Replace is used
		if r := db.Model(b).Association("Contained").Replace(&items); r != nil { // https://gorm.io/docs/associations.html#Association-Mode
			return c.JSON(http.StatusInternalServerError, "Database error")
		}
	}

	bLoaded, err := loadByID[Basket](db, b.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Database error")
	}
	return c.JSON(http.StatusOK, bLoaded.ID)
}

// Registering

func RegisterRoutesBaskets(e *echo.Echo, db *gorm.DB) {
	e.GET("/baskets/", func(c *echo.Context) error { return selectAllBaskets(c, db) })
	e.GET("/baskets/:id", func(c *echo.Context) error { return selectByIdBaskets(c, db) })
	e.PUT("/baskets/:id", func(c *echo.Context) error { return updateByIdBaskets(c, db) })
	e.DELETE("/baskets/:id", func(c *echo.Context) error { return deleteByIdBaskets(c, db) })
	e.POST("/baskets/", func(c *echo.Context) error { return insertBaskets(c, db) })
}
