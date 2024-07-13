import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "../schemas/validationSchema";
import { infos } from "../schemas/infos";
import "../styles/LoginPage.scss";

const Login = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: { username: "", password: "" },
    resolver: yupResolver(loginSchema),
  });

  return (
    <>
      <Box className="login-page">
        <Paper className="login-page__login-card">
          <Box className="login-page__card-header">LOGO</Box>
          <Box className="login-page__card-content">
            <Box className="login-page__card-greeting">
              <Typography className="login-page__card-greeting--title">
                {infos.greeting_title}
              </Typography>
              <Typography className="login-page__card-greeting--subtitle">
                {infos.greeting_subtitle}
              </Typography>
            </Box>
            <Box className="login-page__card-form">
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Username" />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Password" />
                )}
              />
              <Button variant="contained">Login</Button>
            </Box>
          </Box>
          <Box className="login-page__card-footer"></Box>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
