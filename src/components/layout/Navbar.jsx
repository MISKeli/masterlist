import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { triggerSidebar } from "../../features/slice/miscSlice";
import {
  AccountCircleRounded,
  LockReset,
  Menu,
  PowerSettingsNew,
} from "@mui/icons-material";
import { logoutSlice } from "../../features/slice/authSlice";
import ConfirmedDialog from "../ConfirmedDialog";
import "../../styles/Navbar.scss";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setopen] = useState(false);

  const handleClose = () => {
    setopen(false);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handleLogoutClick = () => {
    setAnchorEl(null);
    setopen(true);
  };

  const logout = () => {
    dispatch(logoutSlice());
    sessionStorage.clear();
  };

  return (
    <Box className="navbar">
      <>
        <Button
          onClick={() => {
            setSidebar(!sidebar);
          }}
        >
          <Menu />
        </Button>
        <IconButton onClick={handlePopoverOpen}>
          <AccountCircleRounded />
        </IconButton>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <PowerSettingsNew />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
          <MenuItem onClick={handlePopoverClose}>
            <ListItemIcon>
              <LockReset />
            </ListItemIcon>
            <ListItemText primary="Change Password" />
          </MenuItem>
        </Popover>
        <ConfirmedDialog
          open={open}
          onClose={handleClose}
          onYes={logout}
          title={"Confirm Logout"}
          description={"Are you sure you want to log out?"}
        />
      </>
    </Box>
  );
};

export default Navbar;
