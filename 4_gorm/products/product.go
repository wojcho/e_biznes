package products

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name  string `param:"name" query:"name" form:"name" json:"name"`
	Price int64  `param:"price" query:"price" form:"price" json:"price"`
}
