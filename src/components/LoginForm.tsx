import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { validatEmail } from "../utils";
import { login } from "../misc/auth";
import { useNavigate } from "react-router-dom";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";

const LoginForm = () => {
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");

  const errors = {
    name: "Please add a name.",
    email: "Please enter a valid email.",
    password: "Please add a password.",
  };

  const validateForm = (): string => {
    if (validatEmail(email)) {
      setEmailInvalid(errors.email);
      return errors.email;
    } else {
      setEmailInvalid("");
    }
    if (!password) {
      setPasswordInvalid(errors.password);
      return errors.password;
    } else {
      setPasswordInvalid("");
    }

    return "";
  };

  const handleRegister = async () => {
    if (validateForm()) return;
    const err: string = await login(email, password);
    if (!err) {
      navigate("/dashboard");
    }
    setErrorMessage(err);
  };

  return (
    <div className="center">
      <h1>Login</h1>
      <div className="ma-sm">
        <TextField
          label="Email"
          helperText={emailInvalid}
          error={emailInvalid !== ""}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="ma-sm">
        <TextField
          label="Password"
          type="password"
          helperText={passwordInvalid}
          error={passwordInvalid !== ""}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button variant="contained" onClick={handleRegister}>
        Login
      </Button>
      <div>
        Doesn't an account?
        <Button variant="text" onClick={() => navigate("/register")}>
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
