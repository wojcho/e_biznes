package shop

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v5"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	err = db.AutoMigrate(
		&Category{},
		&Product{},
		&Basket{},
	)
	assert.NoError(t, err)

	return db
}

func newContext(
	method string,
	path string,
	body any,
	paramName string,
	paramValue string,
) (*echo.Echo, *echo.Context, *httptest.ResponseRecorder) {

	e := echo.New()

	var reader *bytes.Reader

	if body != nil {
		b, _ := json.Marshal(body)
		reader = bytes.NewReader(b)
	} else {
		reader = bytes.NewReader([]byte{})
	}

	req := httptest.NewRequest(method, path, reader)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)

	if paramName != "" {
		c.SetPath(path)
		c.SetPathValues(echo.PathValues{
			{
				Name:  paramName,
				Value: paramValue,
			},
		})
	}

	return e, c, rec
}

func seedCategories(t *testing.T, db *gorm.DB) []Category {
	cats := []Category{
		{Name: "Food"},
		{Name: "Electronics"},
		{Name: "Books"},
	}

	for _, c := range cats {
		err := db.Create(&c).Error
		assert.NoError(t, err)
	}

	var loaded []Category
	err := db.Find(&loaded).Error
	assert.NoError(t, err)

	return loaded
}

func seedProducts(t *testing.T, db *gorm.DB, cats []Category) []Product {
	p1 := Product{
		Name:  "Apple",
		Price: 5,
	}
	p2 := Product{
		Name:  "Laptop",
		Price: 1000,
	}

	assert.NoError(t, db.Create(&p1).Error)
	assert.NoError(t, db.Create(&p2).Error)

	assert.NoError(t,
		db.Model(&p1).Association("Categories").Replace(&cats[0]),
	)

	assert.NoError(t,
		db.Model(&p2).Association("Categories").Replace(&cats[1]),
	)

	var products []Product
	assert.NoError(t,
		db.Preload("Categories").Find(&products).Error,
	)

	return products
}

func TestParseID(t *testing.T) {
	_, c, _ := newContext(http.MethodGet, "/x/1", nil, "id", "5")

	id, err := parseID(c)

	assert.NoError(t, err)
	assert.Equal(t, uint(5), id)

	_, c2, _ := newContext(http.MethodGet, "/x/a", nil, "id", "abc")

	id2, err2 := parseID(c2)

	assert.Error(t, err2)
	assert.Equal(t, uint(0), id2)

	_, c3, _ := newContext(http.MethodGet, "/x/0", nil, "id", "0")

	id3, err3 := parseID(c3)

	assert.Error(t, err3)
	assert.Equal(t, uint(0), id3)

	_, c4, _ := newContext(http.MethodGet, "/x/-1", nil, "id", "-1")

	id4, err4 := parseID(c4)

	assert.Error(t, err4)
	assert.Equal(t, uint(0), id4)
}

func TestCategoryCRUD(t *testing.T) {
	db := setupTestDB(t)

	// INSERT
	payload := map[string]any{
		"name": "Toys",
	}

	_, c, rec := newContext(
		http.MethodPost,
		"/categories/",
		payload,
		"",
		"",
	)

	err := insertCategory(c, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var count int64
	db.Model(&Category{}).Count(&count)

	assert.Equal(t, int64(1), count)

	var cat Category
	assert.NoError(t, db.First(&cat).Error)

	assert.Equal(t, "Toys", cat.Name)
	assert.True(t, cat.ID > 0)

	// SELECT ALL
	_, c2, rec2 := newContext(
		http.MethodGet,
		"/categories/",
		nil,
		"",
		"",
	)

	err = selectAllCategories(c2, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec2.Code)
	assert.Contains(t, rec2.Body.String(), "Toys")

	// SELECT BY ID
	_, c3, rec3 := newContext(
		http.MethodGet,
		"/categories/1",
		nil,
		"id",
		"1",
	)

	err = selectByIdCategory(c3, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec3.Code)
	assert.Contains(t, rec3.Body.String(), "Toys")

	// UPDATE
	updatePayload := map[string]any{
		"name": "Games",
	}

	_, c4, rec4 := newContext(
		http.MethodPut,
		"/categories/1",
		updatePayload,
		"id",
		"1",
	)

	err = updateCategory(c4, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec4.Code)

	var updated Category
	assert.NoError(t, db.First(&updated, 1).Error)

	assert.Equal(t, "Games", updated.Name)

	// DELETE
	_, c5, rec5 := newContext(
		http.MethodDelete,
		"/categories/1",
		nil,
		"id",
		"1",
	)

	err = deleteCategory(c5, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec5.Code)

	var deletedCount int64
	db.Model(&Category{}).Count(&deletedCount)

	assert.Equal(t, int64(0), deletedCount)
}

func TestProductCRUD(t *testing.T) {
	db := setupTestDB(t)

	cats := seedCategories(t, db)

	insertPayload := productPayload{
		Name:        "Phone",
		Price:       500,
		CategoryIDs: []uint{cats[1].ID},
	}

	_, c, rec := newContext(
		http.MethodPost,
		"/products/",
		insertPayload,
		"",
		"",
	)

	err := insertProducts(c, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var count int64
	db.Model(&Product{}).Count(&count)

	assert.Equal(t, int64(1), count)

	var p Product
	assert.NoError(t,
		db.Preload("Categories").First(&p).Error,
	)

	assert.Equal(t, "Phone", p.Name)
	assert.Equal(t, uint(500), p.Price)
	assert.Len(t, p.Categories, 1)
	assert.Equal(t, "Electronics", p.Categories[0].Name)

	// SELECT ALL
	_, c2, rec2 := newContext(
		http.MethodGet,
		"/products/",
		nil,
		"",
		"",
	)

	err = selectAllProducts(c2, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec2.Code)
	assert.Contains(t, rec2.Body.String(), "Phone")

	// SELECT BY ID
	_, c3, rec3 := newContext(
		http.MethodGet,
		"/products/1",
		nil,
		"id",
		"1",
	)

	err = selectByIdProducts(c3, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec3.Code)
	assert.Contains(t, rec3.Body.String(), "Phone")

	// UPDATE
	updatePayload := productPayload{
		Name:        "Smartphone",
		Price:       900,
		CategoryIDs: []uint{cats[0].ID, cats[2].ID},
	}

	_, c4, rec4 := newContext(
		http.MethodPut,
		"/products/1",
		updatePayload,
		"id",
		"1",
	)

	err = updateByIdProducts(c4, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec4.Code)

	var updated Product
	assert.NoError(t,
		db.Preload("Categories").First(&updated, 1).Error,
	)

	assert.Equal(t, "Smartphone", updated.Name)
	assert.Equal(t, uint(900), updated.Price)
	assert.Len(t, updated.Categories, 2)

	// DELETE
	_, c5, rec5 := newContext(
		http.MethodDelete,
		"/products/1",
		nil,
		"id",
		"1",
	)

	err = deleteByIdProducts(c5, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec5.Code)

	var deletedCount int64
	db.Model(&Product{}).Count(&deletedCount)

	assert.Equal(t, int64(0), deletedCount)
}

func TestBasketCRUD(t *testing.T) {
	db := setupTestDB(t)

	cats := seedCategories(t, db)
	products := seedProducts(t, db, cats)

	insertPayload := basketMutationPayload{
		ItemIDs: []uint{
			products[0].ID,
			products[1].ID,
		},
	}

	_, c, rec := newContext(
		http.MethodPost,
		"/baskets/",
		insertPayload,
		"",
		"",
	)

	err := insertBaskets(c, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var count int64
	db.Model(&Basket{}).Count(&count)

	assert.Equal(t, int64(1), count)

	var basket Basket
	assert.NoError(t,
		db.Preload("Contained.Categories").
			First(&basket).Error,
	)

	assert.Len(t, basket.Contained, 2)

	names := []string{basket.Contained[0].Name, basket.Contained[1].Name}
	assert.ElementsMatch(t, []string{"Apple", "Laptop"}, names)

	assert.NotNil(t, basket.Contained[0].ContainedByBasketID)
	assert.NotNil(t, basket.Contained[1].ContainedByBasketID)

	// SELECT ALL
	_, c2, rec2 := newContext(
		http.MethodGet,
		"/baskets/",
		nil,
		"",
		"",
	)

	err = selectAllBaskets(c2, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec2.Code)
	assert.Contains(t, rec2.Body.String(), "Apple")
	assert.Contains(t, rec2.Body.String(), "Laptop")

	// SELECT BY ID
	_, c3, rec3 := newContext(
		http.MethodGet,
		"/baskets/1",
		nil,
		"id",
		"1",
	)

	err = selectByIdBaskets(c3, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec3.Code)
	assert.Contains(t, rec3.Body.String(), "Apple")

	// UPDATE basket items
	updatePayload := basketMutationPayload{
		ItemIDs: []uint{
			products[0].ID,
		},
	}

	_, c4, rec4 := newContext(
		http.MethodPut,
		"/baskets/1",
		updatePayload,
		"id",
		"1",
	)

	err = updateByIdBaskets(c4, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec4.Code)

	var updated Basket
	assert.NoError(t,
		db.Preload("Contained").
			First(&updated, 1).Error,
	)

	assert.Len(t, updated.Contained, 1)
	assert.Equal(t, "Apple", updated.Contained[0].Name)

	// DELETE
	_, c5, rec5 := newContext(
		http.MethodDelete,
		"/baskets/1",
		nil,
		"id",
		"1",
	)

	err = deleteByIdBaskets(c5, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec5.Code)

	var basketCount int64
	db.Model(&Basket{}).Count(&basketCount)

	assert.Equal(t, int64(0), basketCount)
}

func TestLoadByID(t *testing.T) {
	db := setupTestDB(t)

	cat := Category{Name: "Music"}

	assert.NoError(t, db.Create(&cat).Error)

	loaded, err := loadByID[Category](db, cat.ID)

	assert.NoError(t, err)
	assert.NotNil(t, loaded)
	assert.Equal(t, cat.ID, loaded.ID)
	assert.Equal(t, "Music", loaded.Name)

	notFound, err := loadByID[Category](db, 999)

	assert.Error(t, err)
	assert.Nil(t, notFound)
}

func TestScopes(t *testing.T) {
	db := setupTestDB(t)

	cats := seedCategories(t, db)
	products := seedProducts(t, db, cats)

	basket := Basket{}

	assert.NoError(t, db.Create(&basket).Error)

	assert.NoError(t,
		db.Model(&basket).
			Association("Contained").
			Replace(&products),
	)

	var loadedBasket Basket

	assert.NoError(t,
		db.Scopes(
			ByID(basket.ID),
			WithContainedCategories(),
		).First(&loadedBasket).Error,
	)

	assert.Equal(t, basket.ID, loadedBasket.ID)
	assert.Len(t, loadedBasket.Contained, 2)

	assert.Len(
		t,
		loadedBasket.Contained[0].Categories,
		1,
	)

	assert.Len(
		t,
		loadedBasket.Contained[1].Categories,
		1,
	)
}

func TestWrongRequests(t *testing.T) {
	db := setupTestDB(t)

	// wrong category ID
	_, c1, rec1 := newContext(
		http.MethodGet,
		"/categories/x",
		nil,
		"id",
		"x",
	)

	err := selectByIdCategory(c1, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec1.Code)

	// missing category
	_, c2, rec2 := newContext(
		http.MethodGet,
		"/categories/999",
		nil,
		"id",
		"999",
	)

	err = selectByIdCategory(c2, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec2.Code)

	// missing product
	_, c3, rec3 := newContext(
		http.MethodGet,
		"/products/999",
		nil,
		"id",
		"999",
	)

	err = selectByIdProducts(c3, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec3.Code)

	// missing basket
	_, c4, rec4 := newContext(
		http.MethodGet,
		"/baskets/999",
		nil,
		"id",
		"999",
	)

	err = selectByIdBaskets(c4, db)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec4.Code)
}
