#!/usr/bin/env bash

rm ./crud_shop ./shop.db

go build
./crud_shop &
sleep 1 # Warning, it is racing

API="http://localhost:20264"

echo "==== Create product (JSON)"
p1=$(curl -s -X POST $API/products/ \
  -H "Content-Type: application/json" \
  -d '{"name":"apple","price":100}')
echo "${p1}" | jq .
echo "==== Create product (form)"
curl -s -X POST $API/products/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=banana&price=150' | jq .
echo "==== Find product by id (existing)"
curl -s $API/products/$p1 | jq .
echo "==== Find product by id (non-existent)"
curl -s $API/products/999 | jq .
echo "==== Update product (JSON)"
curl -s -X PUT $API/products/$p1 \
  -H "Content-Type: application/json" \
  -d '{"name":"grape","price":120}' | jq .
echo "==== Update product (form)"
curl -s -X PUT $API/products/$p1 \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=pear&price=110' | jq .
echo "==== Delete product"
curl -s -X DELETE $API/products/$p1 | jq .
echo "==== Verify deletion"
curl -s $API/products/$p1 | jq .
echo "==== List all products"
curl -s $API/products/ | jq .

echo "==== Create empty basket"
b1=$(curl -s -X POST $API/baskets/ \
  -H "Content-Type: application/json")
echo "${b1}" | jq .
echo "==== Create basket with items (JSON)"
curl -s -X POST $API/baskets/ \
  -H "Content-Type: application/json" \
  -d '{"itemIds":[1,2]}' | jq .
echo "==== Create basket with items (form)"
curl -s -X POST $API/baskets/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'itemIds=1&itemIds=2' | jq .
echo "==== Find basket by id (existing)"
curl -s $API/baskets/$b1 | jq .
echo "==== Find basket by id basket (non-existent)"
curl -s $API/baskets/999 | jq .
echo "==== Update basket replace items (JSON)"
curl -s -X PUT $API/baskets/$b1 \
  -H "Content-Type: application/json" \
  -d '{"itemIds":[3,4]}' | jq .
echo "==== Update basket replace items (form)"
curl -s -X PUT $API/baskets/$b1 \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'itemIds=3&itemIds=4' | jq .
echo "==== Update basket clear items (JSON)"
curl -s -X PUT $API/baskets/$b1 \
  -H "Content-Type: application/json" \
  -d '{"itemIds":[]}' | jq .
echo "==== Delete basket"
curl -s -X DELETE $API/baskets/$b1 | jq .
echo "==== Verify deletion"
curl -s $API/baskets/$b1 | jq .
echo "==== List all baskets"
curl -s $API/baskets/ | jq .

echo "==== Create category (JSON)"
c1=$(curl -s -X POST $API/categories/ \
  -H "Content-Type: application/json" \
  -d '{"name":"fruits"}')
echo "${c1}" | jq .
echo "==== Create category (form)"
curl -s -X POST $API/categories/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=vegetables' | jq .
echo "==== Find category by id (existing)"
curl -s $API/categories/$c1 | jq .
echo "==== Find category by id (non-existent)"
curl -s $API/categories/999 | jq .
echo "==== Update category (JSON)"
curl -s -X PUT $API/categories/$c1 \
  -H "Content-Type: application/json" \
  -d '{"name":"fresh-fruits"}' | jq .
echo "==== Update category (form)"
curl -s -X PUT $API/categories/$c1 \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=dried-fruits' | jq .
echo "==== Delete category"
curl -s -X DELETE $API/categories/$c1 | jq .
echo "==== Verify deletion"
curl -s $API/categories/$c1 | jq .
echo "==== List all categories"
curl -s $API/categories/ | jq .

echo "==== Create category (JSON)"
c2=$(curl -s -X POST $API/categories/ \
  -H "Content-Type: application/json" \
  -d '{"name":"fruits"}')
echo "${c2}" | jq .
echo "==== Create product (JSON)"
p2=$(curl -s -X POST $API/products/ \
  -H "Content-Type: application/json" \
  -d '{"name":"apple","price":100}')
echo "${p2}" | jq .
echo "==== Add category to product (JSON)"
curl -s -X PUT $API/products/$p2 \
  -H "Content-Type: application/json" \
  -d "{\"category_ids\":[${c2}]}" | jq .
echo "==== Verify product now has category"
curl -s $API/products/$p2 | jq .
echo "==== Add category to product (form)"
curl -s -X PUT $API/products/$p2 \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "category_ids=${c2}" | jq .

kill $(jobs -p)
