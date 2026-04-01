package products

import (
	"net/http"
  "strconv"

	"github.com/labstack/echo/v5"
)

type Product struct {
  Name string `param:"name" query:"name" form:"name" json:"name"`
  Price int64 `param:"price" query:"price" form:"price" json:"price"`
}

var products []Product = make([]Product, 0, 16)

// Select all products
// e.GET("/products/", SelectAll)
func SelectAll(c *echo.Context) error {
	return c.JSON(http.StatusOK, products)
}

// Get product by id
// e.GET("/products/:id", SelectById)
func SelectById(c *echo.Context) error {
  id, err := strconv.Atoi(c.Param("id"))
  if err != nil {
    return c.JSON(http.StatusBadRequest, "Could not parse ID as integer")
  }
  if id >= len(products) {
    return c.JSON(http.StatusBadRequest, "ID out of range")
  }
  product := products[id]
	return c.JSON(http.StatusOK, product)
}

// Update products
// e.PUT("/products/:id", UpdateById)
func UpdateById(c *echo.Context) error {
  id, err := strconv.Atoi(c.Param("id"))
  if err != nil {
    return c.JSON(http.StatusBadRequest, "Could not parse ID as integer")
  }
  if id >= len(products) {
    return c.JSON(http.StatusBadRequest, "ID out of range")
  }
  product := new(Product)
	if err := c.Bind(product); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}
  products[id] = *product
  return c.JSON(http.StatusOK, id)
}

// Delete a product
// e.DELETE("/products/:id", DeleteById)
func DeleteById(c *echo.Context) error {
  id, err := strconv.Atoi(c.Param("id"))
  if err != nil {
    return c.JSON(http.StatusBadRequest, "Could not parse ID as integer")
  }
  if id >= len(products) {
    return c.JSON(http.StatusBadRequest, "ID out of range")
  }
  products[id] = products[len(products)-1]
  products = products[:len(products)-1]
  return c.JSON(http.StatusOK, id)
}

// Insert a product
// e.POST("/products/", Insert)
func Insert(c *echo.Context) error {
  product := new(Product)
	if err := c.Bind(product); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind did not work")
	}
  products = append(products, *product)
  newId := len(products) - 1
  return c.JSON(http.StatusOK, newId)
}
