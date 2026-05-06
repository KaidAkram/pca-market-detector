# Step 0.2: Statistical Pre-processing & Log-Return Stationarity

This document details the rigorous cleaning and transformation pipeline required to convert raw, non-stationary price series into the stationary log-return matrices suitable for Principal Component Analysis.

## 1. Asynchronous Market Alignment

Financial markets operate on disparate global calendars. US Equities, Global Forex, and Commodities futures often have conflicting holiday schedules (e.g., US Bond markets closing on Veterans Day while Equities remain open).

### The Cleaning Protocol
Our pipeline implements a strict **Forward-Fill (`ffill`)** strategy:
- **`dropna(how='all')`**: Eliminates "Global Dead Zones" (e.g., Christmas/New Year) where no market is active.
- **Forward-Filling**: For localized holidays, we carry the previous price forward. Mathematically, this corresponds to a **0% return** for that period, which is the only neutral assumption that avoids introducing artificial volatility or look-ahead bias.
- **Stationary Trimming**: We remove the leading row after the first `shift(1)` operation to ensure no `NaN` values enter the math engine.

## 2. Transformation: The Log-Return Standard

We transform prices $P_t$ into log-returns $r_t$ using the natural logarithm:

$$r_t = \ln\left(\frac{P_t}{P_{t-1}}\right)$$

### Why Log-Returns? (Research Justification)

1. **Numerical Stationarity**: Raw prices are typically $I(1)$ processes (non-stationary). PCA performed on raw prices would extract meaningless factors dominated by the trend. Log-returns are generally $I(0)$ (stationary), meaning their mean and variance are stable over time—a prerequisite for covariance estimation.
2. **Time Additivity**: The cumulative return over $n$ days is the simple sum of log-returns: $\sum r_i$. This linear property simplifies the rolling window math significantly compared to simple percentage returns.
3. **Geometric Symmetry**: Simple returns are asymmetric (a 50% loss requires a 100% gain to break even). Log-returns are symmetric; a -0.5 log-return is exactly countered by a +0.5 log-return. This creates a more "Normal" distribution for the eigendecomposition to work with.
4. **Scale Invariance**: Log-returns normalize the magnitude of change across different asset prices (e.g., S&P 500 at 4,000 vs. USD/JPY at 150), preventing high-priced assets from dominating the variance calculation simply due to their absolute nominal value.

## 3. Handling Anomalies (The 2020 Negative Oil Event)

During the ingestion of 2020 data, we encountered the "WTI Negative Price" event. Since $\ln(x)$ is undefined for $x \le 0$, our pipeline automatically detects and drops these rows. This preserves the mathematical integrity of the system by excluding the localized singularity while maintaining the continuity of the other 9 assets.
