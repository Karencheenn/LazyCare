import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Define model path (must match the save_path from training)
model_path = "./saved_model"

# Load the tokenizer and model from the saved folder
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path)

# Create a text-generation pipeline using the loaded model and tokenizer
text_gen = pipeline("text-generation", model=model, tokenizer=tokenizer, device=0 if torch.cuda.is_available() else -1)

# Prepare and test the first prompt: better sleep tips
prompt_sleep = "<|user|>\nWhat are some tips for better sleep?\n<|assistant|>\n"
outputs_sleep = text_gen(prompt_sleep, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
print("Response for sleep tips:")
print(outputs_sleep[0]["generated_text"])

# Prepare and test the second prompt: cure depression tips
prompt_depression = "<|user|>\nWhat are some tips to cure depression?\n<|assistant|>\n"
outputs_depression = text_gen(prompt_depression, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
print("Response for depression tips:")
print(outputs_depression[0]["generated_text"])# Prepare a test prompt

# Prepare and test the third prompt: Vegetables eating consequences
prompt_vegeatbles = "<|user|>\nCurrently I am not eating alot of vegeatbles, what will be the consequences of that?\n<|assistant|>\n"
outputs_vegeatbles = text_gen(prompt_vegeatbles, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
print("Response for vegeatbles:")
print(outputs_vegeatbles[0]["generated_text"])

# Prepare and test the fourth prompt: Fever and cold diagnosis
prompt_fever = "<|user|>\nI am having headache and my body is warming up, I have tested my body temperature which is at 39 degrees, what could be the diagnosis?\n<|assistant|>\n"
outputs_fever = text_gen(prompt_fever, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
print("Response for fever:")
print(outputs_fever[0]["generated_text"])