"""
Phase 5: Academic Historical Backtester
========================================
Mathematically evaluates the historical predictive power of the PCA regime signals
by comparing a dynamic Beta-adjusted portfolio to a static Buy & Hold baseline.

Strategy Rules:
  - Trend Market:         1.0 Beta (100% S&P 500)
  - Range Market:         0.5 Beta (50% S&P 500, 50% Cash)
  - Crisis:               0.0 Beta (0% Equities, 100% Cash/Treasuries)
  - Inflation Shock:      1.0 allocation to Gold
  - Liquidity Expansion:  1.0 allocation to Gold
"""

import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("ACADEMIC-BACKTEST")


class PCABacktestSimulator:
    """
    Academic backtesting engine.
    Allocates portfolio Beta according to PCA-detected market states.
    """

    ALLOCATION_RULES = {
        "Trend Market":         {"^GSPC": 1.0, "GC=F": 0.0, "cash": 0.0},
        "Range Market":         {"^GSPC": 0.5, "GC=F": 0.0, "cash": 0.5},
        "Crisis":               {"^GSPC": 0.0, "GC=F": 0.0, "cash": 1.0},
        "Inflation Shock":      {"^GSPC": 0.0, "GC=F": 1.0, "cash": 0.0},
        "Liquidity Expansion":  {"^GSPC": 0.0, "GC=F": 1.0, "cash": 0.0},
    }

    def __init__(self, regimes_path: str, returns_path: str):
        self.regimes = pd.read_csv(regimes_path, index_col="Date", parse_dates=True)
        self.returns = pd.read_csv(returns_path, index_col="Date", parse_dates=True)

    def run(self) -> pd.DataFrame:
        """Execute the historical simulation and return daily equity curves."""
        logger.info("=== Initiating PCA Academic Backtest ===")

        # Align dates between regimes and returns
        common_dates = self.regimes.index.intersection(self.returns.index)
        regimes = self.regimes.loc[common_dates]
        returns = self.returns.loc[common_dates]

        logger.info(f"Simulation window: {common_dates[0]} -> {common_dates[-1]} ({len(common_dates)} trading days)")

        # Daily strategy returns
        strategy_returns = []
        benchmark_returns = []

        for date in common_dates:
            regime = regimes.loc[date, "Regime"]
            alloc = self.ALLOCATION_RULES.get(regime, {"^GSPC": 0.5, "GC=F": 0.0, "cash": 0.5})

            # Strategy return = weighted sum of asset returns based on dynamic Beta
            daily_r = 0.0
            if "^GSPC" in returns.columns:
                daily_r += alloc["^GSPC"] * returns.loc[date, "^GSPC"]
            if "GC=F" in returns.columns:
                daily_r += alloc["GC=F"] * returns.loc[date, "GC=F"]
            # Cash contributes 0% return

            strategy_returns.append(daily_r)

            # Benchmark: 1.0 Beta (100% Buy & Hold S&P 500)
            bench_r = returns.loc[date, "^GSPC"] if "^GSPC" in returns.columns else 0.0
            benchmark_returns.append(bench_r)

        # Build equity curves (cumulative product of 1 + r)
        results = pd.DataFrame({
            "Date": common_dates,
            "Strategy_Return": strategy_returns,
            "Benchmark_Return": benchmark_returns,
            "Regime": regimes["Regime"].values,
        })
        results.set_index("Date", inplace=True)

        results["Strategy_Equity"] = (1 + results["Strategy_Return"]).cumprod()
        results["Benchmark_Equity"] = (1 + results["Benchmark_Return"]).cumprod()

        # Performance metrics
        self.strategy_total = float(results["Strategy_Equity"].iloc[-1] - 1)
        self.benchmark_total = float(results["Benchmark_Equity"].iloc[-1] - 1)
        self.strategy_max_dd = float(self._max_drawdown(results["Strategy_Equity"]))
        self.benchmark_max_dd = float(self._max_drawdown(results["Benchmark_Equity"]))
        self.strategy_sharpe = float(self._sharpe_ratio(results["Strategy_Return"]))
        self.benchmark_sharpe = float(self._sharpe_ratio(results["Benchmark_Return"]))

        logger.info(f"Model Total Return: {self.strategy_total:.4f}")
        logger.info(f"Baseline Total Return: {self.benchmark_total:.4f}")
        logger.info(f"Model Max Drawdown: {self.strategy_max_dd:.4f}")
        logger.info(f"Baseline Max Drawdown: {self.benchmark_max_dd:.4f}")
        logger.info(f"Model Sharpe: {self.strategy_sharpe:.4f}")
        logger.info(f"Baseline Sharpe: {self.benchmark_sharpe:.4f}")
        logger.info("=== Academic Backtest Complete ===")

        return results

    @staticmethod
    def _max_drawdown(equity_curve: pd.Series) -> float:
        """Compute maximum drawdown from peak."""
        peak = equity_curve.cummax()
        drawdown = (equity_curve - peak) / peak
        return drawdown.min()

    @staticmethod
    def _sharpe_ratio(returns: pd.Series, risk_free: float = 0.0, periods: int = 252) -> float:
        """Annualized Sharpe Ratio."""
        excess = returns - risk_free / periods
        if excess.std() == 0:
            return 0.0
        return float(np.sqrt(periods) * excess.mean() / excess.std())

    def get_metrics(self) -> dict:
        """Return performance summary as a dictionary."""
        return {
            "strategy_total_return": round(self.strategy_total * 100, 2),
            "benchmark_total_return": round(self.benchmark_total * 100, 2),
            "strategy_max_drawdown": round(self.strategy_max_dd * 100, 2),
            "benchmark_max_drawdown": round(self.benchmark_max_dd * 100, 2),
            "strategy_sharpe": round(self.strategy_sharpe, 3),
            "benchmark_sharpe": round(self.benchmark_sharpe, 3),
        }
