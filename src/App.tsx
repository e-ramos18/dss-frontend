import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Login,
  Register,
  UnprotectedPage,
  ProtectedPage,
  Home,
  Dashboard,
  Movies,
} from "./pages";
import ErrorProvider from "./context/ErrorProvider";
import UserPage from "./pages/UserPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import Reviews from "./pages/Reviews";
import Actors from "./pages/Actors";
import Users from "./pages/Users";
import MovieDetails from "./pages/MovieDetails";
import MoviesList from "./pages/MoviesList";
import { createTheme, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ErrorProvider>
        <ThemeProvider theme={darkTheme}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />}>
                <Route path="/" element={<MoviesList />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
              </Route>
              <Route element={<UnprotectedPage />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Route>
              <Route element={<ProtectedPage />}>
                <Route element={<UserPage />}></Route>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route path="/dashboard" element={<Users />} />
                  <Route path="/dashboard/adminMovies" element={<Movies />} />
                  <Route path="/dashboard/adminActors" element={<Actors />} />
                  <Route path="/dashboard/adminReviews" element={<Reviews />} />
                </Route>
              </Route>
              <Route path="*" element={<div>Page Not Found.</div>} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ErrorProvider>
    </Provider>
  );
};

export default App;
