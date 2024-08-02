import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { infos } from "../schemas/infos";
import "../styles/UserAccountPage.scss";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../schemas/validationSchema";
import {
  useArchivedUserMutation,
  useGetUserQuery,
} from "../features/api/userApi";
import { toast } from "sonner";
import {
  AccountCircle,
  ArchiveRounded,
  Directions,
  EditRounded,
  LockReset,
  MoreVertOutlined,
  RestoreFromTrashOutlined,
  Search,
} from "@mui/icons-material";
import UserCreate from "../components/userAccount/UserCreate";
import useDebounce from "../components/useDebounce";
import PasswordDialog from "../components/layout/password/PasswordDialog";
import { useUpdateResetPasswordMutation } from "../features/api/passwordApi";
import { setPokedData } from "../features/slice/authSlice";
import ConfirmedDialog from "../components/ConfirmedDialog";

const UserAccountPage = () => {
  const TableColumn = [
    { id: "role_id", name: "Role Id" },
    { id: "id_prefix", name: "Prefix ID" },
    { id: "id_no", name: "ID No" },
    { id: "first_name", name: "First Name" },
    { id: "middle_name", name: "Middle name" },
    { id: "last_name", name: "Last Name" },
    { id: "contact_details", name: "Contact" },
    { id: "sex", name: "Sex" },
    { id: "username", name: "Username" },
    { id: "status", name: "Status" },
    { id: "action", name: "Action" },
  ];

  const pokedData = useSelector((state) => state.auth.pokedData);
  const dispatch = useDispatch();

  const {
    formState: { errors },
  } = useForm({
    defaultValues: {
      personal_info: {
        id_prefix: "",
        id_no: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        contact_details: "",
        sex: "",
      },
    },
    username: "",
    role_id: "",
    resolver: yupResolver(userSchema),
  });

  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [pagination, setPagination] = useState(1);
  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search);
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState("active");
  const [open, SetOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [view, setView] = useState("");
  const [viewOnly, setViewOnly] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleToggleStatus = () => {
    setStatus(status === "active" ? "inactive" : "active");
  };

  const handlePokedData = (data) => {
    dispatch(setPokedData(data));
  };

  const setOpenTrue = () => {
    SetOpen(true);
  };
  const handlePopoverOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setIsUpdate(false);
    setActiveRow(rowId);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setActiveRow(null);
    //dispatch(setPokedData(null));
  };
  const [resetPassword] = useUpdateResetPasswordMutation();
  const [archive] = useArchivedUserMutation();
  const { data: getUser, isLoadng: isUserLoading } = useGetUserQuery(
    {
      status,
      search: debounceValue,
      pagination,
      page: page + 1,
      per_page,
    },
    { refetchOnFocus: true }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when rows per page changes
  };

  const handleResetPasswordClick = () => {
    setAnchorEl(null);
    setIsReset(true);
    setOpenPasswordDialog(true);
  };

  const handleReset = () => {
    resetPassword(pokedData.id)
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => {
        toast.error(error?.message);
      });
    console.log({ pokedData });
  };
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

  const closePopUp = () => {
    SetOpen(false);
    setView(""); // Reset view state
    setViewOnly(false);
    setIsUpdate(false); // Reset isEdit state
    setAnchorEl(null);
    dispatch(setPokedData(null));
  };

  const openDialogForUpdate = () => {
    SetOpen(true);
    setIsUpdate(true);
  };

  return (
    <>
      <Box className="masterlist-main">
        <UserCreate
          open={open}
          isViewOnly={viewOnly}
          closeHandler={closePopUp}
          isUpdate={isUpdate}
          data={view}
        />

        <Box className="masterlist-main__header">
          <Typography
            className="masterlist-header__title"
            variant="h6"
            color={"primary"}
          >
            {infos.users_title}
          </Typography>
          <Button
            className="masterlist-header__button"
            onClick={() => {
              setOpenTrue(); // everytime user clicked the usercreate dispatch will clear the pokeddata
              dispatch(setPokedData(null));
            }}
            variant="contained"
          >
            {infos.users_add_button}
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
                  {TableColumn.map((usercolumn) => (
                    <TableCell key={usercolumn}>{usercolumn.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {getUser?.result.data.map((userAcc, index) => (
                  <TableRow
                    key={index}
                    className={activeRow === userAcc.id ? "active" : ""}
                  >
                    <TableCell>{userAcc.role_id}</TableCell>
                    <TableCell>{userAcc.id_prefix}</TableCell>
                    <TableCell>{userAcc.id_no}</TableCell>
                    <TableCell>{userAcc.first_name}</TableCell>
                    <TableCell>{userAcc.middle_name}</TableCell>
                    <TableCell>{userAcc.last_name}</TableCell>
                    <TableCell>{userAcc.contact_details}</TableCell>
                    <TableCell>{userAcc.sex}</TableCell>
                    <TableCell>{userAcc.username}</TableCell>
                    <TableCell>
                      <Chip
                        variant="outlined"
                        label={status === "active" ? "active" : "inactive"}
                        color={status === "active" ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <MoreVertOutlined
                        onClick={(event) => {
                          handlePopoverOpen(event);
                          handlePokedData(userAcc);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Menu
          open={Boolean(anchorEl)}
          onClose={handlePopoverClose}
          anchorEl={anchorEl}
        >
          {pokedData?.is_active ? (
            <>
              <MenuItem
                onClick={() => {
                  handlePopoverClose();
                  openDialogForUpdate();
                }}
              >
                <ListItemIcon>
                  <EditRounded />
                </ListItemIcon>
                <ListItemText primary="Edit" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handlePopoverClose();
                  handleArchive();
                }}
              >
                <ListItemIcon>
                  <ArchiveRounded />
                </ListItemIcon>
                <ListItemText primary="Archive" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleResetPasswordClick();
                  handlePopoverClose();
                }}
              >
                <ListItemIcon>
                  <LockReset />
                </ListItemIcon>
                <ListItemText primary="Reset Password" />
              </MenuItem>
            </>
          ) : (
            <MenuItem
              onClick={() => {
                handlePopoverClose();
                handleArchive();
              }}
            >
              <ListItemIcon>
                <RestoreFromTrashOutlined />
              </ListItemIcon>
              <ListItemText primary="Restore" />
            </MenuItem>
          )}
        </Menu>

        <Box className="masterlist-main__footer">
          <TablePagination
            component="div"
            className="pagination"
            count={getUser?.result.total}
            page={page}
            rowsPerPage={per_page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Box>

      <ConfirmedDialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        onYes={handleReset}
        title={"Reset Password"}
        description={`Are you sure you want to reset this ${
          pokedData?.first_name || "this user's"
        }'s password?`}
      />
    </>
  );
};

export default UserAccountPage;
