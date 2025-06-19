from utils.class_multi_strategy_select import multi_strategy_select
from utils.MultiStrategyManager import MultiStrategyManager
from utils.multi_strategy_factory import create_strategy_objects

def create_multistrategy_manager(selected_strategies, period=None, threshold=None, order=None, trend=None):
    strategies = create_strategy_objects(selected_strategies, period, threshold, order, trend)
    manager = MultiStrategyManager(strategies)

    return manager