from flask import Blueprint, request, jsonify
from utils.dexscreener import call_dexscreener_api

dexscreener_bp = Blueprint("dexscreener_bp", __name__)

@dexscreener_bp.route("/api/dexscreener/<path:endpoint>", methods=["GET", "POST"])
def proxy_dexscreener(endpoint):
    method = request.method
    params = request.args.to_dict()
    data = request.get_json(silent=True)
    headers = dict(request.headers)

    try:
        result = call_dexscreener_api(endpoint, method, params, data, headers)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500