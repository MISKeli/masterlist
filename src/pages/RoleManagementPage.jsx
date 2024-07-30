import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
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
  Search,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPokedData } from "../features/slice/authSlice";
import RoleCreate from "../components/roleManagement/RoleCreate";
import useDebounce from "../components/useDebounce";

const RoleManagementPage = () => {
  const [open, setOpen] = useState(false);

  const [viewOnly, setViewOnly] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [pagination, setPagination] = useState(1);
  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search);

  const pokedData = useSelector((state) => state.auth.pokedData);

  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery({
    status,
    search: debounceValue,
    pagination,
    page: page + 1,
    per_page,
  },
  { refetchOnFocus: true }
);
  const handleToggleStatus = () => {
    setStatus(status === "active" ? "inactive" : "active");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when rows per page changes
  };
  const [archive] = useArchivedRoleMutation();

  const clearPokedData = () => {
    dispatch(setPokedData(null)); // Clear pokedData
  };
  console.log({ roleData });
  const handlePokedData = (data) => {
    console.log({ pokedData });
    dispatch(setPokedData(data));
  };

  const handleArchive = () => {
    if (pokedData?.id) {
      archive(pokedData.id)
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
          clearPokedData();
        })
        .catch((error) => {
          toast.error(error?.message);
          clearPokedData();
        });
    }
  };

  const openDialogForUpdate = () => {
    setOpen(true);
    setIsUpdate(true);
  };

  const openPopUp = () => {
    setOpen(true);
    setViewOnly(false);
  };

  const closePopUp = () => {
    setOpen(false);
    //setView(""); // Reset view state
    setViewOnly(false);
    setIsUpdate(false); // Reset isEdit state
    setAnchorEl(null);
    clearPokedData();
  };
  // di ko pa gets
  const handlePopoverOpen = (event, roleInfo) => {
    setAnchorEl(event.currentTarget);
    dispatch(setPokedData(roleInfo));
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    //setIsUpdate(false);
  };

  const TableColumn = [
    { id: "id", name: "ID No." },
    { id: "name", name: "Role" },
    { id: "access_permission", name: "Access Permission" },
    { id: "is_active", name: "Status" },
    { id: "created_at", name: "Date Created" },
    { id: "action", name: "Action" },
  ];

  return (
    <>
      <RoleCreate
        //THIS ARE THE PROPS
        open={open}
        closeHandler={closePopUp}
        data={pokedData}
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
        <Box className="masterlist-content__header">
          <Box className="masterlist-header__archieved">
            <Checkbox
              checked={status === "inactive"}
              onChange={handleToggleStatus}
              color="error"
            />
            <Typography
              variant="button"
              color={status === "active" ? "primary" : "error"}
            >
              Archived
            </Typography>
          </Box>
          <Box className="masterlist-header__search">
            <Box
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "250px",
              }}
            >
              <InputBase
                sx={{ ml: 0.5, flex: 1 }}
                placeholder="Search "
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />

              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                color="primary"
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
              >
                <Search />
              </IconButton>
            </Box>
          </Box>
        </Box>

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
                        //setView(roleInfo);
                        openPopUp();
                        setViewOnly(true);
                        handlePokedData(roleInfo);
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
                  openDialogForUpdate();
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

        <Box className="masterlist-main__footer">
        <TablePagination
            component="div"
            className="pagination"
            count={roleData?.result.total}
            page={page}
            rowsPerPage={per_page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Box>
    </>
  );
};

export default RoleManagementPage;
