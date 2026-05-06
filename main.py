import logging
import pandas as pd
import uvicorn
from src.data.ingestion import DataPipeline
from src.math.pca import PCAModel
from src.features.regimes import MarketRegimeDetector

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("MASTER-ORCHESTRATOR")

TICKERS = {
    '^GSPC': 'S&P 500',
    'EURUSD=X': 'EUR/USD',
    'JPY=X': 'USD/JPY',
    'GBPUSD=X': 'GBP/USD',
    'CHF=X': 'USD/CHF',
    'CAD=X': 'USD/CAD',
    'AUDUSD=X': 'AUD/USD',
    'GC=F': 'Gold',
    'CL=F': 'Crude Oil',
    '^TNX': '10Y Yield'
}

def run_pipeline():
    logger.info("=== Starting PhD-Level Quantitative Pipeline ===")
    
    # 1. Data Ingestion & ADF Proofs
    pipeline = DataPipeline(TICKERS)
    pipeline.fetch("2020-01-01", "2024-01-01")
    pipeline.clean_and_transform()
    proofs = pipeline.prove_stationarity()
    
    # 2. Rolling Regime Detection
    detector = MarketRegimeDetector(window_size=60)
    regimes_df, transition_matrix = detector.run_rolling(pipeline.log_returns)
    
    # Final Full PCA for Loadings (Current State)
    final_model = PCAModel().fit(pipeline.log_returns.tail(60))
    loadings = pd.DataFrame(
        final_model.eigenvectors[:, :3], 
        index=pipeline.log_returns.columns, 
        columns=['PC1', 'PC2', 'PC3']
    )
    
    # 3. Artifact Export
    output_path = "pca_rolling_regimes.csv"
    proofs_path = "adf_proofs.json"
    matrix_path = "transition_matrix.json"
    loadings_path = "pca_loadings.json"
    
    regimes_df.to_csv(output_path)
    pipeline.save_artifacts(output_path.replace("rolling_regimes", "ready_dataset"), proofs_path, proofs)
    
    # Save Matrix and Loadings
    import json
    with open(matrix_path, 'w') as f:
        json.dump(transition_matrix.to_dict(), f, indent=4)
    with open(loadings_path, 'w') as f:
        json.dump(loadings.to_dict(), f, indent=4)

    # Export Variance Ratios
    with open("pca_stats.json", "w") as f:
        json.dump({
            "PC1_variance": float(final_model.explained_variance_ratio[0]),
            "PC2_variance": float(final_model.explained_variance_ratio[1]),
            "PC3_variance": float(final_model.explained_variance_ratio[2])
        }, f, indent=4)

    # 4. Phase 5: Academic Historical Simulation
    from src.features.academic_backtester import PCABacktestSimulator
    backtester = PCABacktestSimulator("pca_rolling_regimes.csv", "pca_ready_dataset.csv")
    bt_results = backtester.run()
    bt_results.to_csv("pca_backtest_results.csv")
    with open("pca_backtest_metrics.json", "w") as f:
        json.dump(backtester.get_metrics(), f, indent=4)
    logger.info(f"Academic backtest artifacts exported.")

    
    logger.info("=== Pipeline Execution Complete ===")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--serve":
        from src.api.main import create_app
        app = create_app("pca_rolling_regimes.csv")
        uvicorn.run(app, host="127.0.0.1", port=8080)
    else:
        run_pipeline()
