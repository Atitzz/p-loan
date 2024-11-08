import { Alert, Fade, Stack } from "@mui/material";
import React, {  useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthType, ContextValueType, HttpContext, MainContext, RouteType, ToolsContext } from "./Context";
import OTPDIalog from "@/controller/authentication/component/OTPDIalog";
import EnterPIN from "@/component/EnterPIN";

function ContextProvider({ children }: { children: React.ReactNode }) {
  const __location = useLocation();
  const {Get,ErrorResponse} = useContext(HttpContext);
  const { } = useContext(ToolsContext);
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
  const [auth, setAuth] = useState<AuthType>({
    status: false,
    remember: false,
    employee_id: "",
    fullname: "",
    username: "",
    sidebars:[],
    user_role:"user",
    mobile:"XXX-XXX-XXXX",
    sv:'unverified'
  });
  const [lang,setLang] = useState("th");
  const [pinActive,setPinActive] = useState(false);
  const AlertPopup = ({ msg, variant, index }: { msg: string; variant: any; index: string }) => {
    setTimeout(() => {
      setAlert((prev) => prev.filter((x) => x.index !== index));
    }, 3000);
    return (
      <Fade key={index} in={true} timeout={750}>
        <Alert variant='filled' severity={variant}>{msg}</Alert>
      </Fade>
    );
  };
  const [privacy,setPrivacy] = useState({version:'0.0',message:''})
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
    AddAlert: (msg: string, variant: string = "success") => {
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
    privacy,
    setPrivacy
  };



  const getCurrent = () =>{
    Get(`current`).then((response) =>{
      setAuth({status:true,...response.data.data});
      const pin = sessionStorage.getItem('pin');
      if(response.data.data.pa == 'enable')
        if(!pin)
        setPinActive(true);
    }).catch(err => {
      const __token = localStorage.getItem("accessToken")
      if (!redirect && __token) {
        localStorage.removeItem("accessToken")
        setRedirect(true);
        navigate("/");
      }
      console.log(ErrorResponse(err),'error');
    })
  }
  useEffect(() => {
    const params = __location.pathname.split("/");
    if(params[1] != "payment")
    {
      getCurrent();
      const __lang = localStorage.getItem('lang')
      setLang(__lang||'th');
     
      Get("policy").then((resoinse) => {
        setPrivacy(resoinse.data.data);
      });
    }
  
  }, []);


  return (
    <MainContext.Provider value={contextValue}>
      {
        auth.status && auth.sv == "unverified" && <OTPDIalog open={true} />
      }
 <EnterPIN open={pinActive} onClose={()=>setPinActive(false)} />
      <React.Fragment>
        <Stack
          sx={{
            position: "fixed",
            top: 10,
            right: 10,
            width: '100vw',
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