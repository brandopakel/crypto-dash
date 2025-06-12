from flask import Flask, Blueprint, request, jsonify
from utils.coinbase_api_client import get_coin_from_user_submitted_baseid, get_coin_from_user_submitted_basename, get_user_selected_product_id, get_product_id_from_baseid, get_product_id_from_basename

bp_resolve_product_id_cb = Blueprint('resolve_product_id_cb', __name__)

@bp_resolve_product_id_cb.route('/api/resolve_product_id_cb', methods=['POST'])
def resolve_product_id_cb():
    data = request.get_json()

    method = data.get('method')
    value = data.get('value')

    if not method or not value:
        return jsonify({'error': 'Missing method or value'}), 400
    
    try:
        if method == 'name':
            coin = get_coin_from_user_submitted_basename(value)
            basename = coin['Base-Name'].iloc[0]
            options = get_product_id_from_basename(basename)
            return jsonify({'product_ids' : options})
        elif method == 'symbol':
            coin = get_coin_from_user_submitted_baseid(value)
            baseid = coin['Base Currency ID'].iloc[0].upper()
            options = get_product_id_from_baseid(baseid)
            return jsonify({'product_ids' : options})
        elif method == 'pair':
            product_id = value.upper()
            return jsonify({'product_id' : product_id})
        else:
            return jsonify({'error' : 'Invalid Method'}), 400
    
    except Exception as e:
        return jsonify({'error' : f'Failed to resolve product ID: {str(e)}'})