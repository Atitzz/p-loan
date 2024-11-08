import { HttpContext, MainContext } from "@/context/Context";
import { Box, IconButton, Stack, Modal,keyframes, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const padNumber = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["0"]];
const defaultPin = ["", "", "", "", "", ""];
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;
function SetPIN() {
    const {auth,setAuth,AddAlert}:any = useContext(MainContext);
 const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
      useContext(HttpContext);
  const [pin, setPin] = useState(defaultPin);
  const [pin2, setPin2] = useState(defaultPin);
  const [step, setStep] = useState(0);
  const [step2, setStep2] = useState(0);
  const [max] = useState(6);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const handleOnClick = (value) => {
    if (step === max) return;
    let __pin = [...pin];
    __pin[step] = value;
    setPin(__pin);
    setStep((prev) => prev + 1);
  };

  const handleOnClick2 = (value) => {
    if (step2 === max) return;
    let __pin = [...pin2];
    __pin[step2] = value;
    setPin2(__pin);
    setStep2((prev) => prev + 1);
  };


  useEffect(() => {
    if (step2 === max) {
        console.log(pin2.join(''));
        if(pin.join('') != pin2.join(''))
        {
            setShakeAnimation(true);
            setTimeout(() =>{
                setPin(defaultPin);
                setPin2(defaultPin);
                setStep(0);
                setStep2(0);
                setShakeAnimation(false)
            }, 500); // reset animation after 500ms
        }else
        {
            Post(`set/pin`, {pin:pin.join('')})
            .then((response) => {
              AddAlert(MessageResponse(response), "info");
              const pin = sessionStorage.getItem("pin");
              window.location.href = '/'
            })
            .catch((error) => {
              AddAlert(ErrorResponse(error), "error");
            });
        }
    }
  }, [step2]);

  return (
    <>
    {step !== max ? 
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
        <Box sx={{ px: 10 ,textAlign:"center"}}>
          <Box component="h2" sx={{ m: 1 }}>ตั้งรหัส PIN</Box>
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
        {/* <Button onClick={()=>onClose()} sx={{color:'#fff',position:'fixed',bottom:10,right:15}}>Back</Button> */}
      </Box>
      :

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
        <Box sx={{ px: 10 ,textAlign:"center"}}>
          <Box component="h2" sx={{ m: 1 }}>ยืนยันรหัส PIN</Box>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center',
              animation: shakeAnimation ? `${shake} 0.5s ease` : "none",
           }}>
            {pin2.map((n, i) => (
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
                    onClick={() => handleOnClick2(i)}
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
        {/* <Button onClick={()=>onClose()} sx={{color:'#fff',position:'fixed',bottom:10,right:15}}>Back</Button> */}
      </Box>
      }
      </>
  );
}


export default SetPIN
