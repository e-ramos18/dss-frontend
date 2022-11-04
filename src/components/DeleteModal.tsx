import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

type Iprops = {
  open: boolean;
  handleClose: () => void;
  id: string;
  handleDelete: (id: string) => void;
};

const DeleteModal = ({ open, handleClose, id, handleDelete }: Iprops) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to delete this?
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => handleDelete(id)}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
