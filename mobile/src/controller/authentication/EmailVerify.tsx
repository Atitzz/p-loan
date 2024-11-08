import { HttpContext } from '@/context/Context';
import { Box, Button, InputLabel, Paper, Stack, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EmailVerify() {
    const {Get,ErrorResponse,MessageResponse} = useContext(HttpContext);
  const {token} = useParams();
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  useEffect(()=>{
    if(token)
    {
        console.log(token)
        Get(`readmail?token=${token}`).then(response => {
            setEmail(response.data.data.email)
            MessageResponse(response);
        }).catch(error => {ErrorResponse(error);})
    }else
        
    return navigate('/')
  },[token])
  return (
    <Stack spacing={4} sx={{justifyContent:"center",alignItems:"center",height:"80vh"}}>
      <Stack component={Paper} spacing={2} sx={{ p: 5 }} width={'500px'}>
        <Box component='h2'>Email Verification</Box>
        <Box component='span' sx={{textAlign:'start'}}>
        For added security, you'll need to verify your identity. We've sent a verification code to {email}
        </Box>
        <Box sx={{textAlign:'start'}}>
        <InputLabel>Verification code</InputLabel>
        <TextField size='small' fullWidth/>
        </Box>
        <Button variant='contained'>Verify Code</Button>
      </Stack>
    </Stack>
  )
}

export default EmailVerify
