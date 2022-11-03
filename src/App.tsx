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
import AdminPage from "./pages/AdminPage";
import { Provider } from "react-redux";
import store from "./redux/store";

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
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
              </Route>
              <Route element={<AdminPage />}>
                <Route path="/dashboard" element={<Dashboard />} />
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
