curl -X POST "http://localhost:8000/api/respond" \
  -H "Content-Type: application/json" \
  -d '[
    {"role":"system","content":"You are a shop assistant who has to respond to users helpfully. When they ask about prices of items, you respond to them. One package of cinnamon costs 2 dollars."},
    {"role":"user","content":"Hello, how much does a package of cinnamon cost?"}
]'
