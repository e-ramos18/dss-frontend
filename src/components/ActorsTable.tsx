import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteActor, fetchActors } from "../misc/actor";
import { IActor } from "../types";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { Button } from "@mui/material";
import AddActorModal from "./AddActorModal";
import DeleteModal from "./DeleteModal";
import EditActorModal from "./EditActorModal";

const ActorsTable = () => {
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const dispatch = useAppDispatch();
  const actors = useAppSelector((state) => state.actor.actors);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [actorToEdit, setActorToEdit] = useState<IActor | null>(null);

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

  const handleOpenDelete = (id?: string) => {
    if (id) {
      setIdToDelete(id);
    }
    setOpenDelete(true);
  };

  const handleOpenEdit = (actor: IActor | null) => {
    if (actor) {
      setActorToEdit(actor);
    }
    setOpenEdit(true);
  };

  const handleDelete = async (id: string) => {
    const res = await dispatch(deleteActor(id));
    if (res.type === "actor/deleteActor/rejected") {
      //@ts-ignore
      return setErrorMessage(res.error.message);
    }
    setOpenDelete(false);
  };

  return (
    <TableContainer component={Paper}>
      <div className="ma-sm">
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Add Actor
        </Button>
      </div>

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">First Name</TableCell>
            <TableCell align="center">Last Name</TableCell>
            <TableCell align="center">Gender</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {actors.length > 0 &&
            actors.map((actor: IActor) => (
              <TableRow
                key={actor.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{actor.fname}</TableCell>
                <TableCell align="center">{actor.lname}</TableCell>
                <TableCell align="center">{actor.gender}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleOpenEdit(actor)}>Edit</Button>
                  <Button
                    color="error"
                    onClick={() => handleOpenDelete(actor.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <AddActorModal open={openAdd} handleClose={() => setOpenAdd(false)} />
      {actorToEdit !== null && (
        <EditActorModal
          open={openEdit}
          handleClose={() => setOpenEdit(false)}
          actor={actorToEdit}
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

export default ActorsTable;
