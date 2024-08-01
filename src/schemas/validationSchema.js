import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required."),
});

//ROLE MANAGEMENT
export const roleSchema = yup.object().shape({
  name: yup.string().required("Name is required."),
  access_permission: yup.array().required("Access Permission is required."),
});

//USER ACCESS
export const userSchema = yup.object().shape({
  personal_info: yup.object().shape({
    contact_details: yup.string().required("Contact Details is required."),
    first_name: yup.string().required("First name is required."),
    id_no: yup.string().required("ID No is required."),
    id_prefix: yup.string().required("Prefix ID is required."),
    last_name: yup.string().required("Last name is required."),
    sex: yup.string().required("Sex is required."),
    middle_name: yup.string(),
  }),
  username: yup.string().required("Username is required."),
  role_id: yup.string().required("Role ID is required."),
});

//CEDAR
export const cedarSchema = yup.object().shape({
  general_info: yup.object().shape(
    {
      id_number: yup.string().required("ID No is required."),
      last_name: yup.string().required("Last name is required."),
      first_name: yup.string().required("First name is required."),
      middle_name: yup.string(),
      suffix: yup.string(),
    },
    {
      position_info: yup.object().shape({
        position_name: yup.string().required("Position name is required."),
      }),
    }
  ),

  username: yup.string().required("Username is required."),
  role_id: yup.string().required("Role ID is required."),
});

export const changePasswordSchema = yup.object().shape({
  old_password: yup.string().required("Old Password is required."),
  new_password: yup.string().required("New Password is required."),
  confirm_password: yup.string().required("Confirm Password is required."),
  
});
