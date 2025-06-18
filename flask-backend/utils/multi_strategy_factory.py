from utils.Strategy import Strategy, BollingerBandsStrategy, MACDCrossoverStrategy,  RateOfChangeStrategy, RSIStrategy, MovingAverageCrossoverStrategy, ZScoreMeanReversionStrategy, FibonacciRetracementStrategy, ElliotWaveStrategy, VWAPStrategy, OBVStrategy, ADXStrategy, IchimokuCloudStrategy, GartleyPatternStrategy
from pandas import DataFrame
from utils.user_input import get_user_roc_inputs, get_user_ew_trend
from strategies.elliot_wave import find_local_extrema, get_user_order_inputs

def create_strategy_objects(selected_strategies: list[str]) -> list[Strategy]:
    strategy_map = {
        "bollinger": {
            "class": BollingerBandsStrategy,
            "desc": "Bollinger Bands (mean reversion using standard deviation)"
        },
        "macd": {
            "class": MACDCrossoverStrategy,
            "desc": "MACD Crossover (momentum-based crossover)"
        },
        "roc": {
            "class": RateOfChangeStrategy,
            "desc": "Rate of Change (momentum threshold strategy)"
        },
        "rsi": {
            "class": RSIStrategy,
            "desc": "RSI (Relative Strength Index based buy/sell)"
        },
        "sma": {
            "class": MovingAverageCrossoverStrategy,
            "desc": "Simple Moving Average crossover (trend following)"
        },
        "z": {
            "class": ZScoreMeanReversionStrategy,
            "desc": "Z-Score of Price vs Moving Average (mean reversion)"
        },
        "vwap": {
            "class": VWAPStrategy,
            "desc": "Volume-Weighted Average Price"
        },
        "obv" : {
            "class": OBVStrategy,
            "desc": "On-Balance Volume"
        },
        "adx": {
            "class": ADXStrategy,
            "desc": "Average Directional Movement Index"
        },
        "ichimoku": {
            "class": IchimokuCloudStrategy,
            "desc": "Ichimoku Cloud Strategy"
        },
        "fibonacci": {
                "class": FibonacciRetracementStrategy,
                "desc": "Fibonacci Retracement Levels"
            },
        "ew": {
            "class" : ElliotWaveStrategy,
            "desc" : "Elliot Wave Visualization"
        },
        "gartley":{
            "class": GartleyPatternStrategy,
            "desc": "Gartley Pattern Visualization"
        }
    }

    #Testing for now:

    #ROC
    period = 0
    threshold = 0

    #EW
    order=0
    trend=0

    selected_strategies = []
    for name in selected_strategies:
        creator = strategy_map.get(name.lower())
        if creator:
            strategy_class = creator['class']
            if strategy_class == RateOfChangeStrategy:
                selected_strategies.append(strategy_class(period, threshold))
            elif strategy_class == ElliotWaveStrategy:
                selected_strategies.append(strategy_class(order,trend))
            else:
                selected_strategies.append(strategy_class())
        else:
            print(f"⚠️ Unknown strategy: {name}")
    return selected_strategies