import { CameraAlt, FlipCameraAndroid, Reply } from '@mui/icons-material';
import { Box, Button, IconButton, Stack } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { Camera } from 'react-camera-pro';

function TestCamera() {
    const videoRef = useRef(null);
    useEffect(() => {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera: ", err);
        }
      };
  
      startCamera();
    }, []);
  
    // const captureImage = () => {
    //   const video = videoRef.current;
    //   // const canvas = canvasRef.current;
    //   const context = canvas.getContext("2d");
  
    //   // กำหนดขนาดของ canvas ตามขนาดของวิดีโอ
    //   canvas.width = video.videoWidth;
    //   canvas.height = video.videoHeight;
  
    //   // วาดภาพจาก video ลงใน canvas
    //   context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // };
  return (
    <div>
      {/* แสดงภาพสดจากกล้อง */}
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />

      {/* Element สำหรับแสดงผลภาพที่ถ่าย */}
      {/* <canvas ref={canvasRef} style={{ display: "block", marginTop: "20px" }} /> */}

      {/* ปุ่มถ่ายภาพ */}
      {/* <button onClick={captureImage} style={{ marginTop: "10px" }}>
        ถ่ายภาพ
      </button> */}
    </div>
  )
}

export default TestCamera
