import idCard from '@/assets/img/id-card.png'
import Camera, { DEVICE, FACING_MODE, PLACEMENT } from 'react-camera-ios';
import PropTypes from 'prop-types';
import 'react-camera-ios/build/styles.css';
import { Box } from '@mui/material';

CameraOpenIdCard.propTypes = {
    setDataImage: PropTypes,
}

export default function CameraOpenIdCard({ setDataImage }) {
    const takePhoto = (dataUrl) => {
        setDataImage(dataUrl);
    };

    return (
        <Box style={{ display: 'flex', height: '100vh', width: '100%' }}>
            <Camera
                device={DEVICE.MOBILE}
                facingMode={FACING_MODE.ENVIRONMENT}
                placement={PLACEMENT.COVER}
                quality="1"
                onError={error => console.log(error)}
                onTakePhoto={takePhoto}
            />
            <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }}>
                <img src={idCard} alt={idCard} width={'100%'} height={'100%'} />
            </Box>
        </Box>
    )
}