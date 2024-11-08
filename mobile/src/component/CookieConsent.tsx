import { Box, Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";

function CookieConsent() {
  const [showConsent, setShowConsent] = useState(true);
  useEffect(() => {
    const __cookie = localStorage.getItem("cookieConsent");
    if(!__cookie)
      setShowConsent(true);
  },[]);
  const acceptConsent = () => {
    setShowConsent(false);
    localStorage.setItem("cookieConsent", "true");
};

const declineConsent = () => {
    setShowConsent(false);
};

  return (
    <Stack
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        bgcolor: "#000000",
        width: "100vw",
        height: "20vh",
        color: "#fff",
        p:2,
        textAlign:'start',
        zIndex: 99999,
        display:showConsent ? "block" : "none"
      }}
    >
      <Box
        component="p"
        dangerouslySetInnerHTML={{
          __html:
            "เราใช้ <strong>แพ็คเกจวิเคราะห์มาตรฐาน</strong> เพื่อเข้าใจพฤติกรรมทั่วไปของผู้ใช้ เพื่อให้เราสามารถปรับปรุงเนื้อหาของเราได้ ซึ่งเกี่ยวข้องกับการใช้คุกกี้ คุณโอเคกับสิ่งนี้หรือไม่?",
        }}
      />
      <Stack direction="row" sx={{ justifyContent: "space-around" }}>
        <Button
        fullWidth
          style={{
            backgroundColor: "#d3a84f",
            color: "#fff",
            marginRight: "10px",
          }}
          onClick={acceptConsent}
        >
          ยอมรับ
        </Button>
        <Button 
        fullWidth
        style={{ backgroundColor: "#a8a8a8", color: "#fff" }}
        onClick={declineConsent}
        >
          ปฏิเสธ
        </Button>
       
      </Stack>
    </Stack>
  );
}

export default CookieConsent;
