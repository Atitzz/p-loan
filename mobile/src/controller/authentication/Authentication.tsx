import {
  Button,
  Stack,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { useNavigate } from "react-router-dom";
import MobileBody from "@/component/MobileBody";
import Privacy from "@/component/Privacy";
import OTPDIalog from "./component/OTPDIalog";
const textFieldStyles = {
  flex: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
    "&.Mui-focused fieldset": {
      borderColor: "#D2720DD9",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D2720DD9",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D2720DD9",
  },
};

const digitOnly = /^\d+$/;
function Authentication() {
  const { AddAlert, setAuth } = useContext(MainContext);
  const { Post, ErrorResponse, MessageResponse } = useContext(HttpContext);
  const {} = useContext(ToolsContext);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    mobile: "",
    password: "",
    remember: true,
  });
  const [error, setError] = useState({
    mobile: true,
    password: true,
  });
  const isValidate = (e) =>{
    if(e.target.name == 'mobile' ){
      if (digitOnly.test(e.target.value))
      return true;
    return false;
    }
    else 
    return true;
  }
  const onChange = (e) => {
    const __validate = isValidate(e)
    if(!__validate) return;
    const { name, value, checked } = e.target;
    setInput((prev) => {
      return {
        ...prev,
        [name]: name === "remember" ? checked : value,
      };
    });
  };
  const onSubmit = () => {
    Post(`login`, input)
      .then((response) => {
        setAuth({ status: true, ...response.data.data });
        AddAlert(MessageResponse(response));
        localStorage.setItem("accessToken", response.data.data.accesstoken);
        
      })
      .catch((err) => {
        console.log(err);
        setError((prev) => {
          if (err.response?.data.system_response.status === 900) {
            navigate(err.response.data.data.url)
          }
          if (err.response?.data.data) {
            return err.response.data.data;
          }
          return prev;
        });
        AddAlert(ErrorResponse(err), "error");
      });
  };

  const [open, setOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [accept, setAccept] = useState(true);
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setButtonDisabled(false);
    }
  };

  const onAccept = () => {
    setAccept(false);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      {/* <OTPDIalog open={true}/> */}
      <Privacy open={open} onClose={handleClose} onSubmit={onAccept}/>
     
      <MobileBody>
        <Stack sx={{flex:1,justifyContent:'space-around'}}>
        <Stack gap={2} sx={{ p: 5}}>
          <Typography variant="h4" fontWeight={700}>
            เข้าสู่ระบบ
          </Typography>
          <Box>
            <Typography variant="body1" textAlign={"start"} sx={{ ml: 2 }}>
              เบอร์โทรศัพท์ <span style={{color:'#eb0000'}}>*</span>
            </Typography>
            <TextField
              fullWidth
              required={true}
              error={!error.mobile}
              id="input-with-sx"
              name="mobile"
              size="small"
              value={input.mobile}
              onChange={onChange}
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box>
            <Typography variant="body1" textAlign={"start"} sx={{ ml: 2 }}>
              รหัสผ่าน  <span style={{color:'#eb0000'}}>*</span>
            </Typography>
            <TextField
              required={true}
              error={!error.password}
              id="input-with-sx"
              type="password"
              name="password"
              size="small"
              value={input.password}
              onChange={onChange}
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }}
            
            />
          </Box>
          <Stack direction={"row"} justifyContent={"flex-end"}>
            {/* <Button variant="text">ลืมรหัสผ่าน?</Button> */}
          </Stack>
          <Stack gap={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={onSubmit}
              sx={{
                py: 0.75,
                px: 1.5,
                borderRadius: "25px",
                fontSize: "18px",
                bgcolor: "#000",
              }}
            >
              เข้าสู่ระบบ
            </Button>
            {/* <Button
              component="a"
              fullWidth
              variant="contained"
              href={`${import.meta.env.VITE_BASE}/login`}
              sx={{
                py: 0.75,
                px: 1.5,
                borderRadius: "25px",
                fontSize: "18px",
                bgcolor: "#06c755",
              }}
            >
              LINE LOGIN
            </Button> */}
          </Stack>
          {/* <Stack gap={1} sx={{ my: 2 }}>
            <Button fullWidth sx={{ color: "#000" }} onClick={()=>navigate('/signup')}>
              ยังไม่ได้เป็นสมาชิก? สมัครใช้งาน
            </Button>
          </Stack> */}
        </Stack>
        <Stack gap={1}>
          <Stack direction="row" gap={1} sx={{ justifyContent: "center" }}>
              <Typography variant="subtitle2">
                นโยบายการรักษาความปลอดภัยของข้อมูล
              </Typography>
              <Button
                onClick={handleOpen}
                sx={{
                  color: "var(--color1)",
                  fontWeight: 700,
                  padding: 0,
                  minWidth: 0,
                }}
              >
                &nbsp;อ่านต่อ
              </Button>
            </Stack>
            <Stack direction="row" gap={1} sx={{ justifyContent: "center" }}>
              <Typography variant="subtitle2">
                ศึกษารายละเอียดเพิ่มเติมเกี่ยวกับ&nbsp;..............&nbsp;
              </Typography>
              <Button
                onClick={handleOpen}
                sx={{
                  color: "var(--color1)",
                  fontWeight: 700,
                  padding: 0,
                  minWidth: 0,
                }}
              >
                &nbsp;ที่นี่
              </Button>
            </Stack>
          </Stack>
          </Stack>
      </MobileBody>
    </React.Fragment>
  );
}

export default Authentication;
