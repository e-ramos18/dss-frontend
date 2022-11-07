import { useNavigate } from "react-router-dom";
import { IMovie } from "../types";

type IProps = {
  movie: IMovie;
};
const Movie = ({ movie }: IProps) => {
  const navigate = useNavigate();
  return (
    <div className="movie" onClick={() => navigate(`/movie/${movie.id}`)}>
      <img src={movie.imageUrl} alt={movie.title} />
    </div>
  );
};

export default Movie;
