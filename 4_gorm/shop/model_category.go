package shop

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name string `param:"name" query:"name" form:"name" json:"name"`
}
