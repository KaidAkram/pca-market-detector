# Step 4.1: Frontend UI Architecture & State Synchronization

This document details the frontend technology stack and the architectural patterns used to synchronize our React-based interface with the PCA Backend API.

## 1. Frontend Technology Stack

| Technology | Purpose | Justification |
| :--- | :--- | :--- |
| **React (Vite)** | Core Library | Provides high-performance component-based rendering and hot-module replacement for rapid UI iteration. |
| **Axios** | API Client | Robust HTTP client for handling asynchronous requests, interceptors, and automated JSON transformation. |
| **Recharts** | Data Visualization | D3-based React library optimized for high-density financial time-series and scatter visualizations. |
| **Tailwind CSS** | Styling | utility-first CSS framework enabling consistent "Institutional Dark Mode" aesthetics without CSS bloat. |
| **Lucide React** | Iconography | Lightweight, high-precision SVG icons for status indicators and UI actions. |

## 2. Asynchronous State Flow

The dashboard utilizes a **Top-Down Orchestration** pattern within `DashboardLayout.jsx`. 

### The Lifecycle of a Data Sync:
1. **Mounting**: On component mount, a `useEffect` hook triggers the main `fetchData` function.
2. **Concurrent Fetching**: We utilize `Promise.all` to fetch `currentRegime`, `historicalRegimes`, and `pcaStats` simultaneously, minimizing the total blocking time for the UI.
3. **State Transition**:
   - `loading`: Displays a high-fidelity loading spinner during network transit.
   - `error`: Displays a robust recovery screen if the FastAPI server is unreachable.
   - `success`: Propagates data to specialized visualization components.
4. **Propagations**: Data is passed down as immutable props to `MacroScatterPlot`, `HistoricalTimeline`, and `RegimeAlertCard`.

## 3. Aesthetic Design System: "Institutional Dark Mode"

To match the standard of professional trading terminals (e.g., Bloomberg, Refinitiv), we utilize the following design tokens:
- **Palette**: Deep slate/charcoal backgrounds (#020617) to minimize eye strain.
- **Glassmorphism**: Subtle backdrop blurs and semi-transparent borders for regime alert cards.
- **Factor Color Coding**:
  - **Crisis**: Crimson Red (High Urgency)
  - **Trend**: Emerald Green (Bullish Growth)
  - **Liquidity**: Cyan Blue (Monetary Flow)
  - **Inflation**: Amber Gold (Supply Pressure)
  - **Range**: Slate Grey (Market Neutral)
