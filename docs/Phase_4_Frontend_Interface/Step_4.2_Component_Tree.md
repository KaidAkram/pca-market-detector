# Step 4.2: Component Tree & Responsibility Mapping

This document provides a visual and structural hierarchy of the React components comprising the PCA Market Detector dashboard.

## 1. Visual Component Hierarchy

- `App` (Root Entry)
  - `DashboardLayout` (Main Orchestrator & State Manager)
    - `Header` (Branding & API Connection Status)
    - `RegimeAlertCard` (Hero Section: Current Market State)
    - `HistoricalTimeline` (Time-Series Visualization of PC1, PC2, PC3)
    - `MacroScatterPlot` (Clustering Visualization: PC1 vs PC2)
    - `ArchitectureNote` (Contextual Technical Documentation)

## 2. Component Responsibility Mapping

### `DashboardLayout.jsx`
- **Responsibility**: Fetching data from `api.js`, managing `loading`/`error` states, and orchestrating the responsive grid layout.
- **State**: `currentRegime` (obj), `historicalData` (array), `loading` (bool), `error` (string).

### `RegimeAlertCard.jsx`
- **Responsibility**: High-fidelity display of the current market regime.
- **Key Props**:
  - `regime`: The string label (e.g., "Crisis").
  - `date`: The timestamp of the last observation.

### `MacroScatterPlot.jsx`
- **Responsibility**: Visualizing the clustering of historical regimes in factor space.
- **Visualization**: Recharts `ScatterChart`.
- **Logic**: Maps PC1 to X-Axis and PC2 to Y-Axis. Colors each point based on the regime classification.

### `HistoricalTimeline.jsx`
- **Responsibility**: Tracking the evolution of the first three principal components.
- **Visualization**: Recharts `LineChart`.
- **Logic**: Displays PC1, PC2, and PC3 as synchronized lines with a shared temporal X-axis.

## 3. Service Layer Integration

The components interact with the backend exclusively through the `src/services/api.js` abstraction:
- **`getCurrentRegime()`**: Used by `DashboardLayout` to populate the hero card.
- **`getHistoricalRegimes()`**: Powers both the Scatter Plot and the Timeline.
- **`getPcaStats()`**: Provides metadata for future charting axis-tuning.
