import { Box, Collapse } from "@mui/material";
import React from "react";
import "../../styles/SideBar.scss";
import { useDispatch, useSelector } from "react-redux";
import { moduleSchema } from "../../schemas/moduleSchema";
import ModuleNavigations from "./ModuleNavigations";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetRoleQuery } from "../../features/api/roleApi";

const Sidebar = () => {
  const { data: ROLE_DATA, isLoading: isRoleLoading } = useGetRoleQuery({
    pagination: "none",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = ROLE_DATA?.result?.find((role) => role.id == user.role_id);
  const AccessPermission = role?.access_permission;

  console.log({ ROLE_DATA });

  const dispatch = useDispatch();
  const sidebar = useSelector((state) => state.misc.sidebar);
  const modules = moduleSchema;

  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split("/").filter((part) => part);

  const category = pathParts[0];

  return (
    <Box className={sidebar ? "sidebar sidebar-close" : "sidebar sidebar-open"}>
      <Box className="sidebar__header">1</Box>
      <Box className="sidebar__content">
        {modules.map((module, index) => {
          const hasAccessibleSubcategory = module.subCategory?.some((subcat) =>
            AccessPermission?.includes(subcat.name)
          );

          if (module.subCategory && hasAccessibleSubcategory) {
            return (
              <React.Fragment key={index}>
                <ModuleNavigations
                  onClick={() => {
                    navigate(`${module.to}`);
                  }}
                  icon={<module.icon />}
                  name={module.name}
                />
                <Collapse in={category === module.section}>
                  {module.subCategory.map((subcat, subindex) => {
                    if (AccessPermission?.includes(subcat.name)) {
                      return (
                        <Box className="context-subcat" key={subindex}>
                          <ModuleNavigations
                            icon={<subcat.icon />}
                            name={subcat.name}
                            onClick={() => {
                              navigate(`${subcat?.to}`);
                            }}
                          />
                        </Box>
                      );
                    }
                    return null;
                  })}
                </Collapse>
              </React.Fragment>
            );
          } else if (
            !module.subCategory &&
            AccessPermission?.includes(module.name)
          ) {
            return (
              <ModuleNavigations
                key={index}
                onClick={() => {
                  navigate(`${module.to}`);
                }}
                icon={<module.icon />}
                name={module.name}
              />
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
