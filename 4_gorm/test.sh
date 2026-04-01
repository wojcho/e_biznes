curl -s http://localhost:20264/products/ | jq .
curl -s -X POST http://localhost:20264/products/ \
  -H "Content-Type: application/json" \
  -d '{"name":"apple","price":100}' | jq .
curl -s -X POST http://localhost:20264/products/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=banana&price=150' | jq .
curl -s http://localhost:20264/products/0 | jq .
curl -s http://localhost:20264/products/999 | jq .
curl -s -X PUT http://localhost:20264/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"grape","price":120}' | jq .
curl -s -X PUT http://localhost:20264/products/0 \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=pear&price=110' | jq .
