from flask import Flask
from flask_cors import CORS
from api.strategy import bp as strategy_bp

app = Flask(__name__)
app.register_blueprint(strategy_bp)

if __name__ == "__main__":
    app.run(debug=True)