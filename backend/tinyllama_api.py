from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import pipeline

# ✅ Initialize FastAPI
app = FastAPI()

# ✅ Load TinyLlama model
pipe = pipeline(
    "text-generation",
    model="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

# ✅ Define request format
class ChatRequest(BaseModel):
    user_input: str

# ✅ Update API Route (New Name: `/tinyllama-generate`)
@app.post("/tinyllama-generate")
async def generate_chat(request: ChatRequest):
    messages = [
        {"role": "system", "content": "You are a helpful medical assistant."},
        {"role": "user", "content": request.user_input},
    ]
    
    prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    outputs = pipe(prompt, max_new_tokens=256, do_sample=True, temperature=0.7)

    return {"response": outputs[0]["generated_text"]}

# ✅ Run FastAPI with:
# uvicorn tinyllama_api:app --host 0.0.0.0 --port 8000
