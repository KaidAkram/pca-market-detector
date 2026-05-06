import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

class PCAModel:
    """
    Modular Principal Component Analysis Engine.
    Strictly follows from-scratch implementation using eigendecomposition.
    """
    
    def __init__(self, n_components: int = None):
        self.n_components = n_components
        self.eigenvalues = None
        self.eigenvectors = None
        self.mean = None
        self.std = None

    def fit(self, X: pd.DataFrame) -> 'PCAModel':
        """
        Fits the PCA model to the input data.
        Workflow: Standardize -> Covariance -> Eigendecomposition -> Sign Alignment.
        """
        n, p = X.shape
        self.mean = X.mean()
        self.std = X.std(ddof=1).replace(0, 1e-9)
        
        # 1. Standardization
        Z = (X - self.mean) / self.std
        
        # 2. Covariance Matrix
        V = Z.values
        cov = (V.T @ V) / (n - 1)
        
        # 3. Eigendecomposition
        eigenvalues, eigenvectors = np.linalg.eigh(cov)
        
        # 4. Sorting
        idx = np.argsort(eigenvalues)[::-1]
        self.eigenvalues = eigenvalues[idx]
        self.eigenvectors = eigenvectors[:, idx]
        
        # 5. Sign Determinism
        for j in range(self.eigenvectors.shape[1]):
            max_abs_idx = np.argmax(np.abs(self.eigenvectors[:, j]))
            sign = np.sign(self.eigenvectors[max_abs_idx, j])
            self.eigenvectors[:, j] *= sign
            
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        """Projects input data onto the principal axes."""
        Z = (X - self.mean) / self.std
        scores = Z.values @ self.eigenvectors
        
        cols = [f"PC{i+1}" for i in range(self.eigenvectors.shape[1])]
        return pd.DataFrame(scores, index=X.index, columns=cols)

    @property
    def explained_variance_ratio(self) -> np.ndarray:
        if self.eigenvalues is None:
            return None
        return self.eigenvalues / np.sum(self.eigenvalues)

    @property
    def cumulative_explained_variance(self) -> np.ndarray:
        if self.eigenvalues is None:
            return None
        return np.cumsum(self.explained_variance_ratio)

    @property
    def spectral_entropy(self) -> float:
        """
        PhD Metric: Measures the 'disorder' or complexity of the market.
        Derived from the normalized Shannon Entropy of the eigenvalue distribution.
        """
        if self.eigenvalues is None:
            return None
        ev = self.explained_variance_ratio
        # Filter out near-zero eigenvalues to avoid log(0)
        ev = ev[ev > 1e-10]
        return -np.sum(ev * np.log(ev)) / np.log(len(ev))

    @property
    def condition_number(self) -> float:
        """
        PhD Metric: The ratio of the largest to smallest eigenvalue.
        Indicates the stability of the PCA structure.
        """
        if self.eigenvalues is None:
            return None
        return self.eigenvalues[0] / (self.eigenvalues[-1] + 1e-12)
