import { CameraAlt, FlipCameraAndroid, Reply } from '@mui/icons-material';
import { Box, Button, IconButton, Stack } from '@mui/material';
import React, { useRef, useState } from 'react'
import { Camera } from 'react-camera-pro';

function TakePhoto({ onBack, onTake,facingMode='user' }) {
    const camera = useRef(null);
   
    const [numberOfCameras, setNumberOfCameras] = useState(0);
    const takePhoto = () => {
    if (camera.current) {
      try {
        const photo = camera.current.takePhoto();
        onTake(photo);
        
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  return (
    <div>
        <div>
      <Camera ref={camera} facingMode='environment' numberOfCamerasCallback={setNumberOfCameras} />
     
    </div>
    <Stack direction='row' sx={{position:'fixed',bottom:0,left:0,bgcolor:'#000',width:'100vw',height:56,justifyContent:'space-around',alignItems:'center'}}>
    <IconButton sx={{color:'#fff'}} onClick={onBack} >
            <Reply sx={{fontSize:40}}/>
          </IconButton>
          <IconButton sx={{color:'#fff'}} onClick={takePhoto}>
            <CameraAlt sx={{fontSize:40}}/>
          </IconButton>
          <IconButton  hidden={numberOfCameras <= 1} sx={{color:'#fff'}} onClick={() => {
          camera.current.switchCamera();
        }} >
            <FlipCameraAndroid sx={{fontSize:40}}/>
          </IconButton>
    </Stack>
    </div>
  )
}

export default TakePhoto
