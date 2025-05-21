import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://amplifilearn.com/api/public/api", // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
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
  (response) => {
    // Handle successful responses
    return response.data; // Return only the data from the response
  },
  (error) => {
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