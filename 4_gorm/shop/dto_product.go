package shop

type productPayload struct {
	Name        string `json:"name" form:"name"`
	Price       uint   `json:"price" form:"price"`
	CategoryIDs []uint `json:"category_ids" form:"category_ids"`
}
