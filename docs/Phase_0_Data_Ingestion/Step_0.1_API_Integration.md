# Step 0.1: Asset Universe Selection & High-Fidelity Data Ingestion

This document establishes the theoretical framework for our multi-asset universe selection and details the programmatic acquisition of the high-fidelity price history required for robust Principal Component analysis.

## 1. Theoretical Framework for Asset Selection

To isolate broad macroeconomic "Global Factors," we have constructed a diversified, high-liquid universe across four primary asset classes. The objective is to capture the joint distribution of global risk sentiment, liquidity cycles, and inflationary pressures.

### The Representative Universe
Our universe consists of 10 primary instruments, each serving a specific role in the latent factor space:

| Asset Class | Ticker | Economic Proxy | Role in Factor Space |
| :--- | :--- | :--- | :--- |
| **Equities** | `^GSPC` | S&P 500 Index | Primary driver of the "Growth" factor (PC1). |
| **Forex (Majors)** | `EURUSD=X` | Eurozone Strength | Captures global trade and non-USD sentiment. |
| **Forex (Majors)** | `JPY=X` | Funding / Safe Haven | Captures the "Carry Trade" and risk-aversion flows. |
| **Forex (Majors)** | `GBPUSD=X` | UK Capital Flows | Secondary growth and trade proxy. |
| **Forex (Majors)** | `CHF=X` | Safe Haven | Pure capital preservation proxy. |
| **Forex (Majors)** | `CAD=X` | Commodity Currency | Ties Forex to industrial energy cycles. |
| **Forex (Majors)** | `AUDUSD=X` | Risk Beta | Highly sensitive to Chinese growth and global commodity demand. |
| **Commodities** | `GC=F` | Gold | Inflation hedge and real interest rate proxy (PC3). |
| **Commodities** | `CL=F` | Crude Oil | Industrial demand and cost-push inflation proxy. |
| **Bonds** | `^TNX` | 10Y US Treasury | The "Risk-Free" rate; captures monetary policy expectations. |

## 2. Programmatic Ingestion via `yfinance`

We utilize the `yfinance` library to fetch adjusted closing prices. This choice is predicated on its ability to provide split-adjusted and dividend-adjusted data, which is critical for calculating true total returns.

### The Ingestion Pipeline (`phase_0_ingestion.py`)

1. **Query Window:** We define a 4-year horizon (2020-01-01 to 2024-01-01) to ensure the model experiences multiple regime transitions:
   - **COVID-19 Shock (2020):** Extreme risk-off/liquidity crunch.
   - **Post-Pandemic Recovery (2021):** Growth factor expansion.
   - **Inflation Surge & Rate Hikes (2022-2023):** PC3 dominance.

2. **Thread Management:** We set `threads=False` to ensure sequential execution on local systems, preventing potential rate-limiting or network-level data corruption during multi-ticker downloads.

3. **Data Isolation:** We extract only the `Adj Close` column, as open, high, and low prices are secondary to the close-to-close mathematical stationarity required by PCA.

## 3. Justification for the 4-Year Lookback
A 4-year lookback (~1000 trading days) provides a sufficient sample size to establish long-term correlations while being recent enough to exclude structural breaks from the pre-2010s era. This ensures our rolling 60-day windows have a rich historical context to be compared against during Phase 2 analysis.
