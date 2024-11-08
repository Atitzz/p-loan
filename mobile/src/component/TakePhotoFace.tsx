import { CameraAlt, FlipCameraAndroid, Reply } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import React, { useRef, useState } from "react";
import { Camera } from "react-camera-pro";

function TakePhotoFace({ onBack, onTake }) {
  const camera = useRef(null);

  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const takePhoto = () => {
    if (camera.current) {
      try {
        const photo = camera.current.takePhoto();
        onTake(photo);
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
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
      <div>
        <Camera
          ref={camera}
          facingMode="user"
          numberOfCamerasCallback={setNumberOfCameras}
        />
        <canvas
          ref={setCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
      <Stack
        direction="row"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          bgcolor: "#000",
          width: "100vw",
          height: 56,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <IconButton sx={{ color: "#fff" }} onClick={onBack}>
          <Reply sx={{ fontSize: 40 }} />
        </IconButton>
        <IconButton sx={{ color: "#fff" }} onClick={takePhoto}>
          <CameraAlt sx={{ fontSize: 40 }} />
        </IconButton>
        <IconButton
          hidden={numberOfCameras <= 1}
          sx={{ color: "#fff" }}
          onClick={() => {
            camera.current.switchCamera();
          }}
        >
          <FlipCameraAndroid sx={{ fontSize: 40 }} />
        </IconButton>
      </Stack>
    </div>
  );
}

export default TakePhotoFace;
