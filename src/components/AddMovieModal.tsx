import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { addMovie } from "../misc/movie";
import { IActor, IMovie } from "../types";
import SelectActor from "./SelectActor";
import { fetchActors } from "../misc/actor";

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
  title: "Please add a title.",
  description: "Please add a description.",
  cost: "Please add a cost.",
  imageUrl: "Please add a image url.",
  year: "Please add a year.",
  actors: "Please add atleast one actor.",
};

const AddMovieModal = ({ open, handleClose }: Iprops) => {
  const loading = useAppSelector((state) => state.movie.loading);
  const actors = useAppSelector((state) => state.actor.actors);
  const dispatch = useAppDispatch();
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const [title, setTitle] = useState("");
  const [titleInvalid, setTitleInvalid] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionInvalid, setDescriptionInvalid] = useState("");
  const [cost, setCost] = useState("");
  const [costInvalid, setCostInvalid] = useState("");
  const [image, setImage] = useState("");
  const [imageInvalid, setImageInvalid] = useState("");
  const [year, setYear] = useState("");
  const [yearInvalid, setYearInvalid] = useState("");
  const [movieActors, setMovieActors] = useState<string[]>([]);
  const [movieActorsInvalid, setMovieActorsInvalid] = useState("");

  useEffect(() => {
    onMount();
  }, []);
  const onMount = async () => {
    const res = await dispatch(fetchActors());
    if (res.type === "actor/fetchActors/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
  };

  const handleActorChange = (_event: object, values: IActor[]) => {
    const actorsIds = values.map((value) => value.id);
    if (!actorsIds) return;
    //@ts-ignore
    setMovieActors(actorsIds);
  };

  const validateForm = (): string => {
    if (!title) {
      setTitleInvalid(errors.title);
      return errors.title;
    } else {
      setTitleInvalid("");
    }
    if (!description) {
      setDescriptionInvalid(errors.description);
      return errors.description;
    } else {
      setDescriptionInvalid("");
    }
    if (!cost) {
      setCostInvalid(errors.cost);
      return errors.cost;
    } else {
      setCostInvalid("");
    }
    if (!image) {
      setImageInvalid(errors.imageUrl);
      return errors.imageUrl;
    } else {
      setImageInvalid("");
    }
    if (!year) {
      setYearInvalid(errors.year);
      return errors.year;
    } else {
      setYearInvalid("");
    }

    if (!movieActors || !movieActors.length) {
      setMovieActorsInvalid(errors.actors);
      return errors.actors;
    } else {
      setMovieActorsInvalid("");
    }

    return "";
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCost("");
    setImage("");
    setYear("");
  };

  const handleSubmit = async () => {
    if (validateForm()) return;
    const movie: IMovie = {
      title,
      description,
      cost,
      imageUrl: image,
      year,
      actorsIds: movieActors,
    };
    const res = await dispatch(addMovie(movie));
    if (res.type === "movie/addMovie/rejected") {
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
          Add Movie
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
                label="Title"
                helperText={titleInvalid}
                error={titleInvalid !== ""}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
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
              <TextField
                fullWidth
                label="Cost"
                helperText={costInvalid}
                error={costInvalid !== ""}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
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
            <div className="ma-sm">
              <TextField
                fullWidth
                label="Year"
                helperText={yearInvalid}
                error={yearInvalid !== ""}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            {actors && (
              <div className="ma-sm">
                <SelectActor
                  options={actors}
                  handleChange={handleActorChange}
                  helperText={movieActorsInvalid}
                />
              </div>
            )}
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

export default AddMovieModal;
