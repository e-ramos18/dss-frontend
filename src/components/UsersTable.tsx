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
import {
  Autocomplete,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  TableFooter,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteModal from "./DeleteModal";
import { deleteUser, editUser, fetchUsers } from "../misc/user";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import TablePaginationActions from "./TablePaginationActions";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const UsersTable = () => {
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.user.users);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredUsers, setFilteredUsers] = useState<IUser[] | null>(null);

  useEffect(() => {
    onMount();
  }, [users.length]);
  const onMount = async () => {
    const res = await dispatch(fetchUsers());
    if (res.type === "user/fetchUsers/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
    setFilteredUsers(users);
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

  const handleSearchChange = (_event: object, value: string) => {
    const filtered = users.filter(
      (user) =>
        user.name.includes(value) ||
        user.email.includes(value) ||
        user.role.includes(value)
    );
    setFilteredUsers(filtered);
  };

  const resetTable = () => {
    setFilteredUsers(users);
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
    <>
      <Typography variant="h5">Users Table</Typography>
      <div className="ma-sm">
        <Autocomplete
          freeSolo
          disableClearable
          options={users.map((option) => option.name)}
          onChange={handleSearchChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search User"
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
            {filteredUsers &&
              filteredUsers.length > 0 &&
              (rowsPerPage > 0
                ? filteredUsers.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredUsers
              ).map((user: IUser) => (
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
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={5}
                count={users.length}
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
    </>
  );
};

export default UsersTable;
