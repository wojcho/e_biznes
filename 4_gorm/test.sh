echo "List all products"
curl -s http://localhost:20264/products/ | jq .
echo "Create product (JSON)"
curl -s -X POST http://localhost:20264/products/ \
  -H "Content-Type: application/json" \
  -d '{"name":"apple","price":100}' | jq .
echo "Create product (form)"
curl -s -X POST http://localhost:20264/products/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=banana&price=150' | jq .
echo "Find product by id (existing)"
curl -s http://localhost:20264/products/1 | jq .
echo "Find product by id (non-existent)"
curl -s http://localhost:20264/products/999 | jq .
echo "Update product (JSON)"
curl -s -X PUT http://localhost:20264/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"grape","price":120}' | jq .
echo "Update product (form)"
curl -s -X PUT http://localhost:20264/products/1 \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=pear&price=110' | jq .

echo "List all baskets"
curl -s http://localhost:20264/baskets/ | jq .
echo "Create empty basket"
curl -s -X POST http://localhost:20264/baskets/ \
  -H "Content-Type: application/json" | jq .
echo "Create basket with items (JSON)"
curl -s -X POST http://localhost:20264/baskets/ \
  -H "Content-Type: application/json" \
  -d '{"itemIds":[1,2]}' | jq .
echo "Create basket with items (form)"
curl -s -X POST http://localhost:20264/baskets/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'itemIds=1&itemIds=2' | jq .
echo "Find basket by id (existing)"
curl -s http://localhost:20264/baskets/1 | jq .
echo "Find basket by id basket (non-existent)"
curl -s http://localhost:20264/baskets/999 | jq .
echo "Update basket replace items (JSON)"
curl -s -X PUT http://localhost:20264/baskets/1 \
  -H "Content-Type: application/json" \
  -d '{"itemIds":[3,4]}' | jq .
echo "Update basket replace items (form)"
curl -s -X PUT http://localhost:20264/baskets/1 \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'itemIds=3&itemIds=4' | jq .
echo "Update basket clear items (JSON)"
curl -s -X PUT http://localhost:20264/baskets/1 \
  -H "Content-Type: application/json" \
  -d '{"itemIds":[]}' | jq .
echo "Delete basket"
curl -s -X DELETE http://localhost:20264/baskets/1 | jq .
echo "Verify deletion"
curl -s http://localhost:20264/baskets/1 | jq .
