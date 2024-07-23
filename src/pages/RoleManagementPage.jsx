import {
  Box,
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { infos } from "../schemas/infos";
import "../styles/RoleManagementPage.scss";
import { useGetRoleQuery } from "../features/api/roleApi";

const RoleManagementPage = () => {
  const [open, setOpen] = useState(false);
  const { data: roleData } = useGetRoleQuery();

  const openPopUp = () => {
    setOpen(true);
  };

  const closePopUp = () => {
    setOpen(false);
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
      <Box className="role-main">
        <Box className="role-main__header">
          <Typography className="role-header__title">
            {infos.role_title}
          </Typography>
          <Button className="role-header__button" variant="contained">
            {infos.role_add_button}
          </Button>
        </Box>
        <Box className="role-main__content"></Box>
        <Paper className="role-content__paper">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {TableColumn.map((role) => (
                    <TableCell key={role.id}>{role.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Paper>
        <Box className="role-main__footer"></Box>
      </Box>
    </>
  );
};

export default RoleManagementPage;
