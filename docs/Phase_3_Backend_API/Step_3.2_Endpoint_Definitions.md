# Step 3.2: REST API Endpoint Specifications

This document serves as the formal specification for the PCA Market State Detector REST API (v1.2.0).

## 1. Global API Configuration
- **Base URL**: `http://127.0.0.1:8000`
- **Content-Type**: `application/json`
- **CORS**: Enabled (`Allow-Origin: *`)

## 2. Endpoint Catalog

| Endpoint | Method | Response Model | Description |
| :--- | :---: | :--- | :--- |
| `/` | `GET` | `dict` | Health check and versioning info. |
| `/api/v1/regimes/current` | `GET` | `RegimeResponse` | Fetches the latest daily market state. |
| `/api/v1/regimes/historical` | `GET` | `List[RegimeResponse]` | Fetches time-series data with optional filtering. |
| `/api/v1/pca/stats` | `GET` | `ComponentStatsResponse` | Fetches descriptive factor statistics. |

## 3. Query Parameter Specifications

### `GET /api/v1/regimes/historical`
Used to populate historical charts and regime timelines.

| Parameter | Type | Required | Default | Constraint |
| :--- | :--- | :---: | :---: | :--- |
| `start_date` | `string` | No | None | `YYYY-MM-DD` |
| `end_date` | `string` | No | None | `YYYY-MM-DD` |

## 4. Example Payloads

### Current Regime
`GET /api/v1/regimes/current`
```json
{
  "Date": "2023-12-29",
  "PC1": 0.2541,
  "PC2": -0.8421,
  "PC3": 1.121,
  "Regime": "Range Market"
}
```

### Component Statistics
`GET /api/v1/pca/stats`
```json
{
  "PC1": { "min": -6.18, "max": 7.17, "mean": 0.05, "std": 1.92 },
  "PC2": { "min": -6.48, "max": 5.52, "mean": -0.01, "std": 1.28 },
  "PC3": { "min": -4.32, "max": 3.39, "mean": -0.01, "std": 1.07 }
}
```

## 5. Error Response Structure
All errors (4xx/5xx) follow a consistent structure:
```json
{
  "error": "Error Type Description",
  "message": "User-friendly error message",
  "detail": "Optional technical traceback (debug only)"
}
```
