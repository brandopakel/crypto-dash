from database.supabase_client import supabase
from utils.coingecko import call_coingecko_api
import time

def sync_coingecko_coins():
    try:
        all_coins = []
        page = 1
        for page in range(1, 180):
            print(f"🔄 Fetching page {page}...")

            try:
                coin_list = call_coingecko_api('coins/markets', params={
                    'vs_currency': 'usd',
                    'per_page': 250,
                    'page': page,
                })

                if not coin_list:
                    break

                all_coins.extend(coin_list)

                if len(coin_list) < 250:
                    break
            
            except Exception as e:
                print(f"❌ Error on page {page}: {e}")
                break

            time.sleep(15)


        #Truncate for full refresh ?
        supabase.table('coingecko_coins').delete().neq('id', '').execute()
        #supabase.table('coingecko_coins').delete().execute()


        inserts = [
            {   "id": coin["id"],
                "symbol": coin["symbol"],
                "name": coin["name"],
                "image": coin["image"],
                "market_cap_rank": coin.get("market_cap_rank"),
                "current_price": coin.get("current_price"),
                "high_24h": coin.get("high_24h"),
                "low_24h": coin.get("low_24h"),
                "price_change_24h": coin.get("price_change_24h"),
                "price_change_percentage_24h": coin.get("price_change_percentage_24h"),
                "market_cap": coin.get("market_cap"),
                "fully_diluted_valuation": coin.get("fully_diluted_valuation"),
                "market_cap_change_24h": coin.get("market_cap_change_24h"),
                "market_cap_change_percentage_24h": coin.get("market_cap_change_percentage_24h"),
                "total_volume": coin.get("total_volume"),
                "circulating_supply": coin.get("circulating_supply"),
                "total_supply": coin.get("total_supply"),
                "max_supply": coin.get("max_supply"),
                "ath": coin.get("ath"),
                "ath_change_percentage": coin.get("ath_change_percentage"),
                "ath_date": coin.get("ath_date"),
                "atl": coin.get("atl"),
                "atl_change_percentage": coin.get("atl_change_percentage"),
                "atl_date": coin.get("atl_date"),
                "last_updated": coin.get("last_updated")
             } for coin in all_coins]

        for i in range(0, len(inserts), 500):
            supabase.table('coingecko_coins').upsert(inserts[i:i+500], on_conflict='id').execute()
        
        print(f"✅ Synced {len(inserts)} coins into Supabase.")

    except Exception as e:
        print(f"❌ Sync failed: {e}")