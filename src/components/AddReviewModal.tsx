import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Rating, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { APIResponse, IReview, IUser } from "../types";
import { getCurrentUser } from "../misc/auth";
import { addReview } from "../misc/review";

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
  movieId?: string;
  handleClose: () => void;
};

const errors = {
  description: "Please add a description.",
  rating: "Please add a rating.",
};

const AddReviewModal = ({ open, movieId, handleClose }: Iprops) => {
  const loading = useAppSelector((state) => state.actor.loading);
  const dispatch = useAppDispatch();
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [descriptionInvalid, setDescriptionInvalid] = useState("");
  const [rating, setRating] = useState<number | null>(0);
  const [ratingInvalid, setRatingInvalid] = useState("");

  useEffect(() => {
    onMount();
  }, []);

  const onMount = async () => {
    const res: APIResponse = await getCurrentUser();
    if (!res.data && res.error) {
      return setErrorMessage(res.error);
    }
    setCurrentUser(res.data);
  };

  const validateForm = (): string => {
    if (!description) {
      setDescriptionInvalid(errors.description);
      return errors.description;
    } else {
      setDescriptionInvalid("");
    }
    if (!rating || rating === 0) {
      setRatingInvalid(errors.rating);
      return errors.rating;
    } else {
      setRatingInvalid("");
    }

    return "";
  };

  const resetForm = () => {
    setDescription("");
    setRating(0);
  };

  const handleSubmit = async () => {
    if (
      validateForm() ||
      !currentUser ||
      !currentUser.id ||
      !movieId ||
      !rating
    )
      return;
    const review: IReview = {
      description,
      rating,
      userId: currentUser.id,
      movieId: movieId,
      isApproved: false,
    };
    const res = await dispatch(addReview(review));
    if (res.type === "actor/addReview/rejected") {
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
          Add Review
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
                label="Description"
                helperText={descriptionInvalid}
                error={descriptionInvalid !== ""}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="ma-sm">
              <Typography
                component="legend"
                color={!ratingInvalid ? "" : "error"}
              >
                {!ratingInvalid ? "Rate Movie" : ratingInvalid}
              </Typography>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(_event, newValue) => {
                  setRating(newValue);
                }}
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

export default AddReviewModal;
