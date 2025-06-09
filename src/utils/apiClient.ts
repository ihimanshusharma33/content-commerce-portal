import axios from "axios";
import { clearAuth } from "../services/authService";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://amplifilearn.com/api/public/api", // Production URL
  headers: {
    'Accept': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
<<<<<<< HEAD
    const token = localStorage.getItem("authToken"); // Replace with your token logic
=======
    // Get the token from localStorage for each request
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add it to the Authorization header
>>>>>>> c1199260da327c686b11bbf9d425841940d41811
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For multipart/form-data requests, let the browser set the Content-Type with boundary
    if (config.data instanceof FormData) {
      // Remove Content-Type header to let browser set it with proper boundary
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
<<<<<<< HEAD
=======
    // Handle request errors
    console.error('Request interceptor error:', error);
>>>>>>> c1199260da327c686b11bbf9d425841940d41811
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("Authentication error detected");

      clearAuth();
      navigate("/signin");
    }

    // Handle errors globally
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("API Error:", error.response.data?.message || error.response.statusText);
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

/**
 * Helper function to handle PUT requests with FormData (since many servers don't handle FormData with PUT properly)
 * 
 * @param url - The API endpoint URL
 * @param data - FormData object or plain object to be converted to FormData
 * @returns Promise with the response
 */
apiClient.putFormData = (url: string, data: FormData | Record<string, any>): Promise<any> => {
  // Ensure we're working with FormData
  const formData = data instanceof FormData 
    ? data 
    : Object.entries(data).reduce((fd, [key, value]) => {
        if (value !== undefined) {
          fd.append(key, value instanceof Blob ? value : String(value));
        }
        return fd;
      }, new FormData());
  
  // Use POST with X-HTTP-Method-Override header
  return apiClient.post(url, formData, {
    headers: {
      'X-HTTP-Method-Override': 'PUT',
    }
  });
};

export default apiClient;