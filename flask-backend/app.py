from flask import Flask
from flask_cors import CORS
from api.resolve_product_id_cb import bp_resolve_product_id_cb
from api.cb_load import bp_cb_coin_load
from api.coingecko_route import coingecko_bp


app = Flask(__name__)
CORS(app)
app.register_blueprint(bp_resolve_product_id_cb)
app.register_blueprint(bp_cb_coin_load)
app.register_blueprint(coingecko_bp)

if __name__ == "__main__":
    app.run(debug=True)