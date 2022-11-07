import SearchAppBar from "../components/SearchAppBar";
import { Outlet } from "react-router-dom";
import { Paper } from "@mui/material";

const Home = () => {
  return (
    <Paper className="fullHeight">
      <SearchAppBar />
      <div className="main">
        <Outlet />
      </div>
    </Paper>
  );
};

export default Home;
