
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-h4x6.onrender.com/api/', 
  timeout: 10000, 
});

export default axiosInstance;
