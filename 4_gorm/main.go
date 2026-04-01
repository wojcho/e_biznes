package main

import (
	"example.com/shop/products"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	products.RegisterRoutes(e)

	if err := e.Start(":20264"); err != nil {
		e.Logger.Error("Could not start server", "error", err)
	}
}
