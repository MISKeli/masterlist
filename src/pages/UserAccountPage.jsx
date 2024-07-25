import React, { useState } from "react";
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
import { infos } from "../schemas/infos";
import "../styles/UserAccountPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { setPokedData } from "../features/slice/authSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../schemas/validationSchema";
import {
  useArchivedUserMutation,
  useGetUserQuery,
} from "../features/api/userApi";
import { toast } from "sonner";
import {
  ArchiveRounded,
  EditRounded,
  MoreVertOutlined,
} from "@mui/icons-material";
import UserCreate from "../components/userAccount/UserCreate";

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
  //const debounceValue = useDebounce(search);
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState("active");
  const [open, SetOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [view, setView] = useState("");
  const [viewOnly, setViewOnly] = useState(false);

  const handlePokedData = (data) => {
    console.log({ data });
    dispatch(setPokedData(data));
  };

  const setOpenTrue = () => {
    SetOpen(true);
  };
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsUpdate(false);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const [archive] = useArchivedUserMutation();
  const { data: getUser, isLoadng: isUserLoading } = useGetUserQuery();

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
  };

  const openDialogForUpdate = () => {
    SetOpen(true);
    setIsUpdate(true);
  };

  console.log({ getUser });
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
            onClick={setOpenTrue}
            variant="contained"
          >
            {infos.users_add_button}
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
                  {TableColumn.map((usercolumn) => (
                    <TableCell key={usercolumn}>{usercolumn.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {getUser?.result.data.map((userAcc, index) => (
                  <TableRow key={index}>
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
                        label={userAcc.is_active ? "active" : "inactive"}
                        color={
                          userAcc.is_active === "active" ? "error" : "success"
                        }
                        size="small"
                      ></Chip>
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
                openDialogForUpdate(true);
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

                // Implement archive logic here
              }}
              startIcon={<ArchiveRounded />}
            >
              Archive
            </Button>
          </Box>
        </Popover>
        <Box className="masterlist-main__footer"></Box>
      </Box>
    </>
  );
};

export default UserAccountPage;
