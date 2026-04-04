package main

import (
	"example.com/shop/products"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("shop.db"), &gorm.Config{})
	if err != nil {
		panic("Could not connect to database")
	}
	db.AutoMigrate(&products.Product{})

	e := echo.New()
	e.Use(middleware.RequestLogger())

	products.RegisterRoutes(e, db)

	if err := e.Start(":20264"); err != nil {
		e.Logger.Error("Could not start server", "error", err)
	}
}
