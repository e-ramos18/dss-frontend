import { getItem, setItem } from "../utils";
import api from "./api";
import { APIResponse } from "../types";

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

export const getCurrentUser = async (): Promise<APIResponse> => {
  try {
    const token = getItem("token");
    const res = await api.get("/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return {
      data: res.data,
      error: "",
    };
  } catch (error) {
    return {
      data: null,
      // @ts-ignore
      error: error.response.data.error.message,
    };
  }
};
