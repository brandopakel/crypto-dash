import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('/Users/bp/Documents/crypto_site/crypto-site/flask-backend/venv/keys.env')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SECRET_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)