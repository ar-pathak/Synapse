// utils/auth.js
import axios from "axios";
import { API_URL } from "./constants";
export const isAuthenticatedUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/auth/check-auth`, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};
