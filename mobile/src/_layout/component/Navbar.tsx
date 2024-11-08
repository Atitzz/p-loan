import { MainContext } from '@/context/Context';
import { BottomNavigation, BottomNavigationAction, Box, Container, CssBaseline, IconButton, Paper } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Home from '../../assets/img/home-icon.png'
import Profile from '../../assets/img/profile-icon.png'
import * as Icons  from '@mui/icons-material';
function Navbar() {
    const { auth } = useContext(MainContext);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
  return (
    <Container sx={{ pt: 10 }}>
            <CssBaseline />
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={0}>
                <BottomNavigation
                    showLabels
                    value={activeIndex}
                    onChange={(_, newValue) => {
                        // Update the active index when a navigation item is clicked
                        setActiveIndex(newValue);
                    }}
                    sx={{ backgroundColor: '#000',display:'flex',justifyContent:'space-evenly' }}
                > <IconButton onClick={()=>navigate(-1)} sx={{color:'#fff'}}><Icons.Reply sx={{fontSize:34}}/></IconButton>
                      <IconButton onClick={()=>window.location.href = '/'} sx={{color: '#fff'}}><Icons.Home sx={{fontSize:34}}/></IconButton>
                      <IconButton onClick={()=>navigate('profile')} sx={{color: '#fff'}}><Icons.Person sx={{fontSize:34}}/></IconButton>
                  
                </BottomNavigation>
            </Paper>
        </Container>
  )
}

export default Navbar
