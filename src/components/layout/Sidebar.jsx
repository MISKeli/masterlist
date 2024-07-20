import { Box, Button, Collapse } from "@mui/material";
import React, { useState } from "react";
import "../../styles/SideBar.scss";
import { useDispatch, useSelector } from "react-redux";
import { moduleSchema } from "../../schemas/moduleSchema";
import ModuleNavigations from "./ModuleNavigations";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
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
              {module.subCategory && (
                <Collapse in={category}>
                  {module.subCategory.map((subcat, subindex) => {
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
        })}
      </Box>
      <Box className="sidebar__footer">3</Box>
    </Box>
  );
};

export default Sidebar;
