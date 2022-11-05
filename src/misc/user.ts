import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "../types";
import { getItem } from "../utils";
import api from "./api";

// Generates pending, fulfilled and rejected action types
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const token = getItem("token");
  const res = await api.get("/users", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return res.data;
});

export const addUser = createAsyncThunk("user/addUser", async (body: IUser) => {
  const token = getItem("token");
  const res = await api.post("/users", body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return res.data;
});

export const editUser = createAsyncThunk(
  "user/editUser",
  async (body: IUser) => {
    const token = getItem("token");
    const res = await api.patch(`/users/${body.id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string) => {
    const token = getItem("token");
    const res = await api.delete(`/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);
