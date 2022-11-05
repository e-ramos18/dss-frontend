import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, MenuItem, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { IUser, Roles } from "../types";
import { validatEmail } from "../utils";
import { addUser } from "../misc/user";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

type Iprops = {
  open: boolean;
  handleClose: () => void;
};

const roles = [
  {
    value: Roles.User,
    label: Roles.User,
  },
  {
    value: Roles.Admin,
    label: Roles.Admin,
  },
];

const errors = {
  name: "Please add a name.",
  email: "Please enter a valid email.",
  password: "Please add a password.",
  cpassword: "Please confirm password.",
  role: "Please add a role",
  chars: "Should be atleast 8 characters.",
  match: "Passwords should match.",
};

const AddUserModal = ({ open, handleClose }: Iprops) => {
  const loading = useAppSelector((state) => state.actor.loading);
  const dispatch = useAppDispatch();
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const [name, setName] = useState("");
  const [nameInvalid, setNameInvalid] = useState("");
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [cpasswordInvalid, setCpasswordInvalid] = useState("");
  const [role, setRole] = useState<Roles>(Roles.User);
  const [roleInvalid, setRoleInvalid] = useState("");

  const validateForm = (): string => {
    if (!name) {
      setNameInvalid(errors.name);
      return errors.name;
    } else {
      setNameInvalid("");
    }
    if (validatEmail(email)) {
      setEmailInvalid(errors.email);
      return errors.email;
    } else {
      setEmailInvalid("");
    }
    if (!password) {
      setPasswordInvalid(errors.password);
      return errors.password;
    } else if (password.length < 8) {
      setPasswordInvalid(errors.chars);
      return errors.chars;
    } else {
      setPasswordInvalid("");
    }

    if (!cpassword) {
      setCpasswordInvalid(errors.cpassword);
      return errors.cpassword;
    } else if (cpassword.length < 8) {
      setCpasswordInvalid(errors.chars);
      return errors.chars;
    } else {
      setCpasswordInvalid("");
    }

    if (password !== cpassword) {
      setPasswordInvalid(errors.match);
      setCpasswordInvalid(errors.match);
      return errors.match;
    } else {
      setPasswordInvalid("");
      setCpasswordInvalid("");
    }

    if (!role) {
      setRoleInvalid(errors.role);
      return errors.role;
    } else {
      setRoleInvalid("");
    }

    return "";
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setCpassword("");
    setRole(Roles.User);
  };

  const handleSubmit = async () => {
    if (validateForm()) return;
    const user: IUser = {
      name,
      email,
      password,
      role,
    };
    const res = await dispatch(addUser(user));
    if (res.type === "user/addUser/rejected") {
      //@ts-ignore
      if (res.error.message === "Request failed with status code 409") {
        return setErrorMessage("Email value is already taken.");
      }
      //@ts-ignore
      return setErrorMessage(res.error.message);
    }
    resetForm();
    handleClose();
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Add User
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              width: 400,
            }}
          >
            <div className="ma-sm">
              <TextField
                fullWidth
                label="Name"
                helperText={nameInvalid}
                error={nameInvalid !== ""}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="ma-sm">
              <TextField
                fullWidth
                label="Email"
                helperText={emailInvalid}
                error={emailInvalid !== ""}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="ma-sm">
              <TextField
                fullWidth
                label="Password"
                type="password"
                helperText={passwordInvalid}
                error={passwordInvalid !== ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="ma-sm">
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                helperText={cpasswordInvalid}
                error={cpasswordInvalid !== ""}
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
              />
            </div>
            <div className="ma-sm">
              <TextField
                fullWidth
                select
                label="Select Role"
                value={role}
                helperText={roleInvalid}
                error={roleInvalid !== ""}
                onChange={(e) => setRole(e.target.value as Roles)}
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            variant="outlined"
            loading={loading}
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default AddUserModal;
