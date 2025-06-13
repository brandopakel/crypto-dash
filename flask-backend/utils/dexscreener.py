import requests

BASE_URL = "https://api.dexscreener.com/latest"

def call_dexscreener_api(path: str, method="GET", params=None, data=None, headers=None):
    url = f"{BASE_URL}/{path.lstrip('/')}"
    headers = headers or {}

    response = requests.request(method, url, params=params, json=data, headers=headers)
    response.raise_for_status()
    return response.json()