from flask import Blueprint, request, jsonify
from utils.coindesk import call_coindesk_api

coindesk_bp = Blueprint("coindesk_bp", __name__)

@coindesk_bp.route("/api/coindesk/<path:endpoint>", methods=["GET", "POST"])
def proxy_coindesk(endpoint):
    method = request.method
    params = request.args.to_dict()
    data = request.get_json(silent=True)
    headers = dict(request.headers)

    try:
        result = call_coindesk_api(endpoint, method, params, data, headers)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500