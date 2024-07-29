import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { roleSchema } from "../../schemas/validationSchema";
import {
  useAddRoleMutation,
  useUpdateRoleMutation,
} from "../../features/api/roleApi";
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

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: "",
      access_permission: [],
    },
  });

  useEffect(() => {
    if (open && data) {
      // Populate form with data when the dialog opens
      setValue("name", data?.name || "");
      setValue(
        "access_permission",
        moduleSchema.filter((item) => {
          if (data?.access_permission) {
            if (data.access_permission.includes(item.name)) {
              return true; // Include if main category matches
            } else if (item.subCategory) {
              // Check sub-categories if present
              return item.subCategory.some((subItem) =>
                data.access_permission.includes(subItem.name)
              );
            }
          }
          return false;
        })
      );
    }
  }, [open, data, setValue]);

  const handleClose = () => {
    reset(); // Reset form values
    closeHandler(); // Close the dialog
  };

  const submitHandler = (roleData) => {
    const body = {
      name: roleData.name,
      access_permission: roleData.access_permission.map((item) => item.name),
    };

    if (isUpdate) {
      updateRole({ id: data.id, ...body })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
          reset();
          handleClose();
        })
        .catch((error) => {
          toast.error(error.data?.message);
          reset();
          handleClose();
        });
    } else {
      addRole(body)
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
          reset();
          handleClose();
        })
        .catch((error) => {
          toast.error(error.data?.message);
          handleClose();
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
                options={moduleSchema.flatMap((ap) =>
                  ap.subCategory ? ap.subCategory : [ap]
                )}
                getOptionLabel={(option) => option?.name ?? ""}
                getOptionKey={(option, index) => index}
                isOptionEqualToValue={(option, value) =>
                  option?.name === value?.name
                }
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
        <Button onClick={handleClose} color="error">
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleCreate;
