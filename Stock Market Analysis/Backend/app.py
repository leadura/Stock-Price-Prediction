from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
import keras
import os
import requests

# Create a Flask app instance and enable CORS for the frontend
app = Flask(__name__)
CORS(app)

# Load the trained Keras model
model_path = os.path.join(os.path.dirname(__file__), 'Latest_stock_price_model.keras')
try:
    model = keras.models.load_model(model_path)
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None


# Dummy scaler (mimics MinMaxScaler inverse_transform)
class DummyScaler:
    def __init__(self, data):
        self.min_ = np.min(data)
        self.scale_ = np.max(data) - self.min_

    def inverse_transform(self, scaled_data):
        return scaled_data * self.scale_ + self.min_


# 🔍 NEW: Proxy search endpoint (to avoid CORS issues with Yahoo)
@app.route("/search", methods=["GET"])
def search_stocks():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"quotes": []})

    url = f"https://query1.finance.yahoo.com/v1/finance/search?q={query}"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    try:
        res = requests.get(url, headers=headers, timeout=10)
        res.raise_for_status()
        data = res.json()

        # Optional: Filter results to only equities (avoid funds, warrants, etc.)
        quotes = [
            q for q in data.get("quotes", [])
            if q.get("quoteType") == "EQUITY"
        ]

        return jsonify({"quotes": quotes})
    except Exception as e:
        print("Error in search proxy:", e)
        return jsonify({"quotes": []}), 500


# 📈 Stock price prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    """
    API endpoint to predict the next day's stock price for a given ticker.
    """
    if model is None:
        return jsonify({'error': 'Prediction model not loaded.'}), 500

    try:
        data = request.json
        stock_ticker = data.get('ticker')
        if not stock_ticker:
            return jsonify({'error': 'Ticker is required'}), 400

        # Fetch historical stock data
        stock_data = yf.download(stock_ticker, period='2y', progress=False, auto_adjust=False)

        if stock_data.empty:
            return jsonify({'error': 'No data found for the given ticker'}), 404

        # Pick adjusted close if available, else close
        if 'Adj Close' in stock_data.columns:
            adj_close_price = stock_data[['Adj Close']]
        else:
            adj_close_price = stock_data[['Close']]

        # Scale the data
        scaler = DummyScaler(adj_close_price.values)
        scaled_data = (adj_close_price.values - scaler.min_) / scaler.scale_

        # Create sequence of last 100 days
        last_100_days = scaled_data[-100:]
        last_100_days = np.reshape(last_100_days, (1, last_100_days.shape[0], 1))

        # Predict next day's price
        predicted_scaled_price = model.predict(last_100_days)
        predicted_price = scaler.inverse_transform(predicted_scaled_price)

        # Prepare recent history for chart
        recent_history = adj_close_price.tail(100)
        formatted_history = [
            {'name': str(index.date()), 'price': float(value[0])}
            for index, value in recent_history.iterrows()
        ]

        response = {
            'ticker': stock_ticker,
            'prediction': float(predicted_price[0][0]),
            'recent_history': formatted_history
        }

        return jsonify(response)

    except Exception as e:
        print(f"❌ An error occurred in /predict: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Run Flask app
    app.run(debug=True, port=5000)
