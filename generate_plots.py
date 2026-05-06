import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import yfinance as yf

# Set academic style for plots
plt.style.use('dark_background')
sns.set_theme(style="darkgrid", rc={"axes.facecolor": "#020205", "figure.facecolor": "#020205", "text.color": "white", "axes.labelcolor": "white", "xtick.color": "white", "ytick.color": "white", "grid.color": "#1e293b"})

# Create plots directory
os.makedirs('plots', exist_ok=True)

import json

print("Loading data...")
# Load datasets
returns_df = pd.read_csv('pca_ready_dataset.csv', index_col='Date', parse_dates=True)
regimes_df = pd.read_csv('pca_rolling_regimes.csv', index_col='Date', parse_dates=True)

with open('pca_loadings.json', 'r') as f:
    loadings_data = json.load(f)

# The loaded JSON is { 'PC1': { 'asset': val, ... }, ... }
loadings_df = pd.DataFrame(loadings_data)

# Recompute full PCA for the scree plot
corr_matrix = returns_df.corr()
eigenvalues, _ = np.linalg.eigh(corr_matrix)
# Sort descending
eigenvalues = eigenvalues[::-1]
explained_variance_ratio = eigenvalues / np.sum(eigenvalues)


# Align dates for plotting
common_dates = returns_df.index.intersection(regimes_df.index)
returns_df = returns_df.loc[common_dates]
regimes_df = regimes_df.loc[common_dates]

assets = returns_df.columns.tolist()

# Define regime colors matching frontend
regime_colors = {
    'Trend Market': '#3b82f6',
    'Range Market': '#10b981',
    'Crisis': '#ef4444',
    'Inflation Shock': '#eab308',
    'Liquidity Expansion': '#a855f7'
}

# --- Plot 1: Raw Asset Prices ---
print("Generating 01_raw_prices.png...")
# Fetch raw prices to demonstrate scale differences
raw_data = yf.download(assets, start=returns_df.index[0], end=returns_df.index[-1])['Close']
raw_data = raw_data.ffill()

fig, ax = plt.subplots(figsize=(12, 6), dpi=300)
for asset in ['^GSPC', '^TNX', 'GC=F', 'EURUSD=X']:  # Plot a few diverse assets
    if asset in raw_data.columns:
        ax.plot(raw_data.index, raw_data[asset], label=asset)
ax.set_title("01. Raw Asset Prices (Unscaled)", fontsize=16, fontweight='bold')
ax.set_ylabel("Price / Yield")
ax.legend()
plt.tight_layout()
plt.savefig('plots/01_raw_prices.png')
plt.close()

# --- Plot 2: Stationary Log Returns ---
print("Generating 02_stationary_returns.png...")
fig, ax = plt.subplots(figsize=(12, 6), dpi=300)
for asset in ['^GSPC', '^TNX', 'GC=F', 'EURUSD=X']:
    if asset in returns_df.columns:
        ax.plot(returns_df.index, returns_df[asset], alpha=0.7, label=asset)
ax.set_title("02. Stationary Log Returns I(0)", fontsize=16, fontweight='bold')
ax.set_ylabel("Daily Return")
ax.legend()
plt.tight_layout()
plt.savefig('plots/02_stationary_returns.png')
plt.close()

# --- Plot 3: Cross-Asset Correlation Matrix ---
print("Generating 03_correlation_matrix.png...")
corr_matrix = returns_df.corr()
fig, ax = plt.subplots(figsize=(10, 8), dpi=300)
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f", ax=ax, cbar=True)
ax.set_title("03. Empirical Correlation Matrix (Σ)", fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('plots/03_correlation_matrix.png')
plt.close()

# --- Plot 4: Scree Plot ---
print("Generating 04_scree_plot.png...")
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
ax.bar(range(1, len(eigenvalues)+1), eigenvalues, color='#3b82f6', alpha=0.8)
ax.set_title("04. Scree Plot of Eigenvalues (\u03bb)", fontsize=16, fontweight='bold')
ax.set_ylabel("Eigenvalue Magnitude")
ax.set_xlabel("Principal Component")
ax.set_xticks(range(1, len(eigenvalues)+1))
plt.tight_layout()
plt.savefig('plots/04_scree_plot.png')
plt.close()

# --- Plot 5: Cumulative Variance Explained ---
print("Generating 05_cumulative_variance.png...")
cum_var = np.cumsum(explained_variance_ratio) * 100
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
ax.step(range(1, len(cum_var)+1), cum_var, where='mid', color='#10b981', linewidth=2, marker='o')
ax.axhline(y=80, color='r', linestyle='--', alpha=0.5, label="80% Threshold")
ax.set_title("05. Cumulative Variance Explained (\u03c1)", fontsize=16, fontweight='bold')
ax.set_ylabel("Cumulative Variance (%)")
ax.set_xlabel("Principal Component")
ax.set_xticks(range(1, len(cum_var)+1))
ax.set_ylim(0, 105)
ax.legend()
plt.tight_layout()
plt.savefig('plots/05_cumulative_variance.png')
plt.close()

# --- Plot 6: PC1 Loadings ---
print("Generating 06_loadings_pc1.png...")
pc1_loadings = loadings_df['PC1'].sort_values()
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
colors = ['#ef4444' if val < 0 else '#10b981' for val in pc1_loadings]
pc1_loadings.plot(kind='barh', color=colors, ax=ax)
ax.set_title("06. PC1 Asset Loadings (Market Risk Factor)", fontsize=16, fontweight='bold')
ax.set_xlabel("Weight in PC1")
plt.tight_layout()
plt.savefig('plots/06_loadings_pc1.png')
plt.close()

# --- Plot 7: PC2 & PC3 Loadings ---
print("Generating 07_loadings_pc2_pc3.png...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6), dpi=300)
loadings_df['PC2'].sort_values().plot(kind='barh', color='#3b82f6', ax=ax1)
ax1.set_title("PC2 (Liquidity Factor)", fontsize=14)
loadings_df['PC3'].sort_values().plot(kind='barh', color='#eab308', ax=ax2)
ax2.set_title("PC3 (Inflation Factor)", fontsize=14)
plt.suptitle("07. Orthogonal Macro Factors (PC2 & PC3)", fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('plots/07_loadings_pc2_pc3.png')
plt.close()

# --- Plot 8: Latent Space Scatter (PC1 vs PC2) ---
print("Generating 08_scatter_pc1_vs_pc2.png...")
fig, ax = plt.subplots(figsize=(10, 8), dpi=300)
for regime in regimes_df['Regime'].unique():
    subset = regimes_df[regimes_df['Regime'] == regime]
    ax.scatter(subset['PC1'], subset['PC2'], label=regime, color=regime_colors.get(regime, '#ffffff'), alpha=0.6, edgecolors='none')
ax.set_title("08. Latent Market State Projection (PC1 vs PC2)", fontsize=16, fontweight='bold')
ax.set_xlabel("PC1 (Market Risk)")
ax.set_ylabel("PC2 (Liquidity)")
ax.legend(title="Detected Regime")
plt.tight_layout()
plt.savefig('plots/08_scatter_pc1_vs_pc2.png')
plt.close()

# --- Plot 9: Rolling PC1 Trajectory ---
print("Generating 09_rolling_pc1.png...")
fig, ax = plt.subplots(figsize=(14, 6), dpi=300)
ax.plot(regimes_df.index, regimes_df['PC1'], color='#ef4444', linewidth=1.5)
ax.axhline(y=0, color='w', linestyle='-', alpha=0.2)
ax.axhline(y=regimes_df['PC1'].std() * 2, color='y', linestyle='--', alpha=0.5, label="+2 Std Dev")
ax.axhline(y=-regimes_df['PC1'].std() * 2, color='y', linestyle='--', alpha=0.5, label="-2 Std Dev")
ax.set_title("09. Rolling PC1 Score (Systemic Stress Trajectory)", fontsize=16, fontweight='bold')
ax.set_ylabel("PC1 Score")
ax.legend()
plt.tight_layout()
plt.savefig('plots/09_rolling_pc1.png')
plt.close()

# --- Plot 10: Regime Timeline vs S&P 500 ---
print("Generating 10_regime_timeline.png...")
fig, ax = plt.subplots(figsize=(14, 6), dpi=300)

if '^GSPC' in raw_data.columns:
    sp500 = raw_data['^GSPC']
    valid_dates = sp500.index.intersection(common_dates)
    sp500 = sp500.loc[valid_dates]
    ax.plot(sp500.index, sp500.values, color='white', linewidth=1.5, label='S&P 500')
    
    # Shade regimes
    for i in range(1, len(valid_dates)):
        start = valid_dates[i-1]
        end = valid_dates[i]
        regime = regimes_df.loc[start, 'Regime']
        if pd.notna(regime) and regime in regime_colors:
            ax.axvspan(start, end, color=regime_colors[regime], alpha=0.3)

    # Custom legend
    import matplotlib.patches as mpatches
    patches = [mpatches.Patch(color=color, alpha=0.3, label=regime) for regime, color in regime_colors.items()]
    ax.legend(handles=patches, loc='upper left')

ax.set_title("10. Empirical Regime Timeline", fontsize=16, fontweight='bold')
ax.set_ylabel("S&P 500 Price")
ax.grid(True, linestyle='--', alpha=0.2)
plt.tight_layout()
plt.savefig('plots/10_regime_timeline.png')
plt.close()

# --- Plot 11: Backtest Performance ---
if os.path.exists('pca_backtest_results.csv'):
    print("Generating 11_backtest_performance.png...")
    bt_df = pd.read_csv('pca_backtest_results.csv', index_col='Date', parse_dates=True)
    fig, ax = plt.subplots(figsize=(12, 6), dpi=300)
    ax.plot(bt_df.index, bt_df['Strategy_Equity'], color='#10b981', linewidth=2, label='PCA Dynamic Strategy')
    ax.plot(bt_df.index, bt_df['Benchmark_Equity'], color='#64748b', linewidth=1.5, label='S&P 500 Buy & Hold')
    ax.set_title("11. Cumulative Equity Curve: Strategy vs Benchmark", fontsize=16, fontweight='bold')
    ax.set_ylabel("Cumulative Growth (Base=1.0)")
    ax.legend(loc='upper left')
    ax.grid(True, linestyle='--', alpha=0.2)
    plt.tight_layout()
    plt.savefig('plots/11_backtest_performance.png')
    plt.close()

# --- Plot 12: Regime Distribution ---
if os.path.exists('pca_backtest_results.csv'):
    print("Generating 12_regime_distribution.png...")
    regime_counts = bt_df['Regime'].value_counts()
    fig, ax = plt.subplots(figsize=(8, 8), dpi=300)
    colors = [regime_colors.get(r, '#888888') for r in regime_counts.index]
    ax.pie(regime_counts, labels=regime_counts.index, autopct='%1.1f%%', colors=colors, startangle=140, textprops={'color': 'w', 'fontweight': 'bold'})
    ax.set_title("12. Historical Regime Distribution", fontsize=16, fontweight='bold')
    plt.tight_layout()
    plt.savefig('plots/12_regime_distribution.png')
    plt.close()

# --- Plot 13: Rolling Spectral Entropy ---
if os.path.exists('pca_rolling_regimes.csv'):
    print("Generating 13_rolling_spectral_entropy.png...")
    roll_df = pd.read_csv('pca_rolling_regimes.csv', index_col='Date', parse_dates=True)
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.plot(roll_df.index, roll_df['SpectralEntropy'], color='#8b5cf6', linewidth=1.5)
    ax.axhline(0.8, color='red', linestyle='--', label='Range Market Threshold (0.8)')
    ax.set_title("13. Rolling Spectral Entropy (Information Dispersion)", fontsize=16, fontweight='bold')
    ax.set_ylabel("Shannon Entropy (H)")
    ax.legend(loc='upper right')
    ax.grid(True, linestyle='--', alpha=0.2)
    plt.tight_layout()
    plt.savefig('plots/13_rolling_spectral_entropy.png')
    plt.close()

# --- Plot 14: Drawdown Profile ---
if os.path.exists('pca_backtest_results.csv'):
    print("Generating 14_drawdown_profile.png...")
    bt_df = pd.read_csv('pca_backtest_results.csv', index_col='Date', parse_dates=True)
    strat_roll_max = bt_df['Strategy_Equity'].cummax()
    strat_dd = (bt_df['Strategy_Equity'] / strat_roll_max) - 1.0
    bench_roll_max = bt_df['Benchmark_Equity'].cummax()
    bench_dd = (bt_df['Benchmark_Equity'] / bench_roll_max) - 1.0
    
    fig, ax = plt.subplots(figsize=(12, 5), dpi=300)
    ax.fill_between(bench_dd.index, bench_dd, 0, color='#ef4444', alpha=0.3, label='S&P 500 Drawdown')
    ax.fill_between(strat_dd.index, strat_dd, 0, color='#10b981', alpha=0.5, label='Strategy Drawdown')
    ax.set_title("14. Drawdown Profile: Strategy vs Benchmark", fontsize=16, fontweight='bold')
    ax.set_ylabel("Percentage Drawdown")
    import matplotlib.ticker as mtick
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(1.0))
    ax.legend(loc='lower left')
    ax.grid(True, linestyle='--', alpha=0.2)
    plt.tight_layout()
    plt.savefig('plots/14_drawdown_profile.png')
    plt.close()

# --- Plot 15: Rolling Volatility ---
if os.path.exists('pca_backtest_results.csv'):
    print("Generating 15_rolling_volatility.png...")
    strat_vol = bt_df['Strategy_Return'].rolling(window=20).std() * np.sqrt(252)
    bench_vol = bt_df['Benchmark_Return'].rolling(window=20).std() * np.sqrt(252)
    
    fig, ax = plt.subplots(figsize=(12, 5), dpi=300)
    ax.plot(bench_vol.index, bench_vol, color='#ef4444', linewidth=1.5, alpha=0.7, label='S&P 500 Volatility')
    ax.plot(strat_vol.index, strat_vol, color='#10b981', linewidth=1.5, label='Strategy Volatility')
    ax.set_title("15. Rolling 20-Day Annualized Volatility", fontsize=16, fontweight='bold')
    ax.set_ylabel("Annualized Volatility")
    ax.yaxis.set_major_formatter(mtick.PercentFormatter(1.0))
    ax.legend(loc='upper left')
    ax.grid(True, linestyle='--', alpha=0.2)
    plt.tight_layout()
    plt.savefig('plots/15_rolling_volatility.png')
    plt.close()

# --- Plot 16: Regime Transition Matrix ---
if os.path.exists('pca_rolling_regimes.csv'):
    print("Generating 16_regime_transition_matrix.png...")
    roll_df = pd.read_csv('pca_rolling_regimes.csv', index_col='Date', parse_dates=True)
    regimes = roll_df['Regime'].dropna()
    transitions = pd.crosstab(regimes.shift(1), regimes, normalize='index')
    
    fig, ax = plt.subplots(figsize=(8, 6), dpi=300)
    sns.heatmap(transitions, annot=True, cmap='Blues', fmt='.2%', cbar=False, ax=ax)
    ax.set_title("16. Markov Regime Transition Probabilities", fontsize=16, fontweight='bold')
    ax.set_xlabel("Next Day Regime")
    ax.set_ylabel("Current Regime")
    plt.tight_layout()
    plt.savefig('plots/16_regime_transition_matrix.png')
    plt.close()

# --- Plot 17: Monthly Return Heatmap ---
if os.path.exists('pca_backtest_results.csv'):
    print("Generating 17_monthly_return_heatmap.png...")
    bt_df = pd.read_csv('pca_backtest_results.csv', index_col='Date', parse_dates=True)
    monthly_ret = bt_df['Strategy_Return'].resample('ME').apply(lambda x: (1 + x).prod() - 1)
    monthly_ret_df = pd.DataFrame({'Return': monthly_ret})
    monthly_ret_df['Year'] = monthly_ret_df.index.year
    monthly_ret_df['Month'] = monthly_ret_df.index.strftime('%b')
    pivot_df = monthly_ret_df.pivot(index='Year', columns='Month', values='Return')
    month_order = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    # Filter only columns that exist
    month_order = [m for m in month_order if m in pivot_df.columns]
    pivot_df = pivot_df[month_order]
    
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    sns.heatmap(pivot_df, annot=True, cmap='RdYlGn', fmt='.1%', center=0, cbar_kws={'format': mtick.PercentFormatter(1.0)}, ax=ax)
    ax.set_title("17. Strategy Monthly Return Heatmap", fontsize=16, fontweight='bold')
    ax.set_ylabel("")
    ax.set_xlabel("")
    plt.tight_layout()
    plt.savefig('plots/17_monthly_return_heatmap.png')
    plt.close()

print("All plots generated successfully in 'plots' directory.")
