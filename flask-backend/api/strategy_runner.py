from utils.class_multi_strategy_select import multi_strategy_select
from utils.MultiStrategyManager import MultiStrategyManager
from utils.multi_strategy_factory import create_strategy_objects

def create_multistrategy_manager(selected_strategies):
    strategies = create_strategy_objects(selected_strategies)
    manager = MultiStrategyManager(strategies)

    return manager