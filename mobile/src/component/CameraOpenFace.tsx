import Camera, { DEVICE, FACING_MODE, PLACEMENT } from "react-camera-ios";
import PropTypes from "prop-types";
import "react-camera-ios/build/styles.css";
import { Box } from "@mui/material";
import { useState } from "react";

CameraOpenFace.propTypes = {
  setDataImage: PropTypes,
};

export default function CameraOpenFace({ setDataImage }) {
  const takePhoto = (dataUrl) => {
    setDataImage(dataUrl);
  };
  const [dimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const setCanvasRef = (canvas) => {
    if (canvas) {
      const context = canvas.getContext("2d");

      const { width, height } = dimensions;
      // ล้าง canvas ก่อนวาดใหม่
      context.clearRect(0, 0, width, height);
      // วาดวงรีตรงกลาง
      context.beginPath();
      context.ellipse(
        width / 2,
        height / 2.5,
        width * 0.37,
        height * 0.275,
        0,
        0,
        2 * Math.PI
      );
      context.strokeStyle = "white"; // สีของเส้นวงรี
      context.lineWidth = 4; // ความหนาของเส้น
      context.stroke(); // วาดเส้น
    }
  };
  return (
    <div>
    <Box style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Camera
        device={DEVICE.MOBILE}
        facingMode={FACING_MODE.USER}
        placement={PLACEMENT.COVER}
        quality="1"
        onError={(error) => console.log(error)}
        onTakePhoto={takePhoto}
      />
     
    </Box>
    <canvas
        ref={setCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex:1
        }}
        width={dimensions.width}
        height={dimensions.height}
      />
      </div>
  );
}
