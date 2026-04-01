package main

import (
	"example.com/shop/products"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	e.GET("/products/", products.SelectAll)
	e.GET("/products/:id", products.SelectById)
	e.PUT("/products/:id", products.UpdateById)
	e.DELETE("/products/:id", products.DeleteById)
	e.POST("/products/", products.Insert)

	if err := e.Start(":20264"); err != nil {
		e.Logger.Error("Could not start server", "error", err)
	}
}
