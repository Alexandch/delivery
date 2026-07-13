FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

COPY requirements.txt ./
RUN python -m pip install --upgrade pip && \
    python -m pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT ["python", "/app/docker/entrypoint.py"]
CMD ["gunicorn", "delivery_project.wsgi:application", "--config", "gunicorn.conf.py"]
