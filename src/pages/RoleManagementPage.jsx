import {
  Box,
  Button,
  Chip,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { infos } from "../schemas/infos";
import "../styles/Masterlist.scss";
import {
  useArchivedRoleMutation,
  useGetRoleQuery,
} from "../features/api/roleApi";
import moment from "moment/moment";
import {
  ArchiveRounded,
  EditRounded,
  MoreVertOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPokedData } from "../features/slice/authSlice";
import RoleCreate from "../components/roleManagement/RoleCreate";

const RoleManagementPage = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("");
  const [viewOnly, setViewOnly] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const pokedData = useSelector((state) => state.auth.pokedData);
  console.log({ pokedData });
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery();
  const [archive] = useArchivedRoleMutation();

  // error to
  const handleArchive = () => {
    archive(pokedData.id)
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  const openPopUp = () => {
    setOpen(true);
  };

  const closePopUp = () => {
    setOpen(false);
    setView(""); // Reset view state
    setViewOnly(false);
    setIsUpdate(false); // Reset isEdit state
    setAnchorEl(null);
  };
  // di ko pa gets
  const handlePopoverOpen = (event, roleInfo) => {
    setAnchorEl(event.currentTarget);
    setIsUpdate(false);
    setView(roleInfo);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setIsUpdate(false);
  };

  const TableColumn = [
    { id: "id", name: "ID No." },
    { id: "name", name: "Role" },
    { id: "access_permission", name: "Access Permission" },
    { id: "is_active", name: "Status" },
    { id: "created_at", name: "Date Created" },
    { id: "action", name: "Action" },
  ];
  const dispatch = useDispatch();

  const haddlePokedData = (data) => {
    console.log({ data });
    dispatch(setPokedData(data));
  };

  return (
    <>
      {" "}
      <RoleCreate
        //THIS ARE THE PROPS
        open={open}
        closeHandler={closePopUp}
        data={view}
        isViewOnly={viewOnly}
        isUpdate={isUpdate}
      />
      <Box className="masterlist-main">
        <Box className="masterlist-main__header">
          <Typography
            className="masterlist-header__title"
            variant="h6"
            color={"primary"}
          >
            {infos.role_title}
          </Typography>
          <Button
            className="masterlist-header__button"
            variant="contained"
            open={open}
            onClick={openPopUp}
          >
            {infos.role_add_button}
          </Button>
        </Box>
        <br />
        <Box className="masterlist-main__content">
          <TableContainer
            component={Paper}
            sx={{ overflow: "auto", height: "100%" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {TableColumn.map((role) => (
                    <TableCell key={role.id}>{role.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {roleData?.result.data.map((roleInfo, index) => (
                  <TableRow key={index}>
                    <TableCell>{roleInfo.id}</TableCell>
                    <TableCell>{roleInfo.name}</TableCell>
                    <TableCell
                      onClick={() => {
                        setView(roleInfo);
                        openPopUp();
                        setViewOnly(true);
                      }}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "#3259c4",
                      }}
                    >
                      view
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={roleInfo.is_active ? "active" : "inactive"}
                        color={roleInfo.is_active ? "success" : "error"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {moment(roleInfo.created_at).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      <MoreVertOutlined
                        onClick={(event) => {
                          handlePopoverOpen(event, roleInfo);
                          haddlePokedData(roleInfo);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Button
                variant="text"
                onClick={() => {
                  handlePopoverClose();
                }}
                startIcon={<EditRounded />}
              >
                Edit
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  handlePopoverClose();
                  handleArchive();
                }}
                startIcon={<ArchiveRounded />}
              >
                Archive
              </Button>
            </Box>
          </Popover>
        </Box>

        <Box className="masterlist-main__footer"></Box>
      </Box>
    </>
  );
};

export default RoleManagementPage;
