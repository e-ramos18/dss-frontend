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
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddMovieModal from "./AddMovieModal";
import DeleteModal from "./DeleteModal";
import EditMovieModal from "./EditMovieModal";
import * as React from "react";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "./TablePaginationActions";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const MoviesTable = () => {
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movie.movies);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [movieToEdit, setMovieToEdit] = useState<IMovie | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filteredMovies, setFilteredMovies] = useState<IMovie[] | null>(null);

  useEffect(() => {
    onMount();
  }, [movies.length]);
  const onMount = async () => {
    const res = await dispatch(fetchMovies());
    if (res.type === "movie/fetchMovies/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
    setFilteredMovies(movies);
  };

  const handleSearchChange = (_event: object, value: string) => {
    const filtered = movies.filter(
      (movie) =>
        movie.title.includes(value) ||
        movie.description.includes(value) ||
        movie.cost.includes(value) ||
        movie.year.includes(value)
    );
    setFilteredMovies(filtered);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetTable = () => {
    setFilteredMovies(movies);
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

  const handleCloseEdit = () => {
    setMovieToEdit(null);
    setOpenEdit(false);
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
    <>
      <Typography variant="h5">Movies Table</Typography>
      <div className="ma-sm">
        <Autocomplete
          freeSolo
          disableClearable
          options={movies.map((option) => option.title)}
          onChange={handleSearchChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search Movie"
              InputProps={{
                ...params.InputProps,
                type: "search",
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Reset Table">
                      <IconButton onClick={() => resetTable()}>
                        <RestartAltIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          )}
        />
      </div>
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
            {filteredMovies &&
              filteredMovies.length > 0 &&
              (rowsPerPage > 0
                ? filteredMovies.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredMovies
              ).map((movie: IMovie) => (
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
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={4}
                count={movies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
        <AddMovieModal open={openAdd} handleClose={() => setOpenAdd(false)} />
        {movieToEdit !== null && (
          <EditMovieModal
            open={openEdit}
            handleClose={handleCloseEdit}
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
    </>
  );
};

export default MoviesTable;
