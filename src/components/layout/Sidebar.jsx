import { Box, Button, Collapse } from "@mui/material";
import React, { useState } from "react";
import "../../styles/SideBar.scss";
import { useDispatch, useSelector } from "react-redux";
import { moduleSchema } from "../../schemas/moduleSchema";
import ModuleNavigations from "./ModuleNavigations";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useGetRoleQuery } from "../../features/api/roleApi";

const Sidebar = () => {
  const { data: ROLE_DATA, isLoading: isRoleLoading } = useGetRoleQuery({
    pagination: "none",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = ROLE_DATA?.result?.data?.find((role) => role.id == user.role_id);
  const AccessPermission = role?.access_permission;

  console.log({ AccessPermission });

  const dispatch = useDispatch();
  const sidebar = useSelector((state) => state.misc.sidebar);
  const modules = moduleSchema;

  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split("/").filter((part) => part);

  const category = pathParts[0];
  const subcategory = pathParts[1];

  //console.log({ modules });
  return (
    <Box className={sidebar ? "sidebar sidebar-close" : "sidebar sidebar-open"}>
      <Box className="sidebar__header">1</Box>
      <Box className="sidebar__content">
        {modules.map((module, index) => {
          const hasAccessibleSubcategory = module.subcategory?.some((subcat) =>
            AccessPermission?.includes(subcat.name)
          );

          if (hasAccessibleSubcategory || module.subcat !== null) {
            return (
              <>
                <ModuleNavigations
                  key={index}
                  onClick={() => {
                    navigate(`${module.to}`);
                  }}
                  icon={<module.icon />}
                  name={module.name}
                />

                {module.subcategory && (
                  <Collapse in={category}>
                    {module.subcategory.map((subcat, subindex) => {
                      if (AccessPermission?.includes(subcat.name))
                        return (
                          <Box
                            className="context-subcat"
                            //sx={{ paddingLeft: "2rem" }}
                            key={subindex}
                          >
                            <ModuleNavigations
                              key={subindex}
                              icon={<subcat.icon />}
                              name={subcat.name}
                              onClick={() => {
                                navigate(`${subcat?.to}`);
                              }}
                            />
                          </Box>
                        );
                    })}
                  </Collapse>
                )}
              </>
            );
          }
          return null;
        })}
      </Box>
      <Box className="sidebar__footer">3</Box>
    </Box>
  );
};

export default Sidebar;
