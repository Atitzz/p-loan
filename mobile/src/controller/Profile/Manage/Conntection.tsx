import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
  } from "@mui/material";
  import { Link, useNavigate } from "react-router-dom";
  import { useContext, useState } from "react";
import EnterPIN from "@/component/EnterPIN";
import { HttpContext, MainContext } from "@/context/Context";
  

function Conntection() {
 const {auth,setAuth,AddAlert}:any = useContext(MainContext);
 const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
      useContext(HttpContext);
 const navigate = useNavigate();
 const LineConnect = async () => {
   try {
    if(auth?.la == "enable")
       {
        const response = await Get("line/revoke");
        AddAlert(response)
        localStorage.removeItem("accessToken");
        setAuth(prev => { return {...prev,status:false}})
        return navigate('/');
       }
     const response = await Get("line/connect");
       window.location.href = response.data.data.url;
     
   } catch (err) {
     console.log("Line Connect Error:", err);
   }
 };

 const [pinState,setPinState] = useState(false);
 return (
    <Container>
      <EnterPIN open={pinState} onClose={()=>setPinState(false)}/>
      <Box pt={5} textAlign={"start"}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", textAlign: "start" }}
      >
        <Typography variant="body1" sx={{ py: 1 }}>
         เชื่อมต่อ Line
        </Typography>
        <Typography
          onClick={()=>LineConnect()}
          variant="body1"
          fontWeight={600}
          sx={{ color: "#3399ff", cursor: "pointer", p: 1 }}
        >
           {auth?.la == 'enable' ? `เชื่อมต่อแล้ว` :  `เชื่อมต่อ`}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", textAlign: "start" }}
      >
        <Typography variant="body1" sx={{ py: 1 }}>
        เชื่อมต่อ Email
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: "#3399ff", p: 1 }}
        >
            {auth?.ev == 'verified' ? `เชื่อมต่อแล้ว` :  `เชื่อมต่อ`}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", textAlign: "start" }}
      >
        <Typography variant="body1" sx={{ py: 1 }}>
        เชื่อมต่อ เบอร์โทร
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: "#3399ff", cursor: "pointer", p: 1 }}
        >
           {auth?.sv == 'verified' ? `เชื่อมต่อแล้ว` :  `เชื่อมต่อ`}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", textAlign: "start" }}
      >
        <Typography variant="body1" sx={{ py: 1 }}>
       ยืนยันตัวตน KYC
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: "#3399ff", cursor: "pointer", p: 1 }}
        >
           {auth?.kyc == 'verified' ? `สำเร็จ` :  `รอดำเนินการ`}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", textAlign: "start" }}
      >
        <Typography variant="body1" sx={{ py: 1 }}>
       เปิดใช้งาน 2FA
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: "#3399ff", cursor: "pointer", p: 1 }}
        >
           {auth?.tf == 'enable' ? `เปิดการใช้งาน` :  `ปิดการใช้งาน`}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", textAlign: "start" }}
      >
        <Typography variant="body1" sx={{ py: 1 }}>
       เปิดใช้งาน PIN
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: "#3399ff", cursor: "pointer", p: 1 }}
          onClick={()=>setPinState(true)}
        >
           {auth?.pa == 'enable' ? `เปิดการใช้งาน` :  `ปิดการใช้งาน`}
        </Typography>
      </Stack>
        <Button sx={{ mt: 3 }} className="btn-1" component={Link} to="/">
          ออกจากระบบ
        </Button>
      </Box>
    </Container>
  );
}

export default Conntection
