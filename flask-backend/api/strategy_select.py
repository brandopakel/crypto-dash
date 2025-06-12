from flask import Flask, Blueprint, request, jsonify
from strategies.registry import STRATEGY_MAP
from utils.Coin import Coin
from utils.MultiStrategyManager import MultiStrategyManager
from utils.class_multi_strategy_select import multi_strategy_select

bp = Blueprint('strategy', __name__)

@bp.route("/api/strategy/select", methods=["POST"])
def multi_strat_select():
    data = request.get_json()
  