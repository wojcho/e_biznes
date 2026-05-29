from fastapi import FastAPI, Request
from ollama import Client
import json

app = FastAPI()
client = Client(host="http://localhost:11434")

@app.post("/api/respond")
async def read_root(request: Request):
    messages = await request.json()
    response: ChatResponse = client.chat("llama3.1", messages=messages)
    return json.dumps({ "role": response.message.role, "content": response.message.content })
