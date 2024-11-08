import Camera, { DEVICE, FACING_MODE, PLACEMENT } from 'react-camera-ios';
import 'react-camera-ios/build/styles.css';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function CameraOpen() {
    const navigate = useNavigate();
    const [powerIndicator, setPowerIndicator] = React.useState(true);
    const takePhoto = (dataUrl) => {
        setPowerIndicator(false);
        console.log(dataUrl);
        navigate('/profile');
    };
    console.log(powerIndicator)
    return (
        <Box style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <Camera
                device={DEVICE.MOBILE}
                facingMode={FACING_MODE.USER}
                placement={PLACEMENT.COVER}
                quality="1"
                onError={error => console.log(error)}
                onTakePhoto={dataUrl => takePhoto(dataUrl)}
                isTurnedOn={powerIndicator}
            />
            {/* <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }}>
                <img src={idCard} alt={idCard} width={'100%'} height={'100%'} />
            </Box> */}
        </Box>
    )
}