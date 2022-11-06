import { createAsyncThunk } from "@reduxjs/toolkit";
import { IMovie } from "../types";
import { getItem } from "../utils";
import api from "./api";

// Generates pending, fulfilled and rejected action types
export const fetchMovies = createAsyncThunk("movie/fetchMovies", async () => {
  const token = getItem("token");
  const res = await api.get("/movies", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return res.data;
});

export const fetchMovie = createAsyncThunk(
  "movie/fetchMovie",
  async (id: string) => {
    const token = getItem("token");
    const res = await api.get(`/movies/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);

export const addMovie = createAsyncThunk(
  "movie/addMovie",
  async (body: IMovie) => {
    const token = getItem("token");
    const res = await api.post("/movies", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);

export const editMovie = createAsyncThunk(
  "movie/editMovie",
  async (body: IMovie) => {
    const token = getItem("token");
    const res = await api.put(`/movies/${body.id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);

export const deleteMovie = createAsyncThunk(
  "movie/deleteMovie",
  async (id: string) => {
    const token = getItem("token");
    const res = await api.delete(`/movies/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);
