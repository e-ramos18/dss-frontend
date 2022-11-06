import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movie/movieSlice";
import actorReducer from "../features/actor/actorSlice";
import userReducer from "../features/user/userSlice";
import reviewReducer from "../features/review/reviewSlice";

const store = configureStore({
  reducer: {
    movie: movieReducer,
    actor: actorReducer,
    user: userReducer,
    review: reviewReducer,
  },
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
