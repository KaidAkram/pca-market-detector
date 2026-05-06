# Step 1.1: Mathematical Proof of PCA Eigendecomposition

This document provides a research-paper grade derivation of the Principal Component Analysis (PCA) workflow implemented in `phase_1_math_engine.py`. We utilize the **Covariance Method** for factor extraction.

## 1. The Optimization Problem

The goal of PCA is to find a set of orthonormal vectors $\{v_1, v_2, \dots, v_p\}$ (the principal components) such that the variance of the data projected onto these vectors is maximized.

For the first component $v_1$, we solve:
$$\max_{v_1} v_1^T \Sigma v_1 \quad \text{subject to} \quad v_1^T v_1 = 1$$

Where $\Sigma$ is the sample covariance matrix. Using Lagrange Multipliers, this reduces to the eigenvalue problem:
$$\Sigma v = \lambda v$$

## 2. Sample Covariance Derivation

Given a standardized data matrix $Z$ (where each column has mean $\mu=0$ and standard deviation $\sigma=1$), the sample covariance matrix $\Sigma$ is defined as:

$$\Sigma = \frac{1}{n-1} \sum_{i=1}^{n} (z_i - \bar{z})(z_i - \bar{z})^T$$

Since $\bar{z} = 0$ due to standardization, this simplifies in matrix notation to:

$$\Sigma = \frac{Z^T Z}{n-1}$$

This is the exact formula implemented in our vectorized NumPy code:
```python
cov_vals = (Z.T @ Z) / (n - 1)
```

## 3. Eigendecomposition vs. SVD

In this engine, we use `np.linalg.eigh`. While Singular Value Decomposition (SVD) on $Z$ is also common ($Z = U S V^T$), we chose the Eigendecomposition of the covariance matrix because:
1. **Computational Clarity**: It directly operates on the correlation structure (since $Z$ is standardized).
2. **Symmetry**: The covariance matrix is real and symmetric by construction, making `eigh` (optimized for Hermitian/Symmetric matrices) faster and numerically more stable than a general SVD.
3. **Interpretability**: The eigenvalues $\lambda_i$ directly represent the variance captured by each component, and $\sum \lambda_i = P$ (the number of assets).

## 4. The Necessity of Standardization (Z-Score)

Without standardization, PCA would be biased by the **absolute volatility** of assets. For example, if the S&P 500 has a daily variance 10x larger than the EUR/USD, the first component would be almost entirely composed of the S&P 500. 

By forcing every asset to have $\sigma=1$, we ensure that PCA extracts the **correlation structure** rather than a volatility-weighted average. Consequently, our covariance matrix $\Sigma$ is mathematically identical to the **Pearson Correlation Matrix**.
