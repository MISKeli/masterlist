import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "../schemas/validationSchema";
import { infos } from "../schemas/infos";
import "../styles/LoginPage.scss";
import { usePostLoginMutation } from "../features/api/loginApi";
import { Navigate, useNavigate } from "react-router-dom";
import { encrypt } from "../utils/encrypt";
import { useDispatch, useSelector } from "react-redux";
import { loginSlice } from "../features/slice/authSlice";
import { toast } from "sonner";
import PasswordDialog from "../components/layout/password/PasswordDialog";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  //const [loggedInUser, setLoggedInUser] = useState(null); // For storing user details
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
    resolver: yupResolver(loginSchema),
  });

  const [login] = usePostLoginMutation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const loginHandler = (data) => {
    //console.log({ data });
    login(data)
      .unwrap()
      .then((res) => {
        sessionStorage.setItem("token", encrypt(res.token));
        dispatch(loginSlice({ token: res?.token, user: res?.user }));
        sessionStorage.setItem("user", JSON.stringify(res.user));
       
        // Check if username equals password
          //setLoggedInUser(user);
          sessionStorage.setItem("uToken", encrypt(data?.username))
          sessionStorage.setItem("pToken", encrypt(data?.password))
          setShowPasswordDialog(true);
     
          toast.success(res?.message);
          navigate("/");
        
      })
      .catch((error) => {
        toast.error(error?.data.message);
      });
  };
  useEffect(() => {
    if (isAuthenticated) {
      return navigate("/");
    }
  }, [isAuthenticated]);

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

      {/* Password Dialog */}
      <PasswordDialog
        open={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          navigate("/");
        }}
        // userId="id"
        // username="username"
      />
    </>
  );
};

export default Login;
