import { createAsyncThunk } from "@reduxjs/toolkit";
import { IReview } from "../types";
import { getItem } from "../utils";
import api from "./api";

// Generates pending, fulfilled and rejected action types
export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async () => {
    const token = getItem("token");
    const res = await api.get("/reviews", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);

export const addReview = createAsyncThunk(
  "review/addReview",
  async (body: IReview) => {
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

export const editReview = createAsyncThunk(
  "review/editReview",
  async (body: IReview) => {
    delete body.movie;
    delete body.user;
    const token = getItem("token");
    const res = await api.patch(`/reviews/${body.id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id: string) => {
    const token = getItem("token");
    const res = await api.delete(`/reviews/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
);
