import React from "react";

import { useGetRoleQuery } from "../features/api/roleApi";
import NotFound from "../pages/NotFound";

const AccessPermission = ({ children, permission }) => {
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery({
    pagination: "none",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = roleData?.result?.find((role) => role.id == user.role_id);

  const Access_Permission = role?.access_permission?.includes(permission);

  console.log(Access_Permission);

  if (Access_Permission) {
    return <>{children}</>;
  } else {
    return (
      <>
        <NotFound />
      </>
    );
  }
};

export default AccessPermission;
