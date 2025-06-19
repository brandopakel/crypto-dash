import requests
import os
from dotenv import load_dotenv


BASE_URL = 'https://api.coingecko.com/api/v3'
CG_API_KEY = os.getenv("CG_KEY")

def call_coingecko_api(path: str, method='GET', params=None, headers=None, data=None):
    url = f"{BASE_URL}/{path.lstrip('/')}"
    headers = headers or {}

    if "pro-api.coingecko.com" in BASE_URL and CG_API_KEY:
        headers['x-cg-pro-api-key'] = CG_API_KEY

    response = requests.request(method, url, params=params, json=data, headers=headers)
    response.raise_for_status()

    return response.json()