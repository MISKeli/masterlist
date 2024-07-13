import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "../schemas/validationSchema";
import { infos } from "../schemas/infos";
import "../styles/LoginPage.scss";
import { usePostLoginMutation } from "../features/api/loginApi";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../utils/encrypt";

const Login = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
    resolver: yupResolver(loginSchema),
  });

  const [login] = usePostLoginMutation();

  const loginHandler = (data) => {
    login(data)
      .unwrap()
      .then((res) => {
        sessionStorage.setItem("token",encrypt(res.result.token))
        navigate("/");
      })
      .catch((error) => console.log({ error }));
  };

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
              <form onSubmit={handleSubmit(loginHandler)} id="form-submit">
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      helperText={errors?.username?.message}
                      error={errors?.username?.message}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      helperText={errors?.password?.message}
                      error={errors?.password?.message}
                    />
                  )}
                />
              </form>
              <Button variant="contained" type="submit" form="form-submit">
                Login
              </Button>
            </Box>
          </Box>
          <Box className="login-page__card-footer"></Box>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
