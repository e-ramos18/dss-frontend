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
import { IReview, IUser } from "../types";
import { ErrorContext, ErrorContextType } from "../context/ErrorProvider";
import { Button, Chip, Rating, Tooltip } from "@mui/material";
import { deleteReview, editReview, fetchReviews } from "../misc/review";

const ReviewsTable = () => {
  const { setErrorMessage } = useContext(ErrorContext) as ErrorContextType;
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state) => state.review.reviews);

  useEffect(() => {
    onMount();
  }, []);
  const onMount = async () => {
    const res = await dispatch(fetchReviews());
    if (res.type === "review/fetchReviews/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
  };

  const approveReview = async (review: IReview, isApprove: boolean) => {
    const updatedReview = { ...review };
    updatedReview.isApproved = isApprove;
    const res = await dispatch(editReview(updatedReview));
    if (res.type === "review/editReview/rejected") {
      //@ts-ignore
      setErrorMessage(res.error.message);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Movie Title</TableCell>
            <TableCell align="center"> User</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Rating</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.length > 0 &&
            reviews.map((review: IReview) => (
              <TableRow
                key={review.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{review.movie?.title}</TableCell>
                <TableCell align="center">{review.user?.name}</TableCell>
                <TableCell align="center">{review.description}</TableCell>
                <TableCell align="center">
                  <Rating name="read-only" value={review.rating} readOnly />
                </TableCell>
                <TableCell align="center">
                  {review.isApproved ? (
                    <Tooltip title="Click to disapprove rating">
                      <Chip
                        icon={<HowToRegIcon />}
                        label="approved"
                        color="success"
                        onClick={() => approveReview(review, false)}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Click to approve rating">
                      <Chip
                        icon={<HowToRegIcon />}
                        label="to approved"
                        onClick={() => approveReview(review, true)}
                      />
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReviewsTable;
