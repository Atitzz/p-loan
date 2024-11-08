import {
  Badge,
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
import { HttpContext, MainContext } from "@/context/Context";
import icon_1 from "@/assets/icon-1.png";
import io from "socket.io-client";
const mainMenu = [
  {
    name: "Sidebar",
    name_th: "จัดการเมนู",
    icon: "WidgetsIcon",
    badge: "false",
    badge_param: "",
    route: [
      {
        name: "Route",
        name_th: "เส้นทาง",
        icon: "StarBorder",
        path: "/sidebar/route",
        link: "/sidebar/route",
        badge: "false",
        badge_param: "",
      },
      {
        name: "Visibility",
        name_th: "การมองเห็น",
        icon: "StarBorder",
        path: "/sidebar/visibility",
        link: "/sidebar/visibility",
        badge: "false",
        badge_param: "",
      },
    ],
  },
  {
    name: "Logout",
    name_th: "ออกจากระบบ",
    icon: "LogoutIcon",
    badge: "false",
    badge_param: "",
    route: [
      {
        path: "/logout",
        link: "/logout",
      },
    ],
  },
];
function Sidebar() {
  const { auth, config, useLang,badge, setBadge } = useContext(MainContext);
  const { Get } = useContext(HttpContext);
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
      Get(`badge`).then((response) => {
        setBadge(response.data.data);
      });
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

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET);

    newSocket.on("message", (event) => {
      console.log(event);
    });
    newSocket.on("loans", (event) => {
      setBadge((prev) => {
        return { ...prev, loans: event.action, loan_new: event.action };
      });
    });

    newSocket.on("user_kyc_pending", (event) => {
      setBadge((prev) => {
        return { ...prev, users: event.action, user_kyc_pending: event.action };
      });
    });

    newSocket.on("user_kyc_pending", (event) => {
      setBadge((prev) => {
        return { ...prev, users: event.action, user_kyc_pending: event.action };
      });
    });

    newSocket.on("loan_apply_now", (event) => {
      setBadge((prev) => {
        return { ...prev, users: event.action, user_kyc_pending: event.action };
      });
    });

    newSocket.on("contact_us", (event) => {
      setBadge((prev) => {
        return { ...prev, users: event.action, user_kyc_pending: event.action };
      });
    });
    return () => {
      newSocket.close();
    };
  }, []);
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
                mx: 4,
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box component="img" src={icon_1} height={22} />
                {/* <Box component='img' src={logo} height={15}/> */}
                <InputLabel
                  sx={{
                    fontSize: 18,
                    color:
                      getContrastRatio(theme.palette.primary.main, "#fff") > 4.5
                        ? "#dfdfdf"
                        : "#333333",
                  }}
                >
                  {useLang("บริษัท มันนี่ฟอร์ยู จำกัด", "MONEY FOR YOU")}
                </InputLabel>
              </Stack>

              {/* <InputLabel
                  sx={{
                    fontSize: 22,
                    color:
                      getContrastRatio(theme.palette.primary.main, "#fff") > 4.5
                        ? "#dfdfdf"
                        : "#333333",
                  }}
                >
                  MONEYFORYOU
                </InputLabel> */}
              {/* <Divider
                  sx={{
                    bgcolor:
                      getContrastRatio(theme.palette.primary.main, "#fff") > 4.5
                        ? "#dfdfdf"
                        : "#333333",
                  }}
                /> */}
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

                  <ListItemText primary={useLang(item.name_th, item.name)} />

                  <Badge
                    color="secondary"
                    variant="dot"
                    invisible={
                      !(item.badge === "true" && badge[item.badge_param] > 0)
                    }
                  >
                    {item?.route && item.route.length > 1 ? (
                      openMap[item.name] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : undefined}
                  </Badge>
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

                            <Badge
                              color="secondary"
                              variant="dot"
                              invisible={
                                !(
                                  subItem.badge === "true" &&
                                  badge[subItem.badge_param] > 0
                                )
                              }
                            >
                              <ListItemText
                                primary={useLang(subItem.name_th, subItem.name)}
                              />
                            </Badge>
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
        <Box
          sx={{
            position: "fixed",
            left: !toggle ? 20 : 215,
            top: 15,
            bgcolor: "#dfdfdf",
            borderRadius: 1,
            transition: "left 0.5s ease",
          }}
        >
          <IconButton onClick={changeToggle}>
            {toggle ? <Icons.ArrowBackIos /> : <Icons.ArrowForwardIos />}
          </IconButton>
        </Box>
      </Drawer>
    </Stack>
  );
}

export default Sidebar;
