import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { roleSchema } from "../../schemas/validationSchema";
import {
  useAddRoleMutation,
  useUpdateRoleMutation,
} from "../../features/api/roleApi";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  ListItem,
  TextField,
} from "@mui/material";
import { infos } from "../../schemas/infos";
import { moduleSchema } from "../../schemas/moduleSchema";
import CustomAutoComplete from "../CustomAutoComplete";
import {
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
} from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const RoleCreate = ({
  open = false,
  closeHandler,
  data,
  isUpdate = false,
  isViewOnly,
}) => {
  const [addRole] = useAddRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const pokedData = useSelector((state) => state.auth.pokedData);

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: "",
      access_permission: null,
    },
  });
  const AccessPermission = moduleSchema.flatMap((ap) => {
    if (ap.subCategory) {
      return ap.subCategory;
    } else {
      return [ap]; // Wrap in an array to maintain consistency
    }
  });

  const handleFormValue = () => {
    setValue("name", pokedData?.name || "");
    setValue(
      "access_permission",
      moduleSchema.filter(
        (item) => pokedData?.access_permission?.includes(item.name) || ""
      )
    );
  };

  useEffect(() => {
    if (open == true && pokedData) {
      handleFormValue();
    }
  }, [open, data]);
  console.log({ pokedData });

  const submitHandler = (roleData) => {
    const body = {
      name: roleData.name,
      access_permission: roleData.access_permission.map((item) => item.name),
    };
    const updateBody = {
      name: roleData.name,
      access_permission: roleData.access_permission.map((item) => item.name),
    };

    if (isUpdate) {
      updateRole({ id: pokedData.id, ...updateBody })
        .then((res) => {
          toast.success(res?.data?.message);
          reset();
          closeHandler();
        })
        .catch((error) => {
          toast.error(error.data?.message);
          reset();
          closeHandler();
        });
    } else {
      addRole(body)
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
          reset();
          closeHandler();
        })
        .catch((error) => {
          toast.error(error.data?.message);
          closeHandler();
          reset();
        });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={closeHandler}>
        <DialogTitle>
          {isUpdate
            ? infos.role_dialog_update_title
            : infos.role_dialog_add_title}
        </DialogTitle>
        <br />
        <DialogContent>
          <form onSubmit={handleSubmit(submitHandler)} id="submit-form">
            <Grid container>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={isViewOnly}
                      fullWidth
                      label="Role Name"
                      helperText={errors.name && errors.name?.message}
                      error={!!errors.name}
                    />
                  )}
                />
              </Grid>
              <br />
              <Grid item xs={12}>
                <CustomAutoComplete
                  control={control}
                  name="access_permission"
                  filterOptions={createFilterOptions({
                    limit: 100,
                  })}
                  size="small"
                  id="grouped-demo"
                  multiple
                  disabled={isViewOnly}
                  disableCloseOnSelect={true}
                  options={AccessPermission ?? []}
                  getOptionLabel={(option) => option?.name ?? []}
                  getOptionKey={(option, index) => index}
                  isOptionEqualToValue={(option, value) => {
                    return option?.name === value?.name;
                  }}
                  renderOption={(props, option, { selected }) => (
                    <ListItem {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlankRounded />}
                        checkedIcon={<CheckBoxRounded />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option?.name}
                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Access Permissions"
                      fullWidth
                      error={!!errors?.access_permission}
                      helperText={errors?.access_permission?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          {!isViewOnly && (
            <Button variant="contained" type="submit" form="submit-form">
              {isUpdate ? "Save" : "Create"}
            </Button>
          )}
          <Button onClick={closeHandler}  color="error">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoleCreate;
