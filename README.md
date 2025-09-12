# 📈🤖 Stock Price Prediction - AI Powered Analysis Dashboard

This project is an AI-powered stock market analysis dashboard that predicts next-day stock prices using a deep learning **LSTM** model. The application provides an interactive frontend for searching and analyzing companies across global markets.

---
<p align="center">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/Flask--CORS-black?style=for-the-badge&logo=flask&logoColor=white" alt="Flask-CORS">
  <img src="https://img.shields.io/badge/Numpy-013243?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy">
  <img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas">
  <img src="https://img.shields.io/badge/yfinance-blue?style=for-the-badge" alt="yfinance">
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="scikit-learn">
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow">
  <img src="https://img.shields.io/badge/Keras-D00000?style=for-the-badge&logo=keras&logoColor=white" alt="Keras">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
</p>

<div align="center">

🔗 [Features](#features) • [Project Structure](#project-structure) • [Tech Stack](#tech-stack) • [Setup & Installation](#setup--installation) • [How It Works](#how-it-works) • [Applications](#applications) • [Limitations](#limitations) • [Future Enhancements](#future-enhancements) • [References](#references) • [Author](#author)

</div>

## 🚀 Features

*   *🔮 AI Predictions*: Forecasts the next-day stock price using an LSTM model.
*   *🔍 Search by Company Name or Ticker*: Autocomplete powered by Yahoo Finance API.
*   *📊 Dashboard UI*: Displays predicted price, last price comparison, and a 100-day historical chart.
*   *🕘 Recent Searches*: Saves recent stock lookups locally with an option to clear history.
*   *🌍 Global Market Support*: Works for companies across:
    *   U.S. → AAPL, GOOGL, MSFT
    *   India → RELIANCE.NS, TCS.NS, HDFCBANK.NS
    *   China → 9988.HK (Alibaba), 0700.HK (Tencent)
    *   Japan → 7203.T (Toyota), 6758.T (Sony)
    *   U.K. → HSBA.L (HSBC)

## 🏗 Project Structure
```

Stock Market Analysis /
├── Backend/
│   ├── app.py                       # Flask backend API
│   ├── Latest_stock_price_model.keras  # Trained LSTM model
│   ├── requirements.txt             # Python dependencies
│   └── stock_price.ipynb            # Model training notebook
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── ui/
    │   │       ├── AppSidebar.tsx
    │   │       ├── Dashboard.tsx
    │   │       ├── Navbar.tsx
    │   │       ├── PredictionCard.tsx
    │   │       ├── RecentSearches.tsx
    │   │       └── StockChart.tsx
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── package.json
    ├── tailwind.config.ts
    └── vite.config.ts
```
## ⚙ Tech Stack

*   *Backend:* Python + Flask, TensorFlow / Keras (LSTM model), Yahoo Finance API (yFinance)
*   *Frontend:* React + TypeScript, TailwindCSS, Recharts (visualizations)

## 🔧 Setup & Installation

### 1️⃣ Backend Setup

1.  Navigate to the Backend directory:
    bash
    ```
    cd Backend
    
3.  Install dependencies:
    bash
    ```
    pip install -r requirements.txt
    
5.  Run the Flask application:
    bash
    ```
    python app.py
    ```
    The backend will run at: http://127.0.0.1:5000

### 2️⃣ Frontend Setup

1.  Navigate to the frontend directory:
    bash
    ```
    cd frontend
    
3.  Install dependencies:
    bash
    ```
    npm install
    
5.  Start the development server:
    bash
    ```
    npm run dev
    ```
    The frontend will run at: http://localhost:5173

## 📊 How It Works

1.  The user searches for a stock by its company name or ticker symbol (e.g., Apple → AAPL).
2.  The Yahoo Finance API provides suggestions for valid tickers.
3.  The Flask backend fetches two years of historical stock data for the selected ticker.
4.  This data is preprocessed and then fed into the trained LSTM model.
5.  The LSTM model predicts the next-day stock price and provides the last 100 days of historical data.
6.  The frontend displays the predicted price, compares it to the last known price (showing the percentage change), and visualizes the historical data with a chart.

## 📌 Applications

*   *📉 Investors*: Gain quick insights into potential stock movements.
*   *🏦 Institutions*: Utilize as a research tool for market forecasting.
*   *📚 Academics*: Serve as a practical demonstration of AI applications in finance.

## ⚠ Limitations

*   Predictions are limited to the next day only.
*   The model does not incorporate sentiment analysis from news or social media.
*   Prediction accuracy can vary depending on market volatility.

## 🔮 Future Enhancements

*   *💱 Multi-currency support*: Enable conversions between currencies (e.g., USD ↔ INR).
*   *📰 Sentiment analysis*: Integrate analysis from financial news and social media.
*   *☁ Cloud deployment*: Deploy the application using Docker.
*   *📊 Portfolio analysis*: Add features for portfolio tracking and personalized alerts.

## 📝 References

*   Yahoo Finance API
*   Keras Documentation
*   Research papers on LSTM for financial forecasting

## 👨‍💻 Author

Harshit Waldia
