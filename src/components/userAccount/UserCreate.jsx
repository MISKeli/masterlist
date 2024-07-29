import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { userSchema } from "../../schemas/validationSchema";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { infos } from "../../schemas/infos";
import { useLazyGetCedarDataQuery } from "../../features/api/cedarApi";
import { useGetRoleQuery } from "../../features/api/roleApi";
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "../../features/api/userApi";
import { toast } from "sonner";
import { setPokedData } from "../../features/slice/authSlice";
import { SaveAltOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";

const UserCreate = ({ open = false, closeHandler, data, isUpdate = false }) => {
  const {
    handleSubmit,
    reset,
    control,

    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
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
      username: "",
      role_id: "",
      role: null,
    },
  });

  const [userCreate] = useAddUserMutation();
  const [userUpdate] = useUpdateUserMutation();

  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery();
  const pokedData = useSelector((state) => state.auth.pokedData);

  const [
    triggerFetchCedar,
    { data: CEDAR_USER_DATA, isLoading: isCedarLoading },
  ] = useLazyGetCedarDataQuery();

  const handleChangeUserRegistrationData = (value) => {
    setValue("personal_info.id_prefix", value?.general_info?.prefix_id || "");
    setValue("personal_info.id_no", value?.general_info?.id_number || "");
    setValue("personal_info.first_name", value?.general_info?.first_name || "");
    setValue(
      "personal_info.contact_details",
      value?.general_info?.contact_details || ""
    );

    setValue(
      "personal_info.middle_name",
      value?.general_info?.middle_name || ""
    );
    setValue("personal_info.last_name", value?.general_info?.last_name || "");
    setValue("personal_info.sex", value?.general_info?.gender || "");

    setValue(
      "username",
      value?.general_info
        ? `${value?.general_info?.first_name
            ?.toLowerCase()
            ?.charAt(0)}${value?.general_info?.last_name
            ?.replace(/\s/g, "")
            .toLowerCase()}`
        : ""
    );
  };
  const handleFormValue = () => {
    setValue(
      "cedarData",
      `${pokedData.id_prefix} ${pokedData.id_no} ${pokedData.last_name} ${pokedData.first_name}` ||
        ""
    );
    setValue("personal_info.id_prefix", pokedData?.id_prefix || "");
    setValue("personal_info.id_no", pokedData?.id_no || "");
    setValue("personal_info.first_name", pokedData?.first_name || "");
    setValue("personal_info.contact_details", pokedData?.contact_details || "");
    setValue("role", pokedData?.role || "");
    setValue("personal_info.middle_name", pokedData?.middle_name || "");
    setValue("personal_info.last_name", pokedData?.last_name || "");
    setValue("personal_info.sex", pokedData?.sex || "");
    setValue("role_id", pokedData?.role.id || "");
    setValue("username", pokedData?.username || "");
  };

  useEffect(() => {
    if (open == true && pokedData) {
      handleFormValue();
    }
  }, [open]);

  const submitHandler = (userData) => {
    const body = {
      personal_info: {
        id_prefix: userData.personal_info.id_prefix,
        id_no: userData.personal_info.id_no,
        first_name: userData.personal_info.first_name,
        middle_name: userData.personal_info.middle_name,
        last_name: userData.personal_info.last_name,
        contact_details: userData.personal_info.contact_details,
        sex: userData.personal_info.sex,
      },

      username: userData.username,
      role_id: userData.role_id,
    };

    const updateBody = {
      personal_info: {
        contact_details: userData.personal_info.contact_details,
      },
      username: userData.username,
      role_id: userData.role_id,
    };

    if (isUpdate) {
      userUpdate({ id: pokedData.id, ...updateBody })
        .then((res) => {
          toast.success(res?.data.message);
          reset();
          closeHandler();
        })
        .catch((error) => {
          toast.error(error.data?.message);
          reset();
          closeHandler();
        });
    } else {
      userCreate(body)
        .unwrap()
        .then((res) => {
          const userManagementMessage = res?.message;
          toast.success(userManagementMessage);
          reset();
          handleClose();
        })
        .catch((error) => {
          const userManagementErrorMessage = error?.data?.message;
          toast.error(userManagementErrorMessage);
        });
    }
  };

  const handleClose = () => {
    reset();

    closeHandler();
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {isUpdate
            ? infos.users_dialog_update_title
            : infos.users_dialog_add_title}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(submitHandler)} id="submit-form">
            <br />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {isUpdate ? (
                  <Controller
                    name="cedarData"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Employee ID"
                        disabled
                        fullWidth
                      />
                    )}
                  />
                ) : (
                  <Autocomplete
                    loading={isCedarLoading}
                    id="employee-id-autocomplete"
                    options={CEDAR_USER_DATA || []}
                    onChange={(e, data) => {
                      // handleEmployeeIdChange(data);
                      handleChangeUserRegistrationData(data);
                    }}
                    getOptionLabel={(option) =>
                      option.general_info.full_id_number_full_name
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Employee ID"
                        variant="outlined"
                        fullWidth
                        onClick={() =>
                          triggerFetchCedar({ preferCacheValue: true })
                        }
                        error={!!errors?.id_no}
                        helperText={errors?.id_no?.message}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        loading={isRoleLoading}
                        id="employee-id-autocomplete"
                        options={roleData?.result.data || []}
                        isOptionEqualToValue={(option, value) => {
                          return option.id == value.id;
                        }}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                          setValue("role_id", value.id);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Role"
                            variant="outlined"
                            fullWidth
                            onClick={() =>
                              triggerFetchCedar({ preferCacheValue: true })
                            }
                            error={!!errors?.role_id}
                            helperText={errors?.role_id?.message}
                          />
                        )}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="personal_info.id_prefix"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ID Prefix"
                      disabled
                      fullWidth
                      error={!!errors?.personal_info?.id_prefix}
                      helperText={errors?.personal_info?.id_prefix?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="personal_info.id_no"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ID Number"
                      disabled
                      fullWidth
                      error={!!errors?.personal_info?.id_no}
                      helperText={errors?.personal_info?.id_no?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="personal_info.first_name"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        {...field}
                        label="First Name"
                        disabled
                        fullWidth
                        error={!!errors?.personal_info?.first_name}
                        helperText={errors?.personal_info?.first_name?.message}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="personal_info.middle_name"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        {...field}
                        label="Middle Name"
                        disabled
                        fullWidth
                        error={!!errors?.personal_info?.middle_name}
                        helperText={errors?.personal_info?.middle_name?.message}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="personal_info.last_name"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        {...field}
                        label="Last Name"
                        disabled
                        fullWidth
                        error={!!errors?.personal_info?.last_name}
                        helperText={errors?.personal_info?.last_name?.message}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="personal_info.sex"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sex"
                      disabled
                      error={!!errors?.personal_info?.sex}
                      helperText={errors?.personal_info?.sex?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="personal_info.contact_details"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact Details"
                      placeholder="+639228633544"
                      fullWidth
                      // error={!!errors?.personal_info.contact_details}
                      // helperText={
                      //   errors?.personal_info.contact_details?.message
                      // }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="username"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      error={!!errors?.username}
                      helperText={errors?.username?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="submit-form"
            color="primary"
            variant="contained"
            startIcon={<SaveAltOutlined />}
          >
            {isUpdate ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserCreate;
