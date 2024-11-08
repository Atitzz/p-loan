import { HttpContext, MainContext, ToolsContext } from '@/context/Context';
import { Box, Button, IconButton, Stack } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Icons from '@mui/icons-material'
const defaultInput = {
    name:"",
    base64:""
}
function FileManager() {
    const navigate = useNavigate();
    const { AddAlert } = useContext(MainContext);
    const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
      useContext(HttpContext);
      const { toDate,toTHB } =
      useContext(ToolsContext);
      const [files,setFile] = useState([]);
      const [input,setInput] = useState(defaultInput)
      useEffect(()=>{
        Get(`system/file`).then(response =>
            {
                setFile(response.data.data);
            })
      },[])

      
  return (
    <Stack spacing={2}>
     <Stack direction="row" sx={{justifyContent:"space-between",alignItems:'center'}}>
        <Box component="h3" sx={{ m: 1, textAlign: "center" }}>
           File Manager
          </Box>
          <Button variant='contained'  sx={{ m: 1, textAlign: "center" }}>
           Create
          </Button>
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
          {files.map(file =>
            <Stack sx={{textAlign:'center',position:'relative',cursor:'pointer','&:hover':{
                textShadow:'1px 1px 5px rgba(1,255,255,1)'
            }}}>
                <Box sx={{m:4}}>
                <Box component='img' src={file.base64} sx={{width:200,height:'auto'}}/>
                </Box>
           
            <Box component="h4" sx={{mt:-4}}>{file.name}</Box>
            <IconButton color='error' sx={{position:"absolute",top:0,right:-15}}>
            <Icons.Cancel/>
            </IconButton>
          
            </Stack>
        )}
          </Stack>
    </Stack>
  )
}

export default FileManager
