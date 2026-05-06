# Step 3.1: Backend API Architecture & Schema Definitions

This document details the production-grade architecture of the PCA Market State Detector API, built on the FastAPI framework.

## 1. Architectural Justification: FastAPI

We selected **FastAPI** over alternatives like Flask or Django for three specific quantitative reasons:
1. **Asynchronous I/O**: Essential for handling concurrent requests from the React frontend without blocking the Python GIL.
2. **Type-Safety (Pydantic)**: Ensures that PC scores and dates are strictly validated before being serialized to JSON, preventing frontend "type chattering."
3. **OpenAPI Native**: Automatically generates Swagger documentation, providing a "living contract" between the quant backend and the frontend developers.

## 2. In-Memory Database Pattern

The API utilizes a **Lifespan Context Manager** to load the `pca_rolling_regimes.csv` artifact into a Pandas DataFrame once during startup.
- **Latency**: Sub-millisecond lookups ($O(1)$ row access).
- **Integrity**: The dataset is immutable during the server's lifecycle, ensuring consistency for all connected clients.
- **Validation**: The startup sequence verifies column presence and data types, failing fast if the artifact is corrupted.

## 3. Pydantic Response Schemas (The Data Contract)

We utilize Pydantic v2 for strict schema enforcement. Every API response is guaranteed to match the following structures:

### `RegimeResponse`
Represents a single day's market state and factor coordinates.

| Field | Type | Description |
| :--- | :--- | :--- |
| `Date` | `string` | ISO 8601 formatted date (`YYYY-MM-DD`). |
| `PC1` | `float` | Systematic Risk Sentiment score. |
| `PC2` | `float` | US Dollar / Liquidity score. |
| `PC3` | `float` | Commodity / Inflation score. |
| `Regime` | `string` | The classified market state label. |

### `ComponentStatsResponse`
Provides global bounds (min, max, mean, std) for the PCA factors. This allows the frontend charting library to set dynamic, stable axes.

## 4. Safety & Robustness Features

- **Global Exception Handler**: Intercepts all unhandled errors, logs the traceback internally, and returns a clean, non-leaking JSON error response to the client.
- **CORS Middleware**: Pre-configured to allow integration with the React.js frontend across different local ports (e.g., 3000 -> 8000).
- **Regex Date Validation**: Every date-based query parameter is validated against `^\d{4}-\d{2}-\d{2}$` to prevent injection or malformed requests.
