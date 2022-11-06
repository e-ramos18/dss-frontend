import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addMovie,
  deleteMovie,
  editMovie,
  fetchMovie,
  fetchMovies,
} from "../../misc/movie";
import { IMovie } from "../../types";

type InitialState = {
  movies: IMovie[];
  movie: IMovie | null;
  loading: boolean;
  error: string;
};
const initialState: InitialState = {
  movies: [],
  movie: null,
  loading: false,
  error: "",
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch movies
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

    // Fetch a movie
    builder.addCase(fetchMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchMovie.fulfilled,
      (state, action: PayloadAction<IMovie>) => {
        state.loading = false;
        state.movie = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchMovie.rejected, (state, action) => {
      state.loading = false;
      state.movie = null;
      state.error = action.error.message || "Something went wrong";
    });

    // Add a movie
    builder.addCase(addMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addMovie.fulfilled,
      (state, action: PayloadAction<IMovie>) => {
        state.loading = false;
        state.movies = state.movies.concat(action.payload);
        state.error = "";
      }
    );
    builder.addCase(addMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });

    // Edit a movie
    builder.addCase(editMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      editMovie.fulfilled,
      (state, action: PayloadAction<IMovie>) => {
        state.loading = false;
        const newMovies: IMovie[] = [...state.movies];
        //finding index of the movie
        const index: number = newMovies.findIndex(
          (m) => m.id === action.payload.id
        );
        newMovies[index] = action.payload;
        state.movies = newMovies;
        state.error = "";
      }
    );
    builder.addCase(editMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });

    // Delete a movie
    builder.addCase(deleteMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteMovie.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.movies = state.movies.filter(
          (movie: IMovie) => movie.id !== action.payload
        );
        state.error = "";
      }
    );
    builder.addCase(deleteMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default movieSlice.reducer;
