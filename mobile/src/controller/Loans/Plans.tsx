import { HttpContext } from "@/context/Context";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import default_logo from "../../assets/img/default_logo.png";
import { useNavigate } from "react-router-dom";
import LoadScreen from "@/component/LoadScreen";
function Plans() {
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
    const [load,setLoad] = useState(false);
    const navigate = useNavigate();
  const [loanPlans, setLoanPlans] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 750);
    Get("plan/loan/all").then((resoinse) => {
      setLoanPlans(resoinse.data.data);
    });
  }, []);
  return (
    <>
    {!load ? (
      <LoadScreen/>
    ) : (
    <Stack
      sx={{
        height: "100vh",
        width: "100vw",
        justifyContent: "space-between",
        textAlign: "start",
        overflow:'auto'
      }}
    >
      <Stack gap={2}>
        <Box sx={{ background: "var(--color1)", py: "25px",px:4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
            ผลิตภัณฑ์สินเชื่อ
          </Typography>
        </Box>
        <Stack gap={4} direction='row' flexWrap='wrap' sx={{ mx: 4 }}>
          {loanPlans
          .filter((plan) => {
            const excludedNames = ["test", "ดอกเบี้ยคงที่"]; // รายการชื่อที่ต้องการกรอง
            return !excludedNames.some(name => plan.name.startsWith(name));
          })
          .map((plan, index) => (
            <Card key={index} sx={{width:'100%',height:'280px'}} onClick={()=>navigate(`takeloan/${plan.id}`)}>
              <CardMedia
                component="img"  
                src={plan.images ? `${import.meta.env.VITE_BASE}/file/${plan.images}` : default_logo}
                // src={plan.images ? plan.images : default_logo}
                alt={plan.name}
              />
              <CardContent>
                <Typography fontWeight={700}>
                  {plan.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  dangerouslySetInnerHTML={{ __html: plan.instruction }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>)}
    </>
  );
}

export default Plans;
