import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addReview, editReview, fetchReviews } from "../../misc/review";
import { IReview } from "../../types";

type InitialState = {
  reviews: IReview[];
  loading: boolean;
  error: string;
};
const initialState: InitialState = {
  reviews: [],
  loading: false,
  error: "",
};

const reviewSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch reviews
    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchReviews.fulfilled,
      (state, action: PayloadAction<IReview[]>) => {
        state.loading = false;
        state.reviews = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchReviews.rejected, (state, action) => {
      state.loading = false;
      state.reviews = [];
      state.error = action.error.message || "Something went wrong";
    });

    // Add a movie
    builder.addCase(addReview.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addReview.fulfilled,
      (state, action: PayloadAction<IReview>) => {
        state.loading = false;
        state.reviews = state.reviews.concat(action.payload);
        state.error = "";
      }
    );
    builder.addCase(addReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });

    // Edit a movie
    builder.addCase(editReview.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      editReview.fulfilled,
      (state, action: PayloadAction<IReview>) => {
        state.loading = false;
        const newReviews: IReview[] = [...state.reviews];
        //finding index of the movie
        const index: number = newReviews.findIndex(
          (m) => m.id === action.payload.id
        );
        newReviews[index] = action.payload;
        state.reviews = newReviews;
        state.error = "";
      }
    );
    builder.addCase(editReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });

    // Delete a movie
  },
});

export default reviewSlice.reducer;
