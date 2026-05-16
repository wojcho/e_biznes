package shop

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v5"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupAPI(t *testing.T) (*echo.Echo, *gorm.DB, *httptest.Server) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	assert.NoError(t, db.AutoMigrate(&Category{}, &Product{}, &Basket{}))

	e := echo.New()

	RegisterRoutesCategories(e, db)
	RegisterRoutesProducts(e, db)
	RegisterRoutesBaskets(e, db)

	server := httptest.NewServer(e)

	return e, db, server
}

func doReq(t *testing.T, client *http.Client, method, url string, body any) *http.Response {
	var buf *bytes.Buffer

	if body != nil {
		b, err := json.Marshal(body)
		assert.NoError(t, err)
		buf = bytes.NewBuffer(b)
	} else {
		buf = bytes.NewBuffer([]byte{})
	}

	req, err := http.NewRequest(method, url, buf)
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	assert.NoError(t, err)

	return resp
}

func decodeJSON(t *testing.T, resp *http.Response, out any) {
	defer resp.Body.Close()
	err := json.NewDecoder(resp.Body).Decode(out)
	assert.NoError(t, err)
}

func decodeBody[T any](t *testing.T, resp *http.Response) T {
	var out T
	decodeJSON(t, resp, &out)
	return out
}

func TestAPICategories(t *testing.T) {
	_, _, server := setupAPI(t)
	defer server.Close()

	client := server.Client()

	// CREATE
	createResp := doReq(t, client, http.MethodPost, server.URL+"/categories/", map[string]any{
		"name": "Teas",
	})
	assert.Equal(t, http.StatusOK, createResp.StatusCode)

	id := decodeBody[uint](t, createResp)
	assert.NotZero(t, id)

	// GET and verify that UPDATE worked
	getResp := doReq(t, client, http.MethodGet, server.URL+"/categories/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusOK, getResp.StatusCode)

	got := decodeBody[Category](t, getResp)
	assert.Equal(t, "Teas", got.Name)

	// LIST
	resp := doReq(t, client, http.MethodGet, server.URL+"/categories/", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// UPDATE
	updateResp := doReq(t, client, http.MethodPut, server.URL+"/categories/"+fmt.Sprint(id), map[string]any{
		"name": "Coffees",
	})
	assert.Equal(t, http.StatusOK, updateResp.StatusCode)

	updatedId := decodeBody[uint](t, updateResp)
	assert.Equal(t, updatedId, id)

	// GET and verify UPDATE
	getResp = doReq(t, client, http.MethodGet, server.URL+"/categories/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusOK, getResp.StatusCode)
	got = decodeBody[Category](t, getResp)
	assert.Equal(t, "Coffees", got.Name)

	// DELETE
	delResp := doReq(t, client, http.MethodDelete, server.URL+"/categories/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusOK, delResp.StatusCode)

	// verify DELETE
	getResp = doReq(t, client, http.MethodGet, server.URL+"/categories/"+fmt.Sprint(id), nil)
	assert.Equal(t, getResp.StatusCode, http.StatusNotFound)
}

func TestAPICategoriesNegative(t *testing.T) {
	_, _, server := setupAPI(t)
	defer server.Close()

	client := server.Client()

	// GET nonexistent category
	resp := doReq(t, client, http.MethodGet, server.URL+"/categories/999999", nil)
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// UPDATE nonexistent category
	resp = doReq(t, client, http.MethodPut, server.URL+"/categories/999999", map[string]any{
		"name": "Wrong, bad, negative!",
	})
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// DELETE nonexistent category
	resp = doReq(t, client, http.MethodDelete, server.URL+"/categories/999999", nil)
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// CREATE with wrong payload, number instead of object/struct
	resp = doReq(t, client, http.MethodPost, server.URL+"/categories/", 123456789)
	assert.NotEqual(t, http.StatusOK, resp.StatusCode)
}

func TestAPIProducts(t *testing.T) {
	_, db, server := setupAPI(t)
	defer server.Close()

	client := server.Client()

	// seed category
	cat := Category{Name: "Electronics"}
	assert.NoError(t, db.Create(&cat).Error)

	// CREATE
	createResp := doReq(t, client, http.MethodPost, server.URL+"/products/", map[string]any{
		"name":         "Crude Oil Barrel",
		"price":        105,
		"category_ids": []uint{cat.ID},
	})
	assert.Equal(t, http.StatusOK, createResp.StatusCode)

	id := decodeBody[uint](t, createResp)
	assert.NotZero(t, id)

	// GET and verify
	getResp := doReq(t, client, http.MethodGet, server.URL+"/products/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusOK, getResp.StatusCode)
	got := decodeBody[Product](t, getResp)

	assert.Equal(t, "Crude Oil Barrel", got.Name)
	assert.Equal(t, uint(105), got.Price)
	assert.NotEmpty(t, got.Categories)

	// LIST
	resp := doReq(t, client, http.MethodGet, server.URL+"/products/", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// UPDATE
	updateResp := doReq(t, client, http.MethodPut, server.URL+"/products/"+fmt.Sprint(id), map[string]any{
		"name":         "Gasoline Barrel",
		"price":        718,
		"category_ids": []uint{cat.ID},
	})
	assert.Equal(t, http.StatusOK, updateResp.StatusCode)

	updatedId := decodeBody[uint](t, updateResp)

	// GET and verify it was updated
	getResp = doReq(t, client, http.MethodGet, server.URL+"/products/"+fmt.Sprint(updatedId), nil)
	got = decodeBody[Product](t, getResp)
	assert.Equal(t, "Gasoline Barrel", got.Name)
	assert.Equal(t, uint(718), got.Price)

	// DELETE
	delResp := doReq(t, client, http.MethodDelete, server.URL+"/products/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusOK, delResp.StatusCode)

	getResp = doReq(t, client, http.MethodGet, server.URL+"/products/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusNotFound, getResp.StatusCode)
}

func TestAPIProductsNegative(t *testing.T) {
	_, _, server := setupAPI(t)
	defer server.Close()

	client := server.Client()

	// GET nonexistent product
	resp := doReq(t, client, http.MethodGet, server.URL+"/products/999999", nil)
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// CREATE product with bad types
	resp = doReq(t, client, http.MethodPost, server.URL+"/products/", map[string]any{
		"name":         -1,
		"price":        -1,
		"category_ids": -1,
	})
	assert.NotEqual(t, http.StatusOK, resp.StatusCode)

	// UPDATE nonexistent product
	resp = doReq(t, client, http.MethodPut, server.URL+"/products/999999", map[string]any{
		"name":         "Still Not Here",
		"price":        123,
		"category_ids": []uint{},
	})
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// DELETE nonexistent product
	resp = doReq(t, client, http.MethodDelete, server.URL+"/products/999999", nil)
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)
}

func TestAPIBaskets(t *testing.T) {
	_, db, server := setupAPI(t)
	defer server.Close()

	client := server.Client()

	// seed products
	p1 := Product{Name: "Water", Price: 5}
	p2 := Product{Name: "Oxygen", Price: 3}
	assert.NoError(t, db.Create(&p1).Error)
	assert.NoError(t, db.Create(&p2).Error)

	// CREATE
	createResp := doReq(t, client, http.MethodPost, server.URL+"/baskets/", map[string]any{
		"itemIds": []uint{p1.ID, p2.ID},
	})

	assert.Equal(t, http.StatusOK, createResp.StatusCode)

	id := decodeBody[uint](t, createResp)

	// GET
	getResp := doReq(t, client, http.MethodGet, server.URL+"/baskets/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusOK, getResp.StatusCode)

	got := decodeBody[Basket](t, getResp)

	assert.Len(t, got.Contained, 2)

	// LIST
	resp := doReq(t, client, http.MethodGet, server.URL+"/baskets/", nil)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// UPDATE remove 1 item
	updateResp := doReq(t, client, http.MethodPut, server.URL+"/baskets/"+fmt.Sprint(id), map[string]any{
		"itemIds": []uint{p1.ID},
	})
	assert.Equal(t, http.StatusOK, updateResp.StatusCode)

	updatedId := decodeBody[uint](t, updateResp)

	assert.Equal(t, updatedId, id)

	// verify using GET again
	getResp = doReq(t, client, http.MethodGet, server.URL+"/baskets/"+fmt.Sprint(id), nil)
	got = decodeBody[Basket](t, getResp)

	assert.Len(t, got.Contained, 1)
	assert.Equal(t, p1.ID, got.Contained[0].ID)

	// DELETE
	delResp := doReq(t, client, http.MethodDelete, server.URL+"/baskets/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusOK, delResp.StatusCode)

	getResp = doReq(t, client, http.MethodGet, server.URL+"/baskets/"+fmt.Sprint(id), nil)
	assert.Equal(t, http.StatusNotFound, getResp.StatusCode)
}

func TestAPIBasketsNegative(t *testing.T) {
	_, _, server := setupAPI(t)
	defer server.Close()

	client := server.Client()

	// GET nonexistent basket
	resp := doReq(t, client, http.MethodGet, server.URL+"/baskets/999999", nil)
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// UPDATE nonexistent basket
	resp = doReq(t, client, http.MethodPut, server.URL+"/baskets/999999", map[string]any{
		"itemIds": []uint{1, 2},
	})
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// DELETE nonexistent basket
	resp = doReq(t, client, http.MethodDelete, server.URL+"/baskets/999999", nil)
	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// CREATE basket with wrong datatype
	resp = doReq(t, client, http.MethodPost, server.URL+"/baskets/", 123456789)
	assert.NotEqual(t, http.StatusOK, resp.StatusCode)
}
