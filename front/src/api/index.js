import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const getRealState = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/real-state`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    throw error;
  }
};