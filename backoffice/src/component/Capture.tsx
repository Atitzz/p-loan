import { MainContext } from "@/context/Context";
import { CameraAlt, ExitToApp, Replay, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

function Capture({ open, onClose, onSave,person = false ,width = 360,height =480}) {
  const {  useLang } = useContext(MainContext);
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  useEffect(() => {
    if (open) {
      setCapturedImage("");
    }
  }, [open]);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId); // เลือกกล้องตัวแรกเป็นค่าเริ่มต้น
      }
    });
  }, []);

  const [dimensions] = useState({ width: width, height: height });

  const setCanvasRef = (canvas) => {
    if (person && canvas) {
      const context = canvas.getContext("2d");

      const { width, height } = dimensions;
      // ล้าง canvas ก่อนวาดใหม่
      context.clearRect(0, 0, width, height);
      // วาดวงรีตรงกลาง
      context.beginPath();
      context.ellipse(
        width / 2,
        height / 2.5,
        width * 0.24,
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

  const handleSave = () => {
    onSave(capturedImage);
    onClose()
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Stack sx={{ justifyContent: "center", alignItems: "center", py: 10 }}>
        {!capturedImage ? (
          <Box sx={{ position: "relative", display: "inline-block" }}>
            {open && (
              <>
                <Webcam
                  audio={false}
                  mirrored={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={dimensions.width}
                  height={dimensions.height}
                  videoConstraints={{
                    deviceId: selectedDeviceId
                      ? { exact: selectedDeviceId }
                      : undefined,
                    width: dimensions.width,
                    height: dimensions.height,
                  }}
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
              
              </>
            )}

            <Stack sx={{ gap: 2 }}>
              <TextField
                size="small"
                select
                inputProps={{
                  sx: {
                    bgcolor: "#fff",
                  },
                }}
                onChange={handleDeviceChange}
                value={selectedDeviceId}
              >
                {devices.map((device, index) => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                startIcon={<CameraAlt />}
                variant="contained"
                onClick={capture}
              >
                {useLang("ถ่ายภาพ", "Take Photo")}
              </Button>
              <Button
                startIcon={<ExitToApp />}
                variant="contained"
                color="error"
                onClick={onClose}
              >
                {useLang("ปิดหน้าต่าง", "Close")}
              </Button>
            </Stack>
          </Box>
        ) : (
          <div>
            <img
              src={capturedImage}
              alt="Captured"
              style={{ maxWidth: "300px" }}
            />
            <Stack gap={2}>
              <Button
                color="warning"
                startIcon={<Replay />}
                variant="contained"
                onClick={() => setCapturedImage(null)}
              >
                {useLang("ถ่ายใหม่", "New Take")}
              </Button>
              <Button
                startIcon={<Save />}
                variant="contained"
                onClick={handleSave}
              >
                {useLang("บันทึก", "Save")}
              </Button>
            </Stack>
          </div>
        )}
      </Stack>
    </Modal>
  );
}

export default Capture;
