import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL; // backend API base URL

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API}/products`);  // Fetch all inventory items from the backend
    return response.data; // return actual data from the response
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // rethrow for handling in UI
  }
}


