import {
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  InputLabel,
  Paper,
  Stack,
  getContrastRatio,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { icon } from "../json/icon";
import { MainContext } from "@/context/Context";
import logo_asset from "@/assets/logo-1.png";
const mainMenu = [
  {
    name: "Sidebar",
    name_th: "จัดการเมนู",
    icon: "WidgetsIcon",
    route: [
      {
        name: "Route",
        name_th: "เส้นทาง",
        icon: "StarBorder",
        path: "/sidebar/route",
        link: "/sidebar/route",
      },
      {
        name: "Visibility",
        name_th: "การมองเห็น",
        icon: "StarBorder",
        path: "/sidebar/visibility",
        link: "/sidebar/visibility",
      },
    ],
  },
  {
    name: "Logout",
    name_th: "ออกจากระบบ",
    icon: "LogoutIcon",
    route: [
      {
        path: "/logout",
        link: "/logout",
      },
    ],
  },
];
function Sidebar() {
  const { logo, auth, config,useLang } = useContext(MainContext);
  const theme = useTheme();
  const [menus, setMenus] = React.useState<any[]>(mainMenu);
  const [toggle, setToggle] = useState(true);
  const changeToggle = () => setToggle(!toggle);
  useEffect(() => {
    if (auth.status) {
      const data = auth.sidebars;
      if (data && data.length > 0) {
        if (auth.user_role == "user") {
          const join = data.concat([mainMenu[1]]);
          if (data.length) setMenus(join);
        } else {
          const join = data.concat(mainMenu);
          if (data.length) setMenus(join);
        }
      } else {
        if (auth.user_role == "user") setMenus([mainMenu[1]]);
      }
    }
  }, [auth]);

  const [openMap, setOpenMap] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    // ตรวจสอบว่า drawerOpen เป็น false
    if (!toggle) {
      // เมื่อ drawerOpen เป็น false ให้กำหนด setOpenMap เป็น false สำหรับทุกค่าใน openMap
      setOpenMap((prevState) => {
        const newState: { [key: string]: boolean } = {}; // ระบุชนิดข้อมูลของ newState
        for (const key in prevState) {
          newState[key] = false;
        }
        return newState;
      });
    }
  }, [toggle]); // ให้ useEffect ทำงานเมื่อ drawerOpen เปลี่ยนแปลง

  const handleClick = (menuName: string) => {
    setOpenMap((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  return (
    <Stack
      sx={{
        position: "relative",
        width: toggle ? 250 : 54,
        flexShrink: 0,
        transition: "width 0.5s ease",
        "& .MuiDrawer-paper": {
          width: toggle ? 250 : 54,
          transition: "width 0.5s ease",
          boxSizing: "border-box",
        },
      }}
    >
      <Drawer
        anchor="left"
        variant="permanent"
        open={toggle}
        onClose={() => {}}
        sx={{
          width: toggle ? 250 : 54,
          flexShrink: 0,
          transition: "width 0.5s ease",
          "& .MuiDrawer-paper": {
            width: toggle ? 250 : 54,
            transition: "width 0.5s ease",
            boxSizing: "border-box",
          },
        }}
      >
        <List
          sx={{ width: "240px", bgcolor: "transparent" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
              <Box
                sx={{
                  textAlign: "start",
                  my: 6,
                  mx:4
                }}
              >
                <InputLabel
                  sx={{
                    fontSize: 22,
                    color:
                      getContrastRatio(theme.palette.primary.main, "#fff") > 4.5
                        ? "#dfdfdf"
                        : "#333333",
                  }}
                >
                  MONEYFORYOU
                </InputLabel>
                <Divider
                  sx={{
                    bgcolor:
                      getContrastRatio(theme.palette.primary.main, "#fff") > 4.5
                        ? "#dfdfdf"
                        : "#333333",
                  }}
                />
              </Box>
          }
        >
          {menus.map((item, index) => {
            const isActive =
              item.route.length === 1
                ? location.pathname == item.route[0]?.link
                : item?.route &&
                  item.route.some(
                    (subItem) => location.pathname === subItem.link
                  );
            return (
              <React.Fragment key={index}>
                <ListItemButton
                  sx={{
                    bgcolor: isActive
                      ? getContrastRatio(theme.palette.primary.main, "#fff") >
                        4.5
                        ? "#eeeeee25"
                        : "#11111125"
                      : "transperent",
                  }}
                  onClick={() =>
                    item?.route && item.route.length > 1
                      ? handleClick(item.name)
                      : undefined
                  }
                  component={Link}
                  to={
                    item?.route && item.route.length > 1
                      ? "#"
                      : item.route[0]?.link || "#"
                  }
                >
                  <ListItemIcon
                    sx={{
                      color:
                        getContrastRatio(theme.palette.primary.main, "#fff") >
                        4.5
                          ? "#eeeeee90"
                          : "#333333",
                    }}
                  >
                    {icon[item.icon]}
                  </ListItemIcon>
                  <ListItemText primary={useLang(item.name_th,item.name)} />
                  {item?.route && item.route.length > 1 ? (
                    openMap[item.name] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : undefined}
                </ListItemButton>
                {item?.route && item.route.length > 1 && (
                  <Collapse in={openMap[item.name]} timeout={500}>
                    <List component="div" disablePadding>
                      {item.route.map((subItem, subIndex) => {
                        const isSubActive = subItem.link === location.pathname;

                        return (
                          <ListItemButton
                            sx={{
                              pl: toggle ? 11 : 5.5,
                              bgcolor: isSubActive
                                ? getContrastRatio(
                                    theme.palette.primary.main,
                                    "#fff"
                                  ) > 4.5
                                  ? "#eeeeee25"
                                  : "#11111125"
                                : "transperent",
                            }}
                            key={subIndex}
                            component={Link}
                            to={subItem.link}
                          >
                            <ListItemIcon
                              sx={{
                                color:
                                  getContrastRatio(
                                    theme.palette.primary.main,
                                    "#fff"
                                  ) > 4.5
                                    ? "#eeeeee90"
                                    : "#333333",
                              }}
                            >
                              {icon[subItem.icon]}
                            </ListItemIcon>
                            <ListItemText primary={useLang(subItem.name_th,subItem.name)} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Drawer>
      <Box
        sx={{
          position: "fixed",
          left: !toggle ? 20 : 215,
          top: 15,
          zIndex: 9999,
          bgcolor: '#dfdfdf',
          borderRadius: 1,
          transition: "left 0.5s ease",
        }}
      >
        <IconButton  onClick={changeToggle}>
          {toggle ? <Icons.ArrowBackIos /> : <Icons.ArrowForwardIos />}
        </IconButton>
      </Box>
    </Stack>
  );
}

export default Sidebar;
