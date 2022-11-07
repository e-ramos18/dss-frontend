import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IReview } from "../types";
import { Avatar, Rating } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

type Iprops = {
  review: IReview;
};

const MovieReview = ({ review }: Iprops) => {
  return (
    <Accordion key={review.id}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Avatar>
          <AccountCircleIcon />
        </Avatar>
        <Typography
          sx={{ width: "35%", flexShrink: 0, color: "text.secondary" }}
        >
          User: {`[${review.userId}]`}
        </Typography>
        <Rating name="read-only" value={review.rating} readOnly />
        <Typography component="legend">rating</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{review.description}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default MovieReview;
