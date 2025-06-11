from utils.Strategy import BollingerBandsStrategy, MACDCrossoverStrategy,  RateOfChangeStrategy, RSIStrategy, MovingAverageCrossoverStrategy, ZScoreMeanReversionStrategy, FibonacciRetracementStrategy, ElliotWaveStrategy, VWAPStrategy, OBVStrategy, ADXStrategy, IchimokuCloudStrategy, GartleyPatternStrategy

STRATEGY_MAP = {
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

