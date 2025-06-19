from flask import Blueprint, request, jsonify
from utils.coingecko import call_coingecko_api

coingecko_bp = Blueprint('coingecko_bp', __name__)

@coingecko_bp.route('/api/coingecko/<path:endpoint>', methods=['GET','POST'])
def proxy_coingecko(endpoint):
    method = request.method
    params = request.args.to_dict()
    data = request.get_json(silent=True)
    #headers = dict(request.headers)

    try:
        result = call_coingecko_api(
            path=endpoint,
            method=method,
            params=params,
            headers={},
            data=data
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500