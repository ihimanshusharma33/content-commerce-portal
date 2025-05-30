import axios from "axios";
import { clearAuth } from "../services/authService";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://amplifilearn.com/api/public/api", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add common headers (e.g., Authorization token)
    const token = localStorage.getItem("authToken"); // Replace with your token logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("Authentication error detected");

      // Clear authentication data
      clearAuth();

      // Redirect to sign-in page
      window.location.href = "/signin";
    }

    // Handle errors globally
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("API Error:", error.response.data.message || error.response.statusText);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.message);
    } else {
      // Something else caused the error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;