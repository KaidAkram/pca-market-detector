import pandas as pd
import numpy as np
from src.math.pca import PCAModel
from typing import List, Dict, Any

class MarketRegimeDetector:
    """
    Rolling window execution engine and macroeconomic regime classifier.
    Tracks mathematical stability (Condition Number) over time.
    """
    
    def __init__(self, window_size: int = 60):
        self.window_size = window_size

    def classify(self, pc1: float, pc2: float, pc3: float) -> str:
        """Hierarchical classification logic."""
        if pc1 < -2.0:
            return "Crisis"
        elif pc1 > 2.0:
            return "Trend Market"
        elif pc3 > 1.5:
            return "Inflation Shock"
        elif pc2 < -1.5:
            return "Liquidity Expansion"
        else:
            return "Range Market"

    def run_rolling(self, X: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Executes rolling PCA and calculates the Markovian Transition Matrix."""
        n_samples = len(X)
        dates = X.index
        results = []
        
        # 1. Rolling Execution
        for t in range(self.window_size - 1, n_samples):
            window_slice = X.iloc[t - self.window_size + 1 : t + 1]
            model = PCAModel().fit(window_slice)
            
            current_row = X.iloc[[t]]
            scores = model.transform(current_row).iloc[0]
            
            pc1, pc2, pc3 = scores['PC1'], scores['PC2'], scores['PC3']
            cond_num = model.condition_number
            entropy = model.spectral_entropy
            regime = self.classify(pc1, pc2, pc3)
            
            results.append({
                "Date": dates[t],
                "PC1": pc1, "PC2": pc2, "PC3": pc3,
                "ConditionNumber": cond_num,
                "SpectralEntropy": entropy,
                "Regime": regime
            })
            
        df = pd.DataFrame(results).set_index("Date")
        
        # 2. Transition Matrix Calculation (Markov Chain)
        regimes = df['Regime'].values
        unique_regimes = sorted(list(set(regimes)))
        matrix = pd.DataFrame(0.0, index=unique_regimes, columns=unique_regimes)
        
        for i in range(len(regimes) - 1):
            matrix.loc[regimes[i], regimes[i+1]] += 1
            
        # Normalize to probabilities
        matrix = matrix.div(matrix.sum(axis=1), axis=0).fillna(0)
        
        return df, matrix
