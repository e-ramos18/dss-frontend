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
import { IActor } from "../types";
import { addActor } from "../misc/actor";

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

const errors = {
  fname: "Please add a first name.",
  lname: "Please add a last name.",
  gender: "Please add a gender.",
  imageUrl: "Please add a image url.",
};

const genders = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
];

const AddActorModal = ({ open, handleClose }: Iprops) => {
  const loading = useAppSelector((state) => state.actor.loading);
  const dispatch = useAppDispatch();
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const [fname, setFname] = useState("");
  const [fnameInvalid, setFnameInvalid] = useState("");
  const [lname, setLname] = useState("");
  const [lnameInvalid, setLnameInvalid] = useState("");
  const [gender, setGender] = useState("");
  const [genderInvalid, setGenderInvalid] = useState("");
  const [image, setImage] = useState("");
  const [imageInvalid, setImageInvalid] = useState("");

  const validateForm = (): string => {
    if (!fname) {
      setFnameInvalid(errors.fname);
      return errors.fname;
    } else {
      setFnameInvalid("");
    }
    if (!lname) {
      setLnameInvalid(errors.lname);
      return errors.lname;
    } else {
      setLnameInvalid("");
    }
    if (!gender) {
      setGenderInvalid(errors.gender);
      return errors.gender;
    } else {
      setGenderInvalid("");
    }
    if (!image) {
      setImageInvalid(errors.imageUrl);
      return errors.imageUrl;
    } else {
      setImageInvalid("");
    }

    return "";
  };

  const resetForm = () => {
    setFname("");
    setLname("");
    setGender("");
    setImage("");
  };

  const handleSubmit = async () => {
    if (validateForm()) return;
    const actor: IActor = {
      fname,
      lname,
      gender,
      imageUrl: image,
    };
    const res = await dispatch(addActor(actor));
    if (res.type === "actor/addActor/rejected") {
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
          Add Actor
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
                label="First name"
                helperText={fnameInvalid}
                error={fnameInvalid !== ""}
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="ma-sm">
              <TextField
                fullWidth
                label="Last name"
                helperText={lnameInvalid}
                error={lnameInvalid !== ""}
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div className="ma-sm">
              <TextField
                fullWidth
                select
                label="Select gender"
                value={gender}
                helperText={genderInvalid}
                error={genderInvalid !== ""}
                onChange={(e) => setGender(e.target.value)}
              >
                {genders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="ma-sm">
              <TextField
                fullWidth
                label="Image URL"
                helperText={imageInvalid}
                error={imageInvalid !== ""}
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
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

export default AddActorModal;
