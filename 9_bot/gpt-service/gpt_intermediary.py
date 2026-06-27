from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ollama import Client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Client(host="http://localhost:11434")

@app.post("/api/respond")
async def read_root(request: Request) -> JSONResponse:
    print("a")
    messages = await request.json()
    response: ChatResponse = client.chat("llama3.1", messages=messages)
    
    return {
        "role": response.message.role,
        "content": response.message.content
    }
