import os
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments
from dotenv import load_dotenv
import pandas as pd
from datasets import Dataset
from huggingface_hub import login

def test_chatbot():
    # Load environment variables from .env file
    load_dotenv(dotenv_path='c:\\Users\\zloui\\OneDrive\\Documents\\GitHub\\lazycare-template1\\Backend\\Token.env')

    # Login to Hugging Face
    token = os.getenv('HUGGINGFACE_TOKEN')
    if not token:
        raise ValueError("Please set HUGGINGFACE_TOKEN in your .env file")
    login(token=token)

    # Load pre-trained TinyLlama model and tokenizer
    model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    pipe = pipeline("text-generation", model=model_name, torch_dtype=torch.bfloat16, device_map="auto")

    messages = [
        {"role": "system", "content": "You are Lazy Care, a friendly chatbot who gives short and concise health advice. You are a caring and knowledgeable health assistant whose role is to provide clear, concise, and empathetic medical advice. When responding, use supportive and non-judgmental language and offer the top three most practical suggestions in a clear and concise manner."},
        {"role": "user", "content": "What are some tips for better sleep?"}
    ]
    prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    # Request the top 3 suggestions
    outputs = pipe(prompt, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95, num_return_sequences=3)
    
    for idx, output in enumerate(outputs, start=1):
        print(f"Suggestion {idx}:")
        print(output["generated_text"])

def fine_tune_chatbot():
    # Load dataset from CSV file
    file_path = "c:\\Users\\zloui\\OneDrive\\Documents\\GitHub\\lazycare-template1\\Backend\\dataset\\icliniq_medical_qa_cleaned.csv"
    df = pd.read_csv(file_path, encoding="utf-8")
    
    # Debugging: Print the first few rows of the DataFrame
    print("DataFrame head:")
    print(df.head())

    # Check if DataFrame is empty
    if df.empty:
        raise ValueError("The DataFrame is empty. Please check the dataset.")

    df = df.head(100) # Limit the number of examples for faster training

    # Format for chatbot using 'Question' and 'Answer' columns
    df["formatted_text"] = df.apply(lambda row: f"<|user|>\n{row['Question']}\n<|assistant|>\n{row['Answer']}", axis=1)

    # Convert to Hugging Face dataset
    dataset = Dataset.from_dict({"text": df["formatted_text"].tolist()})
    print("Example from Hugging Face dataset:")
    print(dataset[0])

    # Load tokenizer
    model_id = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    tokenizer.pad_token = tokenizer.eos_token  # Fix padding issue

    # Tokenization function
    def tokenize(example):
        return tokenizer(example["text"], padding="max_length", truncation=True, max_length=512)

    tokenized_dataset = dataset.map(tokenize, batched=True)
    print("✅ Tokenization complete!")
    
    # Debug: Print tokenized input shape for the first example
    first_input_ids = tokenized_dataset[0]['input_ids']
    print("Tokenized input shape (length of input_ids):", len(first_input_ids))
    
    # Add labels to the tokenized dataset
    def add_labels(example):
        example["labels"] = example["input_ids"].copy()
        return example
    tokenized_dataset = tokenized_dataset.map(add_labels, batched=True)

    # Load the pre-trained model
    model = AutoModelForCausalLM.from_pretrained(model_id)

    # Training arguments
    training_args = TrainingArguments(
        output_dir="./results",
        eval_strategy="epoch",
        logging_strategy="steps",
        logging_steps=10,
        learning_rate=1e-5,
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        num_train_epochs=3,
        weight_decay=0.01,
        gradient_accumulation_steps=4,
        fp16=True,
        save_total_limit=2,
        report_to="tensorboard",
    )

    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        eval_dataset=tokenized_dataset,
    )

    # Fine-tune the model
    trainer.train()
    print("✅ Fine-tuning complete!")

    # Save the fine-tuned model to disk
    save_path = "./saved_model"
    trainer.save_model(save_path)
    tokenizer.save_pretrained(save_path)
    print(f"Trained model and tokenizer saved to {save_path}")

if __name__ == "__main__":
    print("Starting script...")
    print("CUDA available:", torch.cuda.is_available())
    print("Number of GPUs:", torch.cuda.device_count())
    if torch.cuda.is_available():
        print("Running on GPU.")
    else:
        print("Running on CPU.")
    
    test_chatbot()
    fine_tune_chatbot()
    print("Script finished.")