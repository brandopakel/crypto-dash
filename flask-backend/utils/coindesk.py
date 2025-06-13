import requests
import os
from dotenv import load_dotenv

load_dotenv("/Users/bp/Documents/crypto_site/crypto-site/flask-backend/venv/keys.env")
BASE_URL = "https://api.coindesk.com/v1"
API_KEY = os.getenv("CD_KEY")

def call_coindesk_api(path: str, method='GET', params=None, data=None, headers=None):
    url = f"{BASE_URL}/{path.lstrip('/')}"
    headers = headers or {}

    if API_KEY:
        headers["Authorization"] = f"Bearer {API_KEY}"

    response = requests.request(method, url, params=params, json=data, headers=headers)
    response.raise_for_status()
    return response.json()