import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IUser, Roles } from "../types";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { Button, Chip, Tooltip } from "@mui/material";
import DeleteModal from "./DeleteModal";
import { deleteUser, editUser, fetchUsers } from "../misc/user";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { LoadingButton } from "@mui/lab";

const UsersTable = () => {
  const loading = useAppSelector((state) => state.user.loading);
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.user.users);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);

  useEffect(() => {
    onMount();
  }, []);
  const onMount = async () => {
    const res = await dispatch(fetchUsers());
    if (res.type === "user/fetchUsers/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
  };

  const approveUser = async (user: IUser, isApprove: boolean) => {
    const updatedUser = { ...user };
    updatedUser.isApproved = isApprove;
    const res = await dispatch(editUser(updatedUser));
    if (res.type === "user/editUser/rejected") {
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

  const handleOpenEdit = (user: IUser | null) => {
    if (user) {
      setUserToEdit(user);
    }
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setUserToEdit(null);
    setOpenEdit(false);
  };

  const handleDelete = async (id: string) => {
    const res = await dispatch(deleteUser(id));
    if (res.type === "user/deleteUser/rejected") {
      //@ts-ignore
      return setErrorMessage(res.error.message);
    }
    setOpenDelete(false);
  };

  return (
    <TableContainer component={Paper}>
      <div className="ma-sm">
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Add User
        </Button>
      </div>

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center"> Name</TableCell>
            <TableCell align="center">Role</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 &&
            users.map((user: IUser) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.name}</TableCell>
                <TableCell align="center">{user.role}</TableCell>
                <TableCell align="center">
                  {user.isApproved ? (
                    <Tooltip title="Click to disapprove User">
                      <Chip
                        icon={<HowToRegIcon />}
                        label="approved"
                        color="success"
                        onClick={() => approveUser(user, false)}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Click to approve User">
                      <Chip
                        icon={<HowToRegIcon />}
                        label="to approved"
                        onClick={() => approveUser(user, true)}
                      />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleOpenEdit(user)}
                    disabled={user.role === Roles.RootAdmin}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleOpenDelete(user.id)}
                    disabled={user.role === Roles.RootAdmin}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <AddUserModal open={openAdd} handleClose={() => setOpenAdd(false)} />
      {userToEdit !== null && (
        <EditUserModal
          open={openEdit}
          handleClose={handleCloseEdit}
          user={userToEdit}
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

export default UsersTable;
