import { Alert, Snackbar } from "@mui/material";
import * as React from "react";

export type ErrorContextType = {
  error: string;
  setErrorMessage: (message: string) => void;
};

interface Props {
  children: React.ReactNode;
}
export const ErrorContext = React.createContext<ErrorContextType | null>(null);

const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = React.useState("");

  const setErrorMessage = (message: string): void => {
    setError(message);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  return (
    <ErrorContext.Provider value={{ error, setErrorMessage }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={error !== ""}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
