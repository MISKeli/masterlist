import { Box, Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { triggerSidebar } from "../../features/slice/miscSlice";

const Navbar = () => {
  const sidebar = useSelector((state) => state.misc.sidebar);
  const dispatch = useDispatch();

  const setSidebar = (set) => {
    dispatch(
      triggerSidebar({
        sidebar: set,
      })
    );
  };
  return (
    <Box className="navbar">
      <>
        <Button
          onClick={() => {
            setSidebar(!sidebar);
          }}
        >
          Click here
        </Button>
      </>
    </Box>
  );
};

export default Navbar;
