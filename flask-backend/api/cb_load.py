from flask import Blueprint, request, jsonify
from utils.Coin import Coin

bp_cb_coin_load = Blueprint("cb_coin_loader", __name__)

@bp_cb_coin_load.route("/api/cb_load", methods=['POST'])
def cb_load_coin():
    data = request.get_json(force=True)
    print("📥 Full JSON received:", data)
    if 'start' in data and 'end' in data and 'granularity' in data:
        start = data['start']
        end = data['end']
        granularity = data['granularity']
        #return jsonify({'message': 'Loaded candles', 'start': start, 'end': end, 'granularity': granularity})
    #elif 'product_id' in data:
        product_id = data['product_id']
        #return jsonify({'message': 'Resolved product', 'product_id': product_id})

    if not product_id:
        return jsonify({'error': 'Missing Product ID'}), 400
    
    if not all([start, end, granularity]):
        return jsonify({'error': 'Missing parameters'}), 400
    
    try:
        coin = Coin(product_id)
        coin.get_candles(start, end, granularity)
        candles = coin.fetch_candles()
        coin_candles = candles.to_dict(orient='records')
        return jsonify({'product_id': product_id, 'candles': coin_candles})
    except Exception as e:
        return jsonify({'error': f"Failed to load coin: {str(e)}"})