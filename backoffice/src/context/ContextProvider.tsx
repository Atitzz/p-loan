import { Alert, Fade, Stack } from "@mui/material";
import React, {  useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthType, ContextValueType, HttpContext, MainContext, RouteType, ToolsContext } from "./Context";
import { routeDict } from "@/_layout/json/routes";

function ContextProvider({ children }: { children: React.ReactNode }) {
  const {Get,ErrorResponse} = useContext(HttpContext);
  const { } = useContext(ToolsContext);
  const __location = useLocation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<any[]>([]);
  const [redirect, setRedirect] = useState(false);
  const [ThemePrimary, setThemePrimary] = useState("#071251"); //071251
  const [config, setConfig] = useState({
    hospital_name: "",
    tel: "",
    tax_id: "",
    address: "",
  });
  const [logo, setLogo] = useState({
    preview: "",
    data: null,
    name: "",
  });
  const [component, setComponent] = useState<any[]>([]);
  const [dataRoute, setRoute] = useState<RouteType[]>([]);
  const [auth, setAuth] = useState<any>({
    status: false,
    remember: false,
    employee_id: "",
    fullname: "",
    username: "",
    sidebars:[],
    user_role:"user"
  });

  const [badge, setBadge] = useState({
    loans: 0,
    users: 0,
    loan_new: 0,
    loan_due: 0,
    user_mobile_unverfied: 0,
    user_kyc_unverfied: 0,
    user_kyc_pending: 0,
    loan_apply_now: 0,
    contact_us: 0,
  });
  const [lang,setLang] = useState("th");
  const AlertPopup = ({ msg, variant, index }: { msg: string; variant: any; index: string }) => {
    setTimeout(() => {
      setAlert((prev) => prev.filter((x) => x.index !== index));
    }, 3000);
    return (
      <Fade key={index} in={true} timeout={750}>
        <Alert variant="filled" severity={variant}>{msg}</Alert>
      </Fade>
    );
  };

  const contextValue: ContextValueType = {
    ThemePrimary,
    setThemePrimary,
    auth,
    setAuth,
    config,
    setConfig,
    logo,
    setLogo,
    component,
    setComponent,
    dataRoute,
    setRoute,
    AddAlert: (msg: string, variant: string = "info") => {
      const index = uuidv4();
      setAlert((prev) => [...prev, { index, func: AlertPopup({ msg, variant, index }) }]);
    },
    lang,
    setLanguage: (text: string) => {
      setLang(text);
      localStorage.setItem('lang', text);
    },
    useLang: (a:string,b?:string) =>{
      if(lang == "th")
        return a;
      else if (!b)
        return a;
      return b
    },
    badge,
    setBadge,
  };



  const getCurrent = () =>{
    const params = __location.pathname.split("/");
    if(params[1] != "payment")
    Get(`current`).then((response) =>{
      setAuth({status:true,...response.data.data});
      let __route = response.data.data.sidebars.reduce((a, b) => a.concat(b.route), []);
      __route = __route.concat(response.data.data.route);
      setRoute(__route);
      console.log("welcome");
    }).catch(err => {
      if (!redirect) {
        setRedirect(true);
        navigate("/");
      }
      console.log(ErrorResponse(err),'error');
    })
  }
  useEffect(() => {
    getCurrent();
    const __lang = localStorage.getItem('lang')
    setLang(__lang||'th');
  }, []);

  useEffect(() => {
    if(!auth.status) return;
    const getComponent = Object.entries(routeDict).map(([key]) => {
      return key;
    });
    setComponent(getComponent);
  }, [auth]);

  return (
    <MainContext.Provider value={contextValue}>
      <React.Fragment>
        <Stack
          sx={{
            position: "fixed",
            top: 10,
            right: 10,
            width: 400,
            zIndex: 9999999999,
          }}
          spacing={1}
        >
          {alert.map((d) => d.func)}
        </Stack>
        {children}
      </React.Fragment>
    </MainContext.Provider>
  );
}

export default ContextProvider;