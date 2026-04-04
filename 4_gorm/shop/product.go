package shop

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name                string `param:"name" query:"name" form:"name" json:"name"`
	Price               uint   `param:"price" query:"price" form:"price" json:"price"`
	ContainedByBasketID *uint  `gorm:"default:null"` // To not have misguiding identifier 0 indicating not being assigned to any basket
	Categories          []Category `gorm:"many2many:user_languages;"`
}
