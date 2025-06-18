from flask import Blueprint, request, jsonify
from database.supabase_client import supabase

supabase_bp = Blueprint('supabase_bp', __name__)

@supabase_bp.route('/api/save-settings', methods=['POST'])
def save_user_settings():
    data = request.get_json()

    try:
        insert_data = {
            'wallet' : data.get('wallet'),
            'selected_coin': data['selected_coin'],
            'time_interval': data['time_interval'],
            'strategies': data['strategies']
        }

        result = supabase.from_('user_settings').insert(insert_data).execute()
        return jsonify(result.data), 200
    
    except Exception as e:
        return jsonify({'Error': {str(e)}})