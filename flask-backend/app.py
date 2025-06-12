from flask import Flask
from flask_cors import CORS
from api.resolve_product_id_cb import bp_resolve_product_id_cb
from api.cb_load import bp_cb_coin_load


app = Flask(__name__)
CORS(app)
app.register_blueprint(bp_resolve_product_id_cb)
app.register_blueprint(bp_cb_coin_load)

if __name__ == "__main__":
    app.run(debug=True)