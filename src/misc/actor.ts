import { createAsyncThunk } from "@reduxjs/toolkit";
import { IActor, IMovie } from "../types";
import { getItem } from "../utils";
import api from "./api";

// Generates pending, fulfilled and rejected action types
export const fetchActors = createAsyncThunk("actor/fetchActors", async () => {
  const res = await api.get("/actors");
  return res.data;
});

export const fetchActor = createAsyncThunk(
  "actor/fetchActor",
  async (id: string) => {
    const res = await api.get(`/actors/${id}`);
    return res.data;
  }
);

export const addActor = createAsyncThunk(
  "actor/addActor",
  async (body: IActor) => {
    const token = getItem("token");
    const res = await api.post("/actors", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);

export const editActor = createAsyncThunk(
  "actor/editMovie",
  async (body: IActor) => {
    const token = getItem("token");
    const res = await api.put(`/actors/${body.id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);

export const deleteActor = createAsyncThunk(
  "actor/deleteActor",
  async (id: string) => {
    const token = getItem("token");
    const res = await api.delete(`/actors/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);
