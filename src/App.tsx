import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Register, UnprotectedPage, ProtectedPage, Home } from "./pages";
import ErrorProvider from "./context/ErrorProvider";

const App = () => {
  return (
    <ErrorProvider>
      <Router>
        <Routes>
          <Route element={<UnprotectedPage />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedPage />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<div>Page Not Found.</div>} />
        </Routes>
      </Router>
    </ErrorProvider>
  );
};

export default App;
