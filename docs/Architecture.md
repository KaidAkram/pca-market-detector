# System Architecture: PhD-Level PCA Market Engine

This document outlines the modular design, mathematical foundations, and statistical rigor of the upgraded PCA Market State Detector.

## 1. Modular Python Architecture

The backend has been refactored from a procedural script-based workflow into a highly decoupled, Object-Oriented Python package.

### Submodule Organization
- **`src.data`**: Handles high-fidelity ingestion via `yfinance`. Implements advanced cleaning and **ADF Stationarity Proofs**.
- **`src.math`**: The core `PCAModel` class. Encapsulates the eigendecomposition logic, sign-determinism alignment, and stability metrics (Condition Number).
- **`src.features`**: The `MarketRegimeDetector`. Orchestrates the rolling window execution and hierarchical classification.
- **`src.api`**: FastAPI implementation with modular routers, Pydantic v2 schemas, and asynchronous lifecycle management.

## 2. Statistical Rigor: Stationarity Proofs

In quantitative finance, applying PCA to non-stationary price series leads to "Spurious Correlations." 

### Augmented Dickey-Fuller (ADF) Integration
Our pipeline programmatically verifies the stationarity of every asset return series using the ADF test. 
- **Null Hypothesis (H0)**: The series has a unit root (is non-stationary).
- **Verification**: The engine only proceeds if the p-value for every asset is $< 0.05$, rejecting H0 and proving mathematical stationarity.

## 3. Stability Tracking: The Condition Number

To detect structural breaks in the market's covariance matrix, we track the **Condition Number** of the eigenvalues:
$$\kappa = \frac{\lambda_{\max}}{\lambda_{\min}}$$

- **Low $\kappa$**: Indicates a balanced, stable market structure where risk is distributed across multiple factors.
- **High $\kappa$**: Indicates "Collinearity" or "Variance Concentration," often seen during systemic crashes where all assets begin to move in lockstep (PC1 dominance).

## 4. Advanced Spectral Metrics

The pipeline now integrates high-order spectral metrics for deeper structural insight:
- **Spectral Entropy ($H_{spec}$)**: Derived from the Shannon Entropy of normalized eigenvalues. Measures the "complexity" of the market basis.
- **Markov Transition Matrix**: Tracks the empirical probability of transitions between regimes (e.g., $P(\text{Crisis} | \text{Range Market})$).
- **Spectral Loadings**: High-fidelity mapping of asset-level weights to the latent principal axes.

## 5. Frontend Infrastructure

The interface is built on a **Bento Grid** architecture using:
- **React + Framer Motion**: For staggered, high-fidelity UI animations.
- **React Three Fiber**: A 3D WebGL projection of the 3-dimensional factor space (PC1, PC2, PC3).
- **Glassmorphism**: Utilizing Tailwind CSS for institutional-grade aesthetic transparency and blur effects.
