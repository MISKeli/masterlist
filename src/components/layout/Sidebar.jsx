import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import "../../styles/SideBar.scss";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
    const dispatch = useDispatch();
    const sidebar = useSelector((state)=> state.misc.sidebar)
  
  return (
    <Box className={sidebar ? "sidebar sidebar-close" : "sidebar sidebar-open"}>
      
    </Box>
  );
};

export default Sidebar;
