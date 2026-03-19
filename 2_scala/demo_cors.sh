curl -i -X OPTIONS http://localhost:8080/products/ -H "Origin: https://frontend1.example.com" -H "Access-Control-Request-Method: GET"
curl -i -X OPTIONS http://localhost:8080/products/ -H "Origin: https://frontend2.example.com" -H "Access-Control-Request-Method: GET"
curl -i -X OPTIONS http://localhost:8080/products/ -H "Origin: https://frontend3.example.com" -H "Access-Control-Request-Method: GET"
