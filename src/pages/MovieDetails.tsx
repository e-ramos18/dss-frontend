import { Button, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddReviewModal from "../components/AddReviewModal";
import MovieReview from "../components/MovieReview";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { fetchActors } from "../misc/actor";
import { fetchMovie } from "../misc/movie";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getItem } from "../utils";

type IParams = {
  id: string;
};

const MovieDetails = () => {
  const { id } = useParams<IParams>();
  const navigate = useNavigate();
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const movie = useAppSelector((state) => state.movie.movie);
  const actors = useAppSelector((state) => state.actor.actors);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    onMount();
  }, [id]);
  const onMount = async () => {
    if (!id) return;
    const res = await dispatch(fetchMovie(id));
    if (res.type === "movie/fetchMovie/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
    const response = await dispatch(fetchActors());
    if (response.type === "actor/fetchActors/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
  };

  const handleAddReview = () => {
    const token = getItem("token");
    if (!token) return navigate("/login");
    setOpen(true);
  };

  return (
    <>
      {movie && (
        <>
          <Paper className="movieDetails" elevation={3}>
            <img src={movie.imageUrl} alt={movie.title} />
            <div className="details">
              <h2>{movie.title}</h2>
              <p>{movie.description}</p>
              {movie.actorsIds && (
                <>
                  <h3>Actors</h3>
                  {actors && (
                    <>
                      <p>
                        {actors.map((actor) => {
                          if (actor.id && movie.actorsIds?.includes(actor.id)) {
                            return (
                              <span key={actor.id}>
                                {actor.fname} {actor.lname}, {""}
                              </span>
                            );
                          }
                        })}
                      </p>
                    </>
                  )}
                </>
              )}
              {!movie.reviews && <h3>No reviews yet.</h3>}

              <Button variant="contained" onClick={handleAddReview}>
                Add Review
              </Button>
            </div>
          </Paper>
          <br />
          {movie.reviews && (
            <>
              <h3>Reviews</h3>
              {movie.reviews.map((review) => {
                if (review.isApproved) {
                  return <MovieReview review={review} key={review.id} />;
                }
              })}
            </>
          )}
          {open && (
            <AddReviewModal
              open={open}
              movieId={movie.id}
              handleClose={() => setOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default MovieDetails;
