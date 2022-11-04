import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteMovie, fetchMovies } from "../misc/movie";
import { IMovie } from "../types";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { Button } from "@mui/material";
import AddMovieModal from "./AddMovieModal";
import DeleteModal from "./DeleteModal";
import EditMovieModal from "./EditMovieModal";

const MoviesTable = () => {
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movie.movies);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [movieToEdit, setMovieToEdit] = useState<IMovie | null>(null);

  useEffect(() => {
    onMount();
  }, []);
  const onMount = async () => {
    const res = await dispatch(fetchMovies());
    if (res.type === "movie/fetchMovies/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
  };

  const handleOpenDelete = (id?: string) => {
    if (id) {
      setIdToDelete(id);
    }
    setOpenDelete(true);
  };

  const handleOpenEdit = (movie: IMovie | null) => {
    if (movie) {
      setMovieToEdit(movie);
    }
    setOpenEdit(true);
  };

  const handleDelete = async (id: string) => {
    const res = await dispatch(deleteMovie(id));
    if (res.type === "movie/deleteMovie/rejected") {
      //@ts-ignore
      return setErrorMessage(res.error.message);
    }
    setOpenDelete(false);
  };

  return (
    <TableContainer component={Paper}>
      <div className="ma-sm">
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Add Movie
        </Button>
      </div>

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">Cost</TableCell>
            <TableCell align="center">Year</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.length > 0 &&
            movies.map((movie: IMovie) => (
              <TableRow
                key={movie.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{movie.title}</TableCell>
                <TableCell align="center">{movie.cost}</TableCell>
                <TableCell align="center">{movie.year}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleOpenEdit(movie)}>Edit</Button>
                  <Button
                    color="error"
                    onClick={() => handleOpenDelete(movie.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <AddMovieModal open={openAdd} handleClose={() => setOpenAdd(false)} />
      {movieToEdit !== null && (
        <EditMovieModal
          open={openEdit}
          handleClose={() => setOpenEdit(false)}
          movie={movieToEdit}
        />
      )}
      <DeleteModal
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        id={idToDelete}
        handleDelete={handleDelete}
      />
    </TableContainer>
  );
};

export default MoviesTable;
