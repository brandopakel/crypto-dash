from flask import Flask
from flask_cors import CORS
from api.resolve_product_id_cb import bp_resolve_product_id_cb
from api.cb_load import bp_cb_coin_load
from api.coingecko_route import coingecko_bp
from api.coindesk_route import coindesk_bp
from api.dexscreener_route import dexscreener_bp
from api.supabase_route import supabase_bp
from api.search import search_bp
from database.sync_coingecko_coins import sync_coingecko_coins



from dotenv import load_dotenv


load_dotenv("/Users/bp/Documents/crypto_site/crypto-site/flask-backend/venv/keys.env")


app = Flask(__name__)
CORS(app)
app.register_blueprint(bp_resolve_product_id_cb)
app.register_blueprint(bp_cb_coin_load)
app.register_blueprint(coingecko_bp)
app.register_blueprint(coindesk_bp)
app.register_blueprint(dexscreener_bp)
app.register_blueprint(supabase_bp)
app.register_blueprint(search_bp)

if __name__ == "__main__":
    sync_coingecko_coins()
    #app.run(debug=True)