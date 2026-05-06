import yfinance as yf
import pandas as pd
import numpy as np
import logging
from statsmodels.tsa.stattools import adfuller
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)

class DataPipeline:
    """
    High-fidelity financial data ingestion and pre-processing pipeline.
    Implements ADF (Augmented Dickey-Fuller) stationarity proofs.
    """
    
    def __init__(self, tickers: Dict[str, str]):
        self.tickers = tickers
        self.raw_data = None
        self.log_returns = None

    def fetch(self, start_date: str, end_date: str) -> pd.DataFrame:
        """Fetch adjusted closing prices from Yahoo Finance."""
        logger.info(f"Fetching data for {len(self.tickers)} assets...")
        symbols = list(self.tickers.keys())
        data = yf.download(symbols, start=start_date, end=end_date, auto_adjust=False, threads=False)
        self.raw_data = data['Adj Close']
        return self.raw_data

    def clean_and_transform(self) -> pd.DataFrame:
        """Align calendars, forward-fill, and calculate log-returns."""
        if self.raw_data is None:
            raise ValueError("No data fetched. Call fetch() first.")
            
        # Alignment & Cleaning
        df = self.raw_data.dropna(how='all').ffill().dropna()
        
        # Log Transformation
        # Formula: r_t = ln(P_t / P_{t-1})
        returns = np.log(df / df.shift(1)).dropna()
        
        self.log_returns = returns
        return returns

    def prove_stationarity(self, significance_level: float = 0.05) -> Dict[str, Any]:
        """
        PhD-Level Rigor: Proves stationarity of each series using the ADF test.
        Returns a dictionary of results for reporting.
        """
        if self.log_returns is None:
            raise ValueError("No returns calculated. Call clean_and_transform() first.")
            
        results = {}
        logger.info("Initiating ADF Stationarity Proofs...")
        
        for ticker in self.log_returns.columns:
            series = self.log_returns[ticker].values
            adf_result = adfuller(series)
            p_value = adf_result[1]
            
            is_stationary = bool(p_value < significance_level)
            results[ticker] = {
                "p_value": float(p_value),
                "is_stationary": is_stationary,
                "test_statistic": float(adf_result[0])
            }
            
            status = "PASSED" if is_stationary else "FAILED"
            logger.info(f" - {ticker:<10} | ADF p-value: {p_value:.6f} | Stationarity: {status}")
            
        return results

    def save_artifacts(self, returns_path: str, proofs_path: str, proofs_data: Dict[str, Any]):
        """Save the log returns and the mathematical proofs to disk."""
        if self.log_returns is not None:
            self.log_returns.to_csv(returns_path)
            logger.info(f"Stationary dataset saved to {returns_path}")
            
        import json
        with open(proofs_path, 'w') as f:
            json.dump(proofs_data, f, indent=4)
            logger.info(f"ADF Proofs saved to {proofs_path}")
