import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('/Users/bp/Documents/crypto_site/crypto-site/.env.local')
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)