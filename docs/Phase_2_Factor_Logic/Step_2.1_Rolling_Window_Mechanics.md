# Step 2.1: Rolling Window Architecture & Macro-Responsiveness

This document provides the quantitative justification for our rolling PCA architecture and explains why a 60-day window was selected as the optimal "Macro-Responsive Sweet Spot."

## 1. The Challenge of Non-Stationary Correlations

In high-finance, correlations are not static constants; they are dynamic state variables. A "Static PCA" calculated over 4 years would represent the average relationship, entirely blurring out the acute correlation spikes that occur during crises.

**The Rolling Solution:** By recalculating the entire PCA model every day using a trailing window, we allow the principal axes to **physically rotate** in the asset space. This enables the model to detect when a specific asset class (e.g., US Treasuries) suddenly becomes the dominant driver of market variance.

## 2. Why 60 Trading Days? (Rationales)

Selecting the window length ($N$) involves a trade-off between **Statistical Stability** and **Macro Responsiveness**.

### A. The Business Quarter Cycle
60 trading days approximately equals **one calendar quarter** (3 months). Most macroeconomic data (GDP, Earnings, Inflation prints) are released on a quarterly or rolling monthly basis. A 60-day window ensures that the model is always calibrated to the *current* economic environment without being "polluted" by stale data from the previous year.

### B. Statistical Conditioning ($N > P$)
Mathematically, the sample covariance matrix $\Sigma$ of $P$ assets requires $N > P$ observations to be full-rank and invertible.
- Our $P = 10$.
- With $N = 60$, we have a ratio of **6:1**, which provides sufficient degrees of freedom to avoid over-fitting to daily noise while maintaining a stable estimate of the correlation structure.

### C. Responsiveness vs. Echo Effects
- **Long Windows (e.g., 252 days / 1 year)**: Suffer from "Echo Effects." A major market crash would stay in the window for an entire year, causing the model to stay in a "Crisis" state long after the market has recovered.
- **Short Windows (e.g., 20 days)**: Suffer from "Chattering." Daily volatility causes the eigenvectors to rotate violently, leading to unstable regime signals.
- **The 60-Day Sweet Spot**: Responsive enough to detect a regime shift within 3-5 days of a structural break, yet stable enough to filter out weekly noise.

## 3. Implementation Guards: Look-Ahead Bias

Our optimized `phase_2_rolling_engine.py` employs a strict indexing guard:
```python
window_indices = slice(t - window_size + 1, t + 1)
```
This ensures that the calculation for day `T` uses **only** data from `T-59` to `T`. No future information from day `T+1` or beyond is ever visible to the model, guaranteeing the integrity of our historical "backtest."
