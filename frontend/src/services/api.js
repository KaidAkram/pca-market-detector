import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches the absolute latest market regime and factor scores.
 */
export const getCurrentRegime = async () => {
  try {
    const response = await apiClient.get('/api/v1/regimes/current');
    return response.data;
  } catch (error) {
    console.error('Error fetching current regime:', error);
    throw error;
  }
};

/**
 * Fetches the full historical time-series of PCA scores and regimes.
 * @param {string} startDate - Optional ISO date string (YYYY-MM-DD)
 * @param {string} endDate - Optional ISO date string (YYYY-MM-DD)
 */
export const getHistoricalRegimes = async (startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await apiClient.get('/api/v1/regimes/historical', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical regimes:', error);
    throw error;
  }
};

/**
 * Fetches descriptive statistics (Min, Max, Mean, SD) for PC1, PC2, and PC3.
 */
export const getPcaStats = async () => {
  try {
    const response = await apiClient.get('/api/v1/pca/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching PCA stats:', error);
    throw error;
  }
};

/**
 * Fetches the mathematical stationarity proofs (ADF tests) for all assets.
 */
export const getMathProofs = async () => {
  try {
    const response = await apiClient.get('/api/v1/math/proofs');
    return response.data;
  } catch (error) {
    console.error('Error fetching math proofs:', error);
    throw error;
  }
};

/**
 * Fetches the Markovian regime transition matrix.
 */
export const getTransitionMatrix = async () => {
  try {
    const response = await apiClient.get('/api/v1/math/transition-matrix');
    return response.data;
  } catch (error) {
    console.error('Error fetching transition matrix:', error);
    throw error;
  }
};

/**
 * Fetches the current PCA loadings (asset weights per PC).
 */
export const getLoadings = async () => {
  try {
    const response = await apiClient.get('/api/v1/pca/loadings');
    return response.data;
  } catch (error) {
    console.error('Error fetching PCA loadings:', error);
    throw error;
  }
};

/**
 * Fetches backtest equity curve and performance metrics.
 */
export const getBacktest = async () => {
  try {
    const response = await apiClient.get('/api/v1/backtest');
    return response.data;
  } catch (error) {
    console.error('Error fetching backtest:', error);
    throw error;
  }
};

export default {
  getCurrentRegime,
  getHistoricalRegimes,
  getPcaStats,
  getMathProofs,
  getTransitionMatrix,
  getLoadings,
  getBacktest,
};
