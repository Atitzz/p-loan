import { HttpContext, MainContext } from "@/context/Context";
import { Box, IconButton, Stack, Modal,keyframes, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";

const padNumber = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["0"]];
const defaultPin = ["", "", "", "", "", ""];
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;
function EnterPIN({ open, onClose }) {
  const {auth,setAuth,AddAlert}:any = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
       useContext(HttpContext);
  const [pin, setPin] = useState(defaultPin);
  const [step, setStep] = useState(0);
  const [max] = useState(6);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const handleOnClick = (value) => {
    if (step === max) return;
    let __pin = [...pin];
    __pin[step] = value;
    setPin(__pin);
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (step === max) {
      Post(`verify/pin`, {pin:pin.join('')})
      .then((response) => {
        AddAlert(MessageResponse(response), "info");
       sessionStorage.setItem('pin',pin.join(''));
       onClose();
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        
        setShakeAnimation(true);
        setTimeout(() =>{
            setPin(defaultPin);
            setStep(0);
            setShakeAnimation(false)
        }, 500); // reset animation after 500ms
      });
    }
  }, [step]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
            p: 6,
            height: "100vh",
            background:
              "linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(219,174,91,1) 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent:"space-around"
          }}
      >
        {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
          <LockIcon />
        </Box> */}
        <Box sx={{ px: 10 ,textAlign:"center"}}>
          <Box component="h2" sx={{ m: 1 }}>ป้อนรหัส</Box>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center',
              animation: shakeAnimation ? `${shake} 0.5s ease` : "none",
           }}>
            {pin.map((n, i) => (
              <Box
                component="span"
                key={i}
                sx={{
                  width: "40px", // ปรับขนาดให้เหมาะสม
                  aspectRatio:1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #fff",
                  bgcolor: n !== "" ? "#fff" : "",
                  borderRadius: "50%",
                
                }}
              ></Box>
            ))}
          </Stack>
        </Box>
        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          {padNumber.map((n, rowIndex) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
                width: "100%",
                maxWidth:'600px',
              }}
              key={rowIndex}
            >
              {n.map((i, index) => (
                <Box
                  sx={{
                    flex: "1 1 0",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  key={index}
                >
                  <IconButton
                    onClick={() => handleOnClick(i)}
                    sx={{
                      width: "100%",
                      aspectRatio: "1",
                      maxWidth: "80px",
                      p: 3,
                      bgcolor: "#00000020",
                      borderRadius: "50%",
                      fontWeight:"bold",
                      color:"#fff"
                    }}
                  >
                    {i}
                  </IconButton>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box/>
        <Box/>
      </Box>
    </Modal>
  );
}

export default EnterPIN;
