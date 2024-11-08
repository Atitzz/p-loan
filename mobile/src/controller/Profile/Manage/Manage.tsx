import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Avatar,
    IconButton,
  } from "@mui/material";
  import { Link, useNavigate } from "react-router-dom";
  import { useContext, useState } from "react";
import EnterPIN from "@/component/EnterPIN";
import { HttpContext, MainContext } from "@/context/Context";
import { styled } from "@mui/system";
  
const ProfileHeader = styled(Box)(({ theme }) => ({
    backgroundColor: 'var(--color1)',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#fff',
  }));
  
function Manage() {
 const {auth,setAuth,AddAlert}:any = useContext(MainContext);
 const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
      useContext(HttpContext);
 const navigate = useNavigate();
 const [password, setPassword] = useState('');
 const [errors, setErrors] = useState({password:true});
 const onEnter = () =>{
    Post(`set/password`, {password})
    .then((response) => {
      AddAlert(MessageResponse(response), "info");
      navigate(-1)
    })
    .catch((error) => {
      AddAlert(ErrorResponse(error), "error");
      if (error?.response?.data) setErrors(error.response.data.data);
    });
 }
 return (
    <>
        <ProfileHeader>
          <IconButton >
            <Avatar
              alt="User Profile"
              src={auth?.picture_url ? auth.picture_url : ""}
              sx={{ width: 100, height: 100, margin: '0 auto' }}
            />
          </IconButton>
          <Box mb={3}>
            <Typography variant="h6" color={'#000000A8'}>{auth.display_name}</Typography>
            <Typography variant="body2" color={'#000000A8'}>{auth.mobile}</Typography>
          </Box>
        </ProfileHeader>
        <Container>
     <Stack sx={{gap:2,my:5}}>
     <TextField size="small" error={!errors.password} placeholder="รหัสผ่าน..." value={password} onChange={e=>setPassword(e.target.value)}/>
     <Button sx={{ mt: 3 }} className="btn-1" onClick={onEnter}>
          ยืนยัน
        </Button>
        </Stack>
    </Container>
    </>
    
  );
}


export default Manage
