from flask import Blueprint, request, jsonify
from utils.Coin import Coin
from api.strategy_runner import create_multistrategy_manager
import json

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
    

@bp_cb_coin_load.route('/api/plot-strategy', methods=['POST'])
def plot_strategy():
    data = request.get_json(force=True)
    print(f"received plot data: {data}")
    required = ['start','end','granularity','product_id','strategies']
    if not all([k in data for k in required]):
        return jsonify({'error': 'Missing required parameters'}), 400
    
    product_id = data['product_id']
    start = data['start']
    end = data['end']
    granularity = data['granularity']
    strategy_input = data['strategies']

    try:
        coin = Coin(product_id=product_id)
        coin.get_candles(start,end,granularity)
        candles = coin.fetch_candles()
        manager = create_multistrategy_manager(strategy_input)
        plottable_coin = manager.apply_strategies(candles)
        print(f"Here is the strategy df: ", plottable_coin)
        manager.collect_plot_metadata(plottable_coin)
        plot = manager.plot_combined(plottable_coin)
        plot_json = json.loads(plot.to_json())
        return jsonify(plot_json)
    
    except Exception as e:
        return jsonify({'Error': str(e)}), 500