# Step 1.2: Solving the Sign Ambiguity (Phase Alignment)

This document addresses a critical challenge in numerical linear algebra: the arbitrary sign inversion of eigenvectors, and our deterministic solution to ensure "temporal continuity" in factor tracking.

## 1. The Mathematical Problem

The eigenvalue equation $\Sigma v = \lambda v$ is invariant to the sign of $v$. If $v$ is an eigenvector, then $-v$ is also an eigenvector with the same eigenvalue:

$$\Sigma (-v) = -\Sigma v = -(\lambda v) = \lambda (-v)$$

Numerical solvers (like LAPACK) may return $v$ or $-v$ depending on microscopic variations in the input or even the CPU instruction set used. 

## 2. The Impact on Rolling Analysis

In Phase 2, we perform PCA on rolling 60-day windows. If the solver flips the sign of PC1 between day $T$ and day $T+1$ (e.g., from +2.5 to -2.5), a regime detector would perceive a catastrophic reversal when in fact nothing has changed in the underlying correlations. 

**This would lead to:**
- False positive regime changes.
- "Chattering" signals in the frontend UI.
- Inaccurate historical charting.

## 3. The Deterministic Resolving Algorithm

To solve this, we implement a **Coordinate-Dominance Alignment** rule. For each eigenvector $v_j$:

1. **Locate the Dominant Asset**: Find the asset $k$ with the maximum absolute loading in that eigenvector: $k = \text{argmax}_i |v_{ij}|$.
2. **Inspect the Sign**: Check the sign of the loading $v_{kj}$.
3. **Enforce Positivity**: If $v_{kj} < 0$, multiply the entire eigenvector $v_j$ by -1.

### Example:
If PC1 is primarily driven by the S&P 500 (`^GSPC`), this rule ensures that the S&P 500 always has a **positive loading** on PC1. Thus, PC1 consistently represents "Bullish Equity Sentiment" rather than flipping between Bullish and Bearish directions arbitrarily.

## 4. Implementation in `phase_1_math_engine.py`

```python
for j in range(sorted_eigenvectors.shape[1]):
    # Identify the coordinate of maximum influence
    max_abs_idx = np.argmax(np.abs(sorted_eigenvectors[:, j]))
    # Force the dominant asset to have a positive contribution
    sign = np.sign(sorted_eigenvectors[max_abs_idx, j])
    sorted_eigenvectors[:, j] *= sign
```

This ensures that our PCA factors are physically meaningful and temporally stable, enabling robust regime classification.
