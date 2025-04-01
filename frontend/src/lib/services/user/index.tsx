import { loginSuccess } from "@/store/reducers/authSlice";
import axios from "axios";

export async function fetchUserProfile(user_id: any, dispatch: any) {
  try {
    const response = await axios.get(`/api/v1/user/${user_id}`);
    dispatch(loginSuccess(response.data.data));
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
