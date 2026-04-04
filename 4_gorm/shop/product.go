package shop

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name  string `param:"name" query:"name" form:"name" json:"name"`
	Price uint  `param:"price" query:"price" form:"price" json:"price"`
	ContainedByBasketID uint
}
