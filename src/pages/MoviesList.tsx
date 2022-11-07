import { useEffect } from "react";
import Movie from "../components/Movie";
import { fetchMovies } from "../misc/movie";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const MoviesList = () => {
  const movies = useAppSelector((state) => state.movie.movies);
  const dispatch = useAppDispatch();
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
    <>
      <div className="moviesList">
        {movies &&
          movies.length !== 0 &&
          movies.map((movie) => <Movie movie={movie} key={movie.id} />)}
      </div>
    </>
  );
};

export default MoviesList;
