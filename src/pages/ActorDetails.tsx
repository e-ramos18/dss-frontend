import { Button, Paper } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { fetchActor } from "../misc/actor";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

type IParams = {
  id: string;
};

const ActorDetails = () => {
  const { id } = useParams<IParams>();
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const actor = useAppSelector((state) => state.actor.actor);
  const dispatch = useAppDispatch();
  useEffect(() => {
    onMount();
  }, [id]);
  const onMount = async () => {
    if (!id) return;
    const res = await dispatch(fetchActor(id));
    if (res.type === "movie/fetchMovie/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
  };

  return (
    <>
      {actor && (
        <>
          <h3>{actor.gender === "Male" ? "Actor" : "Actress"}</h3>
          <Paper className="movieDetails" elevation={3}>
            <img src={actor.imageUrl} alt={actor.fname} />
            <div className="details ma-sm">
              <p>First Name</p>
              <h2>{actor.fname}</h2>
              <p>Last Name</p>
              <h2>{actor.lname}</h2>
              <p>Gender</p>
              <h2>{actor.gender}</h2>
            </div>
          </Paper>
        </>
      )}
    </>
  );
};

export default ActorDetails;
