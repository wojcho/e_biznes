from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from ollama import Client

from sentence_transformers import SentenceTransformer
import numpy as np


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


model = SentenceTransformer("all-MiniLM-L6-v2")

shop_examples = [
    "OK. Bye.",
    "That is all from me.",
    "Thanks for your response. Until next time!",
    "Very good, it was just what I sought.",
    "Could you describe what products are available?",
    "Could you describe the product categories and give example products?",
    "What are the cheapest products you have?",
    "What products do you recommend?",
]

shop_vecs = model.encode(shop_examples)

def classify(text):
    v = model.encode([text])[0]

    sims = np.dot(shop_vecs, v) / (
        np.linalg.norm(shop_vecs, axis=1) * np.linalg.norm(v)
    )

    score = float(np.max(sims))

    if score < 0.5:
        return "unknown", score
    return "shop", score


@app.post("/api/respond")
async def read_root(request: Request) -> JSONResponse:
    messages = await request.json()

    label, score = classify(messages[-1]["content"])\
    
    if label != "shop":
        return {
            "role": "assistant",
            "content": "I respond only to: questions about shop, and general conversational boilerplate (hello, goodbye, etc). This message was not related to these topics. Thank you for your understanding."
        }

    response: ChatResponse = client.chat("llama3.1", messages=messages)
    
    return {
        "role": response.message.role,
        "content": response.message.content
    }
