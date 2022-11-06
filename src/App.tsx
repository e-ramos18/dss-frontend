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

const App = () => {
  return (
    <Provider store={store}>
      <ErrorProvider>
        <Router>
          <Routes>
            <Route element={<UnprotectedPage />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedPage />}>
              <Route element={<UserPage />}>
                <Route path="/home" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
              </Route>
              <Route path="/" element={<Dashboard />}>
                <Route path="/" element={<Users />} />
                <Route path="/adminMovies" element={<Movies />} />
                <Route path="/adminActors" element={<Actors />} />
                <Route path="/adminReviews" element={<Reviews />} />
              </Route>
            </Route>
            <Route path="*" element={<div>Page Not Found.</div>} />
          </Routes>
        </Router>
      </ErrorProvider>
    </Provider>
  );
};

export default App;
