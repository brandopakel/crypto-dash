from database.supabase_client import supabase
from flask import Blueprint, request, jsonify

search_bp = Blueprint('search_bp', __name__)

@search_bp.route('/api/search', methods=['GET'])
def global_search():
    query = request.args('q','').lower()
    if not query:
        return jsonify({'error': 'Missing search query'}), 400
    
    results = {}

    try:
        user_settings = supabase.from_('user_settings').select('*').ilike('wallet', f"%{query}%").execute()
        if user_settings.data:
            results['user_settings'] = user_settings.data

        wallets = supabase.table('wallets').select('*').ilike('address', f"%{query}%").execute()
        if wallets.data:
            results['wallets'] = wallets.data
        
        users = supabase.table('users').select('*').or_(f"username.ilike.%{query}%, email.ilike.%{query}%").execute()
        if users.data:
            results['users'] = users.data

        coins = supabase.from_('coingecko_coins').select('*').or_(f"name.ilike.%{query}%, symbol.ilike.%{query}%").execute()
        if coins.data:
            results['coins'] = coins.data

        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 500