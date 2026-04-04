package shop

import (
	"gorm.io/gorm"
)

type Basket struct {
	gorm.Model
	Contained []Product `gorm:"foreignKey:ContainedByBasketID"` // https://gorm.io/docs/has_many.html#Override-References
}
