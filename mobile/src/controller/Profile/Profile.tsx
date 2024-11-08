import React, { useContext, useRef } from 'react';
import { Box, Typography, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

import { HttpContext, MainContext, ToolsContext } from '@/context/Context';
import MenuListItem from '@/component/MenuListItem';
const ProfileHeader = styled(Box)(({ theme }) => ({
  backgroundColor: 'var(--color1)',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: '#fff',
}));

const ProfileDetails = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  marginBottom: theme.spacing(1),
  borderRadius: '0 0 10px 10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ActionButton = styled(Button)(() => ({
  color: '#fff',
  backgroundColor: '#000',
  '&:hover': {
    backgroundColor: '#333',
  },
  borderRadius: '25px'
}));

const menu = [
  { title: "ตั้งรหัสผ่าน", path: "manage" },
  { title: "ตั้งรหัส PIN", path: "pin" },
  // { title: "ประวัติสินเชื่อของฉัน", path: "history" },
  { title: "นโยบายความเป็นส่วนตัว", path: 'https://www.moneyforyou.co.th/privacy-policy' },
  { title: "เงื่อนไขการใช้บริการ", path: 'https://www.moneyforyou.co.th/terms-conditions' },
  // { title: "แพคเกจคูปอง", path: 'coupon' },
  // { title: "ตั้งค่าแจ้งเตือน", path: 'notifications' },
  { title: "คำถามพบบ่อย", path: 'https://www.moneyforyou.co.th/fag' },
  { title: "ติดต่อเรา", path: 'https://www.moneyforyou.co.th/contact' },
  { title: "เกี่ยวกับ", path: 'https://www.moneyforyou.co.th/about-us' }
];

function Profile() {
    
    const {auth} = useContext(MainContext);
    const { Get } =
    useContext(HttpContext);
    const logout = async () => {
      try {
        await Get("logout");
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const fileInputRef = useRef(null);
  
    const handleMenuItemClick = () => {
      fileInputRef.current.click();
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log('Selected file:', file);
        // คุณสามารถเพิ่มฟังก์ชันการจัดการไฟล์ที่นี่
      }
    };
  
    return (
      <>
        <ProfileHeader>
          <IconButton onClick={handleClick}>
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
  
        {/* <ProfileDetails>
          <Box textAlign={'start'}>
            <Typography variant="body2" >บัญชีผู้ใช้: {auth.username}</Typography>
            <Typography variant="body2" >โทรศัพท์: {auth.mobile}</Typography>
            <Typography variant="body2" >อีเมบ: {auth.email}</Typography>
          </Box>
  
          <ActionButton variant="contained">ชำระเงิน</ActionButton>
        </ProfileDetails> */}
        <Box sx={{p:1}}/>
        <MenuListItem data={menu} />
        <Box sx={{m:2}}>
        <Button
            onClick={logout}
            variant="contained"
            fullWidth
            sx={{
              py: 0.75,
              px: 1.5,
              borderRadius: "25px",
              fontSize: "18px",
              bgcolor: "#000",
            }}
          >
            ออกจากระบบ
          </Button>
        </Box>
       
      </>
    )
}

export default Profile
