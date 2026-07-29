/**
 * axios.ts — Pre-configured Axios Instance
 *
 * Creates and exports a reusable Axios instance for all API communication.
 * - Reads the backend URL from the VITE_API_BASE_URL environment variable.
 * - Sets a 10-second timeout for all requests.
 * - Defaults Content-Type to application/json.
 *
 * Usage:
 *   import api from '@/api/axios';
 *   // then use api.get(), api.post(), etc. in service files.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
