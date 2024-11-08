import  {  useContext, useEffect, useState } from "react";
import {  Outlet, useNavigate } from "react-router-dom";
import {
  Box,
} from "@mui/material";
import { HttpContext, MainContext } from "@/context/Context";
import Navbar from "./component/Navbar";
import Privacy from "@/component/Privacy";
// import CookieConsent from "@/component/CookieConsent";

function LayoutAfterLogin() {
  const { auth, setAuth,privacy,AddAlert }: any = useContext(MainContext);
  // const [routes,setRoutes] = useState([]);
  // const navigate = useNavigate();
  const { Post, ErrorResponse } = useContext(HttpContext);
  
  const [open,setOpen] = useState(false);
  useEffect(()=>{
    if(auth.accept_privacy != privacy.version)
      setOpen(true)
  },[auth])

  const onSubmit = () =>{
    setOpen(false);
    Post(`accept/privacy`,{version: privacy.version})
    .then(() => {
      setAuth({ ...auth, accept_privacy :privacy.version });
    })
    .catch((err) => {
      console.log(err);
    
      AddAlert(ErrorResponse(err), "error");
    });
  }
  return (
    <Box>
    <Outlet />
    <Privacy open={open} onClose={()=>setOpen(false)} onSubmit={onSubmit}/>
    <Navbar/>
   
    {/* <CookieConsent/> */}
  </Box>
  );
}

export default LayoutAfterLogin;
