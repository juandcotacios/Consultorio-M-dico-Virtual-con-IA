from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import aiohttp
import json

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "medllama2"

@app.post("/consultar")
async def consultar(request: Request):
    data = await request.json()
    user_input = data.get("message")

    payload = {
        "model": MODEL_NAME,
        "prompt": user_input
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(OLLAMA_API_URL, json=payload) as response:
            response_text = await response.text()
            response_lines = response_text.strip().split("\n")
            response_data = [json.loads(line) for line in response_lines]

    return JSONResponse(content=response_data)

# Para ejecutar el servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
