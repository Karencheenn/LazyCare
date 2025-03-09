from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import uvicorn
app = FastAPI()

# Define model path and load the tokenizer and model from the saved folder
model_path = "../token"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path)

# Create a text-generation pipeline using the loaded model and tokenizer
text_gen = pipeline("text-generation", model=model, tokenizer=tokenizer, device=0 if torch.cuda.is_available() else -1)

class GenerationRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_text(request: GenerationRequest):
    try:
        outputs = text_gen(request.prompt, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
        return {"generated_text": outputs[0]["generated_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)