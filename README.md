# NomadLink — Travel Agency Platform

NomadLink is a travel agency web application with a client front office and an admin back office. This part of the project covers **travel packs**, **discounts and price plans**, **Stripe payments and invoices**, **reward points with promo codes**, and an **AI travel assistant** built on a fine-tuned Llama 2 model.

### Technologies and tools

<p>
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="Hugging Face">
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch">
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes">
  <img src="https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible&logoColor=white" alt="Ansible">
  <img src="https://img.shields.io/badge/OpenStack-ED1944?style=for-the-badge&logo=openstack&logoColor=white" alt="OpenStack">
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx">
</p>

---

## Table of Contents

- [Features](#features)
- [Class diagram](#class-diagram)
- [Screenshots](#screenshots)
  - [Front office](#front-office)
  - [Stripe payment](#stripe-payment)
  - [Back office](#back-office)
  - [AI travel assistant](#ai-travel-assistant)
- [AI Model Fine-Tuning (Llama 2)](#ai-model-fine-tuning-llama-2)
- [Stripe Webhooks (local testing)](#stripe-webhooks-local-testing)

---

## Features

### Front office (client)
- Browse travel packs (Tunisia, Paris, Italy…) with a **sales countdown** and discount badges
- Book a pack and pay securely with **Stripe Checkout**
- View personal payment history
- Earn **reward points** and turn them into a **promo code** applied at checkout

### Back office (admin)
- Packs management: create, update and delete packs (type, image, flight, destinations and activities)
- **Discounts** with percentage and validity period
- **Price plans** linked to packs
- Payments list with **CSV export**
- Invoices list with links to the Stripe-hosted invoices
- Reward points management
- **Travel QA System**: AI assistant with knowledge base, knowledge upload, file operations and text generation

### Payments
- Stripe Checkout sessions with promotion codes
- Stripe webhooks (`/picloud/webhook`) to record payments and invoices automatically

---

## Class diagram

The diagram below summarizes the main NomadLink domain entities and their relationships.

<img src="docs/screenshots/class-diagram.png" alt="NomadLink class diagram" width="100%">

---

## Screenshots

### Front office

**Packs with sales countdown**

<img src="docs/screenshots/packs-sales.png" alt="Packs with sales countdown" width="100%">

**My payments**

<img src="docs/screenshots/user-payments.png" alt="User payments" width="100%">

**Reward points and promo code**

<img src="docs/screenshots/reward-points.png" alt="Reward points" width="100%">

### Stripe payment

**Stripe Checkout with promo code applied**

<img src="docs/screenshots/stripe-checkout.png" alt="Stripe Checkout" width="100%">

**Stripe CLI forwarding webhook events to the backend**

<img src="docs/screenshots/stripe-cli-webhooks.png" alt="Stripe CLI webhooks" width="100%">

### Back office

**Packs management**

<img src="docs/screenshots/admin-packs.png" alt="Admin packs" width="100%">

**Add / edit a pack**

<img src="docs/screenshots/admin-add-pack.png" alt="Add pack" width="100%">

**Discounts**

<img src="docs/screenshots/admin-discounts.png" alt="Discounts" width="100%">

**Price plans**

<img src="docs/screenshots/admin-price-plans.png" alt="Price plans" width="100%">

**Payments (with CSV export)**

<img src="docs/screenshots/admin-payments.png" alt="Admin payments" width="100%">

**Invoices**

<img src="docs/screenshots/admin-invoices.png" alt="Invoices" width="100%">

### AI travel assistant

**Travel QA System — chat with the fine-tuned model**

<img src="docs/screenshots/ai-travel-qa.png" alt="Travel QA System" width="100%">

---

## AI Model Fine-Tuning (Llama 2)

The travel assistant uses a **Llama 2 7B Chat** model fine-tuned with **LoRA** (Parameter-Efficient Fine-Tuning) using Hugging Face `transformers`, `peft` and `trl`.

- **Model on Hugging Face:** [`samia4566/llama2-7B-finetuned-chat-guanaco`](https://huggingface.co/samia4566/llama2-7B-finetuned-chat-guanaco)
- **Notebook:** `LLAMA_2.ipynb`

### Setup

| Item | Value |
|---|---|
| Base model | [`NousResearch/Llama-2-7b-chat-hf`](https://huggingface.co/NousResearch/Llama-2-7b-chat-hf) |
| Dataset | [`mlabonne/guanaco-llama2-1k`](https://huggingface.co/datasets/mlabonne/guanaco-llama2-1k) (1,000 instruction samples) |
| Method | Supervised Fine-Tuning (`SFTTrainer`) + LoRA adapters |
| Prompt format | `<s>[INST] {prompt} [/INST]` |

### LoRA configuration

| Parameter | Value |
|---|---|
| `r` | 64 |
| `lora_alpha` | 16 |
| `lora_dropout` | 0.1 |
| `bias` | none |
| `task_type` | CAUSAL_LM |

### Training hyperparameters

| Parameter | Value |
|---|---|
| Epochs | 3 |
| Batch size (per device) | 8 |
| Gradient accumulation steps | 1 |
| Optimizer | AdamW (`adamw_torch`) |
| Learning rate | 2e-5 (constant scheduler) |
| Warmup ratio | 0.03 |
| Weight decay | 0.01 |
| Max grad norm | 0.3 |
| Max sequence length | 512 |
| Mixed precision | fp16 |
| Gradient checkpointing | enabled |
| Group by length | enabled |
| Logging | TensorBoard, every 25 steps |
| Checkpoints | every 50 steps, pushed to the Hugging Face Hub |

### Results

Final values from TensorBoard:

| Metric | Value |
|---|---|
| Epochs completed | 3 |
| Training steps | 441 |
| Training loss | 2.52 → **2.01** |
| Mean token accuracy | 0.51 → **0.568** |
| Gradient norm | ~0.13 |
| Tokens processed | ~1.16 M |

The loss goes down steadily and the token accuracy goes up across the three epochs, with no sign of training instability.

<img src="docs/screenshots/tensorboard-training-1.png" alt="TensorBoard: epoch, grad norm, learning rate" width="100%">

<img src="docs/screenshots/tensorboard-training-2.png" alt="TensorBoard: loss, mean token accuracy, tokens" width="100%">

### Inference example

```python
from transformers import pipeline

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, max_length=192)
prompt = "Can you recommend the best sightseeing spots for a memorable trip?"
result = pipe(f"<s>[INST] {prompt} [/INST]")
print(result[0]["generated_text"])
```

---

## Stripe Webhooks (local testing)

Install the [Stripe CLI](https://docs.stripe.com/stripe-cli), then forward events to the backend:

```bash
stripe login
stripe listen --forward-to localhost:9000/picloud/webhook
```

Copy the `whsec_...` signing secret printed by the CLI into the backend configuration. Use Stripe test cards (for example `4242 4242 4242 4242`) to simulate payments.

> ⚠️ Never commit Stripe secret keys or webhook signing secrets to GitHub.
