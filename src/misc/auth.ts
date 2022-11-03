import { setItem } from "../utils";
import api from "./api";

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<string> => {
  try {
    await api.post("/users/signup", {
      name,
      email,
      password,
      role: "User",
    });
    return "";
  } catch (error) {
    // @ts-ignore
    return error.response.data.error.message;
  }
};

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const res = await api.post("/users/login", {
      email,
      password,
    });
    setItem("token", res.data.token);
    return "";
  } catch (error) {
    // @ts-ignore
    return error.response.data.error.message;
  }
};
