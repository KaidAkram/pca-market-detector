# Step 2.2: Threshold Theory & Macro-Regime Mapping

This document defends the mathematical and economic logic behind our regime classification system, specifically the selection of the $\pm 2.0$ and $1.5$ sigma thresholds.

## 1. Economic Mapping of Principal Factors

Through extensive backtesting and loading analysis, we have mapped the latent factors to the following macroeconomic drivers:

1. **PC1: Systematic Growth / Risk-On**: Driven by $^GSPC$ (Positive) vs. JPY/CHF (Negative). A high PC1 indicates equity expansion and safe-haven liquidation.
2. **PC2: Global Liquidity (USD Strength)**: Driven by the USD pairs. A negative PC2 indicates USD weakness, which is historically synonymous with "Liquidity Expansion" and easier global financial conditions.
3. **PC3: Cost-Push Inflation**: Driven by Oil/Gold/Yields. A positive PC3 indicates surging commodity prices and rising rates—a classic "Inflation Shock" profile.

## 2. Threshold Theory (Mathematical Defense)

Since our data is Z-score standardized, the PC scores are approximately centered around zero. In a multivariate normal distribution, we utilize standard deviation units ($\sigma$) to define "Extreme Tails."

### A. The 2.0 Sigma "Crisis/Trend" Threshold
- **PC1 < -2.0 (Crisis)**: According to the 68-95-99.7 rule, a value $<-2.0$ represents the bottom 2.5% of the distribution. In finance, a move of this magnitude in systematic risk is indicative of a **Black Swan event** or a structural "Risk-Off" liquidation.
- **PC1 > 2.0 (Trend Market)**: Conversely, a score $>2.0$ indicates a top-tier growth phase where bullish momentum is statistically significant and decoupled from standard daily mean-reversion.

### B. The 1.5 Sigma "Shock" Threshold
For secondary factors (PC2/PC3), we utilize a slightly lower threshold of **1.5**.
- **PC3 > 1.5 (Inflation Shock)**: This represents approximately the top 6% of inflation-related co-movements. We use 1.5 instead of 2.0 because inflationary shocks are often more gradual and less "explosive" than equity crashes, requiring a slightly more sensitive filter to be detected within a 60-day window.
- **PC2 < -1.5 (Liquidity Expansion)**: Captures significant USD weakening trends that fall outside the "normal" range but may not reach "Crisis" levels of intensity.

## 3. Hierarchical Decision Tree

The classification is executed in a strict hierarchy to handle overlapping signals:

1. **CRISIS** takes absolute priority (Systemic survival).
2. **TREND** (Structural growth).
3. **INFLATION SHOCK** (Supply-side pressure).
4. **LIQUIDITY EXPANSION** (Monetary tailwinds).
5. **RANGE MARKET** (Default state if no extremes are met).

This ensures that during a major equity crash, the model doesn't get "distracted" by a simultaneous inflation spike—it correctly identifies the dominant systematic risk.
