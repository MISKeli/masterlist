import { Box, Collapse } from "@mui/material";
import React, { useState } from "react";
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

  const dispatch = useDispatch();
  const sidebar = useSelector((state) => state.misc.sidebar);
  const modules = moduleSchema;

  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split("/").filter((part) => part);

  const category = pathParts[0];

  const [hoveredItem, setHoveredItem] = useState("null");

  return (
    <Box className={sidebar ? "sidebar sidebar-close" : "sidebar sidebar-open"}>
      <Box className="sidebar__header">1</Box>
      <Box className="sidebar__content">
        {modules.map((module, index) => {
          const hasAccessibleSubcategory = module.subCategory?.some((subcat) =>
            AccessPermission?.includes(subcat.name)
          );

          const isActive = category === module.section;

          if (module.subCategory && hasAccessibleSubcategory) {
            return (
              <>
                <ModuleNavigations
                  key={index}
                  onClick={() => {
                    navigate(`${module.to}`);
                  }}
                  icon={
                    hoveredItem === module.icon ? (
                      <module.iconOn />
                    ) : (
                      <module.icon />
                    )
                  }
                  name={module.name}
                  selected={isActive}
                  onMouseEnter={() => setHoveredItem(module.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
                <Collapse in={category === module.section}>
                  {module.subCategory.map((subcat, subindex) => {
                    if (AccessPermission?.includes(subcat.name)) {
                      return (
                        <Box
                          className="sidebar__content__subcat"
                          key={subindex}
                        >
                          <ModuleNavigations
                            icon={
                              hoveredItem === subcat.name ? (
                                <subcat.iconOn />
                              ) : (
                                <subcat.icon />
                              )
                            }
                            name={subcat.name}
                            onClick={() => {
                              navigate(`${subcat?.to}`);
                            }}
                            onMouseEnter={() => setHoveredItem(subcat.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            selected={
                              isActive && location.pathname === subcat.to
                            }
                          />
                        </Box>
                      );
                    }
                    return null;
                  })}
                </Collapse>
              </>
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
                icon={
                  hoveredItem === module.name ? (
                    <module.iconOn />
                  ) : (
                    <module.icon />
                  )
                }
                name={module.name}
                selected={isActive}
                onMouseEnter={() => setHoveredItem(module.name)}
                onMouseLeave={() => setHoveredItem(null)}
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
