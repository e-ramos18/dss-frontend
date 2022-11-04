import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addMovie, fetchMovies } from "../../misc/movie";
import { IMovie } from "../../types";

type InitialState = {
  movies: IMovie[];
  loading: boolean;
  error: string;
};
const initialState: InitialState = {
  movies: [],
  loading: false,
  error: "",
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchMovies.fulfilled,
      (state, action: PayloadAction<IMovie[]>) => {
        state.loading = false;
        state.movies = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchMovies.rejected, (state, action) => {
      state.loading = false;
      state.movies = [];
      state.error = action.error.message || "Something went wrong";
    });

    builder.addCase(addMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addMovie.fulfilled,
      (state, action: PayloadAction<IMovie[]>) => {
        state.loading = false;
        state.movies = state.movies.concat(action.payload);
        state.error = "";
      }
    );
    builder.addCase(addMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default movieSlice.reducer;
