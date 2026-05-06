import os
import pandas as pd
import logging
from typing import List, Optional, Dict, Tuple
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field, ConfigDict

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1")

# Global data store (in-memory)
db_dataframe: Optional[pd.DataFrame] = None
adf_proofs: Optional[Dict] = None
transition_matrix: Optional[Dict] = None
pca_loadings: Optional[Dict] = None
pca_variance_info: Optional[Dict] = None
backtest_data: Optional[pd.DataFrame] = None
backtest_metrics: Optional[Dict] = None

def init_db(filepath: str, proofs_path: str = "adf_proofs.json"):
    global db_dataframe, adf_proofs, transition_matrix, pca_loadings, pca_variance_info, backtest_data, backtest_metrics
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Artifact {filepath} missing.")
    db_dataframe = pd.read_csv(filepath)
    db_dataframe['Date'] = db_dataframe['Date'].astype(str)
    
    if os.path.exists(proofs_path):
        import json
        with open(proofs_path, 'r') as f:
            adf_proofs = json.load(f)
            
    if os.path.exists("transition_matrix.json"):
        import json
        with open("transition_matrix.json", 'r') as f:
            transition_matrix = json.load(f)

    if os.path.exists("pca_loadings.json"):
        import json
        with open("pca_loadings.json", 'r') as f:
            pca_loadings = json.load(f)

    if os.path.exists("pca_stats.json"):
        import json
        with open("pca_stats.json", 'r') as f:
            pca_variance_info = json.load(f)
    else:
        pca_variance_info = None

    if os.path.exists("pca_backtest_results.csv"):
        backtest_data = pd.read_csv("pca_backtest_results.csv")
        backtest_data['Date'] = backtest_data['Date'].astype(str)
        if os.path.exists("pca_backtest_metrics.json"):
            import json
            with open("pca_backtest_metrics.json", 'r') as f:
                backtest_metrics = json.load(f)

# ==========================================
# Schemas
# ==========================================

class RegimeResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    Date: str = Field(..., alias="Date")
    PC1: float
    PC2: float
    PC3: float
    ConditionNumber: float = Field(..., alias="ConditionNumber")
    SpectralEntropy: float = Field(..., alias="SpectralEntropy")
    Regime: str

class PCStats(BaseModel):
    min: float
    max: float
    mean: float
    std: float
    variance_ratio: float

class ComponentStatsResponse(BaseModel):
    PC1: PCStats
    PC2: PCStats
    PC3: PCStats

# ==========================================
# Routes
# ==========================================

@router.get("/regimes/current", response_model=RegimeResponse)
async def get_current():
    if db_dataframe is None:
        raise HTTPException(status_code=503, detail="Database not ready.")
    return db_dataframe.iloc[-1].to_dict()

@router.get("/regimes/historical", response_model=List[RegimeResponse])
async def get_historical(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    if db_dataframe is None:
        raise HTTPException(status_code=503, detail="Database not ready.")
    
    df = db_dataframe.copy()
    if start_date:
        df = df[df['Date'] >= start_date]
    if end_date:
        df = df[df['Date'] <= end_date]
    return df.to_dict(orient="records")

@router.get("/pca/stats", response_model=ComponentStatsResponse)
async def get_stats():
    if db_dataframe is None:
        raise HTTPException(status_code=503, detail="Database not ready.")
    
    stats = {}
    for col in ['PC1', 'PC2', 'PC3']:
        series = db_dataframe[col]
        ratio = pca_variance_info.get(f"{col}_variance", 0.0) if pca_variance_info else 0.0
        stats[col] = {
            "min": float(series.min()),
            "max": float(series.max()),
            "mean": float(series.mean()),
            "std": float(series.std()),
            "variance_ratio": float(ratio)
        }
    return stats

@router.get("/math/proofs")
async def get_proofs():
    if adf_proofs is None:
        raise HTTPException(status_code=503, detail="Mathematical proofs not available.")
    return adf_proofs

@router.get("/math/transition-matrix")
async def get_transition_matrix():
    if transition_matrix is None:
        raise HTTPException(status_code=503, detail="Transition matrix not available.")
    return transition_matrix

@router.get("/pca/loadings")
async def get_loadings():
    if pca_loadings is None:
        raise HTTPException(status_code=503, detail="PCA loadings not available.")
    return pca_loadings

@router.get("/backtest")
async def get_backtest():
    if backtest_data is None:
        raise HTTPException(status_code=503, detail="Backtest results not available. Run the pipeline first.")
    equity_curve = backtest_data[["Date", "Strategy_Equity", "Benchmark_Equity", "Regime"]].to_dict(orient="records")
    return {
        "equity_curve": equity_curve,
        "metrics": backtest_metrics or {}
    }
