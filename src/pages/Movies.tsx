import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMovies } from "../misc/movie";
import { IMovie } from "../types";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";

const Movies = () => {
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movie.movies);
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
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Year</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.length > 0 &&
            movies.map((movie: IMovie) => (
              <TableRow
                key={movie.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {movie.title}
                </TableCell>
                <TableCell align="right">{movie.description}</TableCell>
                <TableCell align="right">{movie.cost}</TableCell>
                <TableCell align="right">{movie.year}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Movies;
