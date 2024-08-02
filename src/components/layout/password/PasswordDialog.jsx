import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { infos } from "../../../schemas/infos";
import {
  useUpdateChangePasswordMutation,
  useUpdateResetPasswordMutation,
} from "../../../features/api/passwordApi";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "../../../schemas/validationSchema";
import { decrypt, encrypt } from "../../../utils/encrypt";
import { Close } from "@mui/icons-material";

const PasswordDialog = ({ open, onClose, isReset, userId, username }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { decryptedData: decryptedUToken } = decrypt(
    sessionStorage.getItem("uToken")
  );
  const { decryptedData: decryptedPToken } = decrypt(
    sessionStorage.getItem("pToken")
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const [updateChangePassword] = useUpdateChangePasswordMutation();

  const onSubmit = (data) => {
    if (data.new_password !== data.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    updateChangePassword({
      old_password: data.old_password,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
        sessionStorage.setItem("pToken", encrypt(data.new_password));

        console.log({ res });
        reset();
        onClose();
      })
      .catch((err) => {
        toast.error(err?.data.message);
      });
  };
  const handleClose = () => {
    reset(); // Reset the form fields when closing the dialog
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          Change Password
          {decryptedUToken !== decryptedPToken ? (
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          ) : null}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Controller
          name="old_password"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="Old Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              {...field}
              error={!!errors.old_password}
              helperText={
                errors.old_password ? errors.old_password.message : ""
              }
            />
          )}
        />
        <Controller
          name="new_password"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              {...field}
              error={!!errors.new_password}
              helperText={
                errors.new_password ? errors.new_password.message : ""
              }
            />
          )}
        />
        <Controller
          name="confirm_password"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              {...field}
              error={!!errors.confirm_password}
              helperText={
                errors.confirm_password ? errors.confirm_password.message : ""
              }
            />
          )}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
          }
          label="Show Passwords"
        />
      </DialogContent>
      <DialogActions>
        {decryptedUToken !== decryptedPToken ? (
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        ) : null}
        <Button onClick={handleSubmit(onSubmit)}>Change Password</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;
