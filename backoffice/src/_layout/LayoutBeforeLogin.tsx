import  { useContext, useEffect, useState } from "react";
import {  Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Popover,
  Stack,
  TextField,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { MainContext } from "@/context/Context";
import { icon } from "./json/icon";

function LayoutBeforeLogin() {
  const { auth, lang, setLanguage, useLang }: any = useContext(MainContext);
  const [routes,setRoutes] = useState([]);
  const navigate = useNavigate();
  // const [calendarEl, setCalendarEl] = useState<HTMLButtonElement | null>(null);
  // const calendarClick = (event) => setCalendarEl(event.currentTarget);
  // const calendarClose = () => setCalendarEl(null);
  // const openCalendar = Boolean(calendarEl);

  const [languageEl, setLanguageEl] = useState<HTMLButtonElement | null>(null);
  const languageClick = (event) => setLanguageEl(event.currentTarget);
  const languageClose = () => setLanguageEl(null);
  const openLanguage = Boolean(languageEl);

  useEffect(()=>{
    const __routes = auth.sidebars.reduce((a,b)=>{
      return a.concat(b.route);
    },[])
    setRoutes(__routes);
  },[]);

  const onSearch = (value) =>{
   
   const result = routes.find(x => useLang(x.name_th,x.name) === value);
   navigate(result.link)
  }
  return (
    <Stack
    //  onContextMenu={(e) => e.preventDefault()}
     >
      <Stack direction="row" sx={{ flex: 1 }}>
        <Box component="div">
          <Sidebar />
        </Box>
        <Stack spacing={2} sx={{ flex: 1, textAlign: "left" }}>
          <AppBar
            elevation={0}
            sx={{ bgcolor: "#f5f5f5", border: 0, py: 2 }}
            position="sticky"
          >
            <Stack direction="row" justifyContent="space-between">
              <Stack id="start" direction="row" alignItems="center" spacing={2} sx={{flex:1}}>
                <Box sx={{width:300}}>
              <Autocomplete
                size="small"
                freeSolo
                fullWidth
                disableClearable
                options={routes.map((option) => `${useLang(option.name_th,option.name)}`)}
                // onInputChange={(_, value) => SearchChange(value)}
                onChange={(_, newValue) => {
                  onSearch(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={useLang('Hotkey','Hotkey')}
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
              />
              </Box>
                {/* <TextField
                  size="small"
                  placeholder="Search..."
                  // value={searchText}
                  // onChange={onSearch}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        {icon["SearchIcon"]}
                      </InputAdornment>
                    ),
                  }}
                /> */}
                {/* <Stack>
                  <InputLabel>
                    {all_branch.find((x) => x.id == auth.branchid)?.name ||
                      "ไม่พบสาขา"}
                  </InputLabel>
                </Stack> */}
              </Stack>
              <Stack id="end" direction="row" spacing={2}>
                {String(import.meta.env.VITE_LANG).toLowerCase() == "true" && (
                  <Stack component={Paper} justifyContent="center">
                    <Button component="label" onClick={languageClick}>
                      {lang == "th" ? (
                        <img
                          alt="THAILAND"
                          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/TH.svg"
                          width={30}
                          height={20}
                        />
                      ) : (
                        <img
                          alt="United States"
                          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
                          width={30}
                          height={20}
                        />
                      )}
                    </Button>
                    <Popover
                      open={openLanguage}
                      anchorEl={languageEl}
                      onClose={languageClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Stack>
                        <Button component="label" onClick={() => setLanguage("th")}>
                          <img
                            alt="THAILAND"
                            src="http://purecatamphetamine.github.io/country-flag-icons/3x2/TH.svg"
                            width={30}
                            height={20}
                          />
                        </Button>
                        <Button component="label" onClick={() => setLanguage("en")}>
                          <img
                            alt="United States"
                            src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
                            width={30}
                            height={20}
                          />
                        </Button>
                      </Stack>
                    </Popover>
                  </Stack>
                )}
                {/* <Stack component={Paper} justifyContent="center">
                  <IconButton onClick={calendarClick}>
                    <CalendarMonthOutlinedIcon />
                  </IconButton>
                  <Popover
                    open={openCalendar}
                    anchorEl={calendarEl}
                    onClose={calendarClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <DateCalendar />
                  </Popover>
                </Stack> */}

                {/* <Stack component={Paper} justifyContent="center">
                  <IconButton>
                    <NotificationsNoneOutlinedIcon />
                  </IconButton>
                </Stack> */}
                {/* <Stack component={Paper} justifyContent="center">
                  <IconButton >
                    <Settings />
                  </IconButton>
                </Stack> */}
                <Stack component={Paper} justifyContent="center">
                  <IconButton onClick={() => navigate("/logout")}>
                    <Logout />
                  </IconButton>
                </Stack>
                {/* <Stack textAlign="end">
                  <InputLabel sx={{ color: "#1976d2" }}>{auth.fullname}</InputLabel>
                  <InputLabel>{auth.role || "user"}</InputLabel>
                </Stack> */}

                <Avatar>H</Avatar>
              </Stack>
            </Stack>
          </AppBar>
          <Stack component="body" sx={{maxWidth:'calc(100vw - 280px)'}}>
            <Outlet />
          </Stack>

          <Stack component="footer" textAlign="center">
            {/* <InputLabel>
              Copyright © 2024{" "}
              {
                <Box
                  component="a"
                  target="_blank"
                  // href="https://www.musion.co.th/"
                >
                  {" "}
                  Feverly Co.,Ltd.
                </Box>
              }{" "}
              ,All rights reserved.
            </InputLabel> */}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default LayoutBeforeLogin;
