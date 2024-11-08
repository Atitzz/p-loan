import { Box, InputLabel, Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

function LayoutAfterLogin() {
  return (
    <Stack
      sx={{
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "linear-gradient(40deg, #071251 0%, #ffffff 100%)",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(120deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)",
          opacity: 0.6,
          transform: "skewX(-20deg)",
          zIndex: 1,
          pointerEvents: "none",
        },
        "& .light-beam": {
          position: "absolute",
          width: "100%",
          height: "300px",
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)",
          top: "30%",
          left: "-50%",
          transform: "rotate(25deg)",
          opacity: 0.7,
          animation: "lightBeam 5s linear infinite",
        },
        "& .light-beam-outlet": {
          position: "absolute",
          width: "100%",
          height: "150%",
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)",
          top: "50%",
          left: "-50%",
          transform: "rotate(45deg)",
          opacity: 0.7,
          animation: "lightBeamOutlet 5s linear infinite",
        },
        "@keyframes lightBeam": {
          "0%": {
            left: "-50%",
          },
          "100%": {
            left: "150%",
          },
        },
        "@keyframes lightBeamOutlet": {
          "0%": {
            left: "150%",
          },
          "100%": {
            left: "-50%",
          },
        },
      }}
    >
      <div className="light-beam" />
      <div className="light-beam-outlet" />
      <Outlet />
      <Stack direction='row' sx={{ p: 5, bgcolor: "#000",justifyContent:'space-between' }}>
        <InputLabel sx={{ color: "#fff" }}>
          บริษัท มันนี่ ฟอร์ยู จำกัด
        </InputLabel>
        <InputLabel sx={{ color: "#fff" }}>
          2/69 ซ.สุขุมวิท 42 แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร 10110
        </InputLabel>
      </Stack>
    </Stack>
  );
}

export default LayoutAfterLogin;
