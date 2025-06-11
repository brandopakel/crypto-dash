from flask import Flask, Blueprint, request, jsonify
from utils.coinbase_api_client import get_coin_from_user_submitted_baseid, get_coin_from_user_submitted_basename, get_user_selected_product_id, get_product_id_from_baseid, get_product_id_from_basename

bp_resolve_product_id_cb = Blueprint('resolve_product_id_cb', __name__)

@bp_resolve_product_id_cb.route('/api/resolve_product_id', methods=['POST'])
def resolve_product_id_cb():
    data = request.get_json()

    print("Received Data:", data)

    method = data.get('method')
    value = data.get('value')

    print(f"Method: {method} | Value: {value}")

    if not method or not value:
        return jsonify({'error': 'Missing method or value'}), 400
    
    try:
        if method == 'name':
            coin = get_coin_from_user_submitted_basename(value)
            basename = coin['Base-Name'].iloc[0]
            product_id = get_product_id_from_basename(basename)
        elif method == 'symbol':
            coin = get_coin_from_user_submitted_baseid(value)
            baseid = coin['Base Currency ID'].iloc[0].upper()
            product_id = get_product_id_from_baseid(baseid)
        elif method == 'pair':
            product_id = value.upper()
        else:
            return jsonify({'error' : 'Invalid Method'}), 400
        
        print("Resolved product_id:", product_id)
        
        return jsonify({'product_id' : product_id})
    except Exception as e:
        return jsonify({'error' : f'Failed to resolve product ID: {str(e)}'})