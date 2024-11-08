import { Box, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'

function Switch({onChange = undefined,
  checked = false,
  name = undefined,
  labels = {
    checked:'Verified',
    unchecked:'Unverified'
}}) {
    const [bool,setBool] = useState(false)
    const onClick = () => {
        setBool(!bool);
        if(onChange)
        onChange({
          target:{
            name,
            value: !bool ? labels.checked : labels.unchecked
          }
        });
    }
    useEffect(()=>{
      setBool(checked)
    },[checked])
  return (
    <Box
    onClick={onClick}
    sx={{
      position: "relative",
      width:'100%',
      bgcolor: bool ? "#28c76f" : "#eb2222",
      height: 30,
      transition: "background-color 0.5s ease",
      borderRadius: 2,
      border: "1px solid #8a8a8a",
      boxShadow: "0px 2px 4px #00000075",
    }}
  >
    <Stack
      sx={{
        height: 30,
        borderRadius: 2,
        "&:hover": {
          bgcolor: "#00000020",
        },
        textAlign: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
          {bool ? labels.checked : labels.unchecked}
      <Box
        sx={{
          position: "absolute",
          left: !bool ? 0 : 'calc(100% - 10px)',
          top: 0,
          zIndex: 9999,
          bgcolor: "#e0e0e0",
          boxShadow: "0px 2px 4px #00000075",
          height: 30,
          width: 10,
          borderRadius: 5,
          transition: "left 0.5s ease",
        }}
      />
    </Stack>
  </Box>
  )
}

export default Switch
