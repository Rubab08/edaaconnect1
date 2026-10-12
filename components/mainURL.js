import axios from 'axios';
const API_URL = 'http://192.168.5.196:3000/api';


export const getRequest = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getRequest for ${endpoint}:`, error);
    throw error;
  }
};
export const postRequest = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response; 
  } catch (error) {
    console.error(`Error in postRequest for ${endpoint}:`, error);
    throw error;
  }
};



export default API_URL;

