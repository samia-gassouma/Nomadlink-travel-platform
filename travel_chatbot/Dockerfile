FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/home/app/.cache/huggingface

WORKDIR /app

RUN useradd --create-home --shell /usr/sbin/nologin app

COPY requirements.txt ./
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch==2.6.0 \
    && pip install --no-cache-dir -r requirements.txt

COPY app.py TravelQASystem.py ./

RUN mkdir -p /home/app/.cache/huggingface \
    && chown -R app:app /app /home/app/.cache

USER app

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--timeout", "300", "app:app"]
