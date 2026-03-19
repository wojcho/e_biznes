#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== Creating products ==="
curl -s -X POST "$BASE_URL/products/" \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "Kasza", "description": "Kasza gryczana 1kg", "pricePln": 4.99}'

curl -s -X POST "$BASE_URL/products/" \
  -H "Content-Type: application/json" \
  -d '{"id": 2, "name": "Ryż", "description": "Ryż biały 1kg", "pricePln": 5.49}'

curl -s -X POST "$BASE_URL/products/" \
  -H "Content-Type: application/json" \
  -d '{"id": 3, "name": "Pomarańcze", "description": "Pomarańcze 1kg", "pricePln": 6.78}'

echo -e "\n=== Creating categories ==="
curl -s -X POST "$BASE_URL/categories/" \
  -H "Content-Type: application/json" \
  -d '{"id": 10, "name": "Produkty skrobiowe", "description": "Produkty ze zbóż i pseudozbóż"}'

curl -s -X POST "$BASE_URL/categories/" \
  -H "Content-Type: application/json" \
  -d '{"id": 11, "name": "Owoce", "description": "Owoce"}'

curl -s -X POST "$BASE_URL/categories/" \
  -H "Content-Type: application/json" \
  -d '{"id": 12, "name": "Produkty roślinne", "description": "Produkty przygotowane z roślin uprawnych"}'

echo -e "\n=== Creating basket ==="
curl -s -X POST "$BASE_URL/baskets/" \
  -H "Content-Type: application/json" \
  -d '{"id": 100, "name": "Koszyk na zakupy"}'

echo -e "\n=== Linking products to categories ==="
curl -s -X POST "$BASE_URL/products/1/categories/10"
curl -s -X POST "$BASE_URL/products/1/categories/12"
curl -s -X POST "$BASE_URL/products/2/categories/10"
curl -s -X POST "$BASE_URL/products/2/categories/12"
curl -s -X POST "$BASE_URL/products/3/categories/11"
curl -s -X POST "$BASE_URL/products/3/categories/12"

echo -e "\n=== Initial state ==="
echo "\nProducts:"
curl -s "$BASE_URL/products/"

echo -e "\nCategories:"
curl -s "$BASE_URL/categories/"

echo -e "\nBaskets:"
curl -s "$BASE_URL/baskets/"

echo -e "\n=== Add products to basket ==="
curl -s -X POST "$BASE_URL/baskets/100/products/1"
curl -s -X POST "$BASE_URL/baskets/100/products/3"

echo -e "\nBasket contents:"
curl -s "$BASE_URL/baskets/100/products"

echo -e "\n=== Checkout basket ==="
curl -s -X POST "$BASE_URL/baskets/100/checkout"

echo -e "\n=== State after checkout ==="
echo "Products:"
curl -s "$BASE_URL/products/"

echo -e "\nCategories:"
curl -s "$BASE_URL/categories/"

echo -e "\nBaskets:"
curl -s "$BASE_URL/baskets/"
echo ""
