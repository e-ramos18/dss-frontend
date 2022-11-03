import { createAsyncThunk } from "@reduxjs/toolkit";
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
