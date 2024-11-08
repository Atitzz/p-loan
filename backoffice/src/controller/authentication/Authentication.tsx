import { Button, Checkbox, FormControlLabel, InputAdornment, Paper, Stack, TextField, Box, IconButton } from "@mui/material";
import React, { useContext, useState } from "react";
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";

function Authentication() {
  const { AddAlert, setAuth,setRoute,useLang } = useContext(MainContext);
  const {Post,ErrorResponse,MessageResponse} = useContext(HttpContext);
  const {  } = useContext(ToolsContext);
  const [input, setInput] = useState({ username: "", password: "", remember: true });
  const [error, setError] = useState({
    username:true,
    password:true
  })
  const [showPass, setShowPass] = useState(false);
  const onChange = (e) => {
    const { name, value, checked } = e.target;
    setInput(prev => {
      return {
        ...prev,
        [name]: name === "remember" ? checked : value
      }
    })
  }
  const onSubmit = () => {
    Post(`login`,input).then((response) =>{
      setAuth({status:true,...response.data.data});
      AddAlert(MessageResponse(response));
      localStorage.setItem('accessToken', response.data.data.accesstoken);
      let __route = response.data.data.sidebars.reduce((a, b) => a.concat(b.route), []);
      __route = __route.concat(response.data.data.route);
    setRoute(__route)
    }).catch(err =>
      {
        console.log(err)
        setError(prev => {
          if(err.response?.data.data)
            {
              return err.response.data.data
            }
            return prev
        });
        AddAlert(ErrorResponse(err),'error');
      })
 
  }
  const handleClickShowPassword = () => setShowPass((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <React.Fragment>
      <Stack spacing={1} justifyContent="center" alignItems="center" height="90vh">
        <Stack component={Paper} spacing={2} sx={{ p: 5 }} minWidth={'320px'}>
         
          <Box>
            <Box component="strong">{useLang('ผู้ดูแลระบบ','Admin')}</Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <AccountCircle sx={{ mr: 1, my: 0.5 }} />
            <TextField
            required={true}
            error={!error.username}
              id="input-with-sx"
              name="username"
              onChange={onChange}
              label={useLang('ชื่อผู้ใช้งาน','Username')}
              variant="standard"
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <LockIcon sx={{ mr: 1, my: 0.5 }} />
            <TextField
            required={true}
            error={!error.password}
              id="input-with-sx"
              type={showPass ? 'text' : 'password'}
              name="password"
              label={useLang('รหัสผ่าน','Password')}
              onChange={onChange}
              variant="standard"
              sx={{ flex: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Stack direction={"row"} justifyContent={'space-between'}>
            <FormControlLabel
              control={<Checkbox name="remember" checked={input.remember} onChange={onChange} />}
              label={useLang('จดจำผู้ใช้งาน','Remember me')}
              labelPlacement="end"
            />
            {/* <Button variant="text">Forgot?</Button> */}
          </Stack>

          <Button variant="contained" fullWidth onClick={onSubmit}>{useLang('เข้าสู่ระบบ','Login')}</Button>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}

export default Authentication;
