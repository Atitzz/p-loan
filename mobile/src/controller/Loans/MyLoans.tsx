import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  InputLabel,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Section1 from "../../assets/img/bg-sec1.png";
import Section2_1 from "../../assets/img/sec2-1.png";
import Section2_2 from "../../assets/img/sec2-2.png";
import img_loan from "../../assets/img/loans.jpg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Payable from "@/component/Payable";
import LoanDetails from "./component/LoanDetails";
import MenuListItem from "@/component/MenuListItem";
import LoadScreen from "@/component/LoadScreen";

function MyLoans() {
  const location = useLocation();
  const loan = location.state;
  const [load,setLoad] = useState(false);
  // const navigate = useNavigate();
  // const { auth, AddAlert } = useContext(MainContext);
  // const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
  //   useContext(HttpContext);
  const { toTHB, toDate } = useContext(ToolsContext);
  // const [data, setData] = useState([]);
  const [qrcode, setQRcode] = useState(false);
  const [menu1,setMenu1] = useState([])

  const [menu2,setMenu2] = useState([
    { title: "สัญญาสินเชื่อ", path: "#" },
    { title: "หนังสือยินยันวงเงินสินเชื่อ", path: "#" },
  ])
 
  useEffect(()=>{
    if(loan)
    {
      setTimeout(() => {
        setLoad(true);
      }, 750);
      setMenu1(prev=>[
        ...prev,
        { title: "ใบแจ้งยอดชำระ", path:`/loans/history/${loan.loan_id}` },
        { title: "ดูใบเสร็จรับเงิน", path:`/loans/history/${loan.loan_id}` },
        { title: "รายการผ่อน", path: `/loans/history/${loan.loan_id}` },
      ])
      setMenu2(prev=>[...prev]);
    }
   
  },[loan])

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
        background:
          "linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(219,174,91,1) 100%)",
        py: 2,
      }}
    >
      <Payable open={qrcode} onClose={() => setQRcode(false)}/>
      {/* <LoanDetails
        open={dialogDetails}
        onClose={() => setDialogDetails(false)}
        data={details}
      /> */}
      <Container>
        <Box position={"relative"}>
          <Box>
            <img src={Section1} alt={Section1} width={"100%"} height={"100%"} />
          </Box>
          <Stack
            sx={{
              p: 4,
              position: "absolute",
              top: 0,
              width: "100%",
              gap: 4,
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box textAlign={"start"}>
                <Typography variant="subtitle1">วงเงินสินเชื่อ</Typography>
                <Typography variant="subtitle1" fontWeight={"500"}>
                  {toTHB(loan?.receivable)}
                </Typography>
              </Box>
              <Box textAlign={"end"}>
                <Typography variant="subtitle1">ยอดคงเหลือ</Typography>
                <Typography variant="subtitle1" fontWeight={"500"}>
                  {toTHB(loan?.remaining)}
                </Typography>
              </Box>
            </Box>
            <Box textAlign={"start"}>
              <LinearProgress
                variant="determinate"
                color="inherit"
                sx={{ height: "12px", borderRadius: "5px", mb: 1 }}
                value={
                  (Number(loan?.total_paid) / Number(loan?.receivable)) * 100
                }
              />
              <Typography variant="body1">
                สินเชื่อ: {loan?.planname}
              </Typography>
            </Box>
            <Box
              gap={2}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box
                sx={{ backgroundColor: "#fff", borderRadius: "10px" }}
                width={"100%"}
              >
                <Typography component={"div"} variant="caption">
                  วันครบกำหนดชำระ:
                </Typography>
                <Typography
                  component={"div"}
                  variant="caption"
                  lineHeight={"20px"}
                >
                  {toDate(loan?.next_installment)}
                </Typography>
              </Box>
              <Box
                sx={{ backgroundColor: "#fff", borderRadius: "10px" }}
                width={"100%"}
              >
                <Typography component={"div"} variant="caption">
                  จำนวนเงินที่ต้องชำระ:
                </Typography>
                <Typography
                  component={"div"}
                  variant="caption"
                  lineHeight={"20px"}
                >
                  {toTHB(loan?.per_installment)}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Container>
      <Stack sx={{ m: 2, mb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => setQRcode(true)}
          sx={{
            py: 0.75,
            px: 1.5,
            borderRadius: "25px",
            fontSize: "18px",
            bgcolor: "var(--color1)",
          }}
        >
          ชำระสินเชื่อ
        </Button>
      </Stack>
      <Stack
        sx={{
          flex: 1,
          pr: 2,
          textAlign: "start",
        }}
      >
        <Stack gap={2} textAlign={"start"}>
          <Box sx={{ bgcolor: "#000", p: 2 }}>
            <Typography variant="h5" color="#fff" children="ประวัติการชำระ" />
          </Box>
          <MenuListItem data={menu1} />
          <Box sx={{ bgcolor: "#000", p: 2 }}>
            <Typography variant="h5" color="#fff" children="เอกสารที่เกี่ยวกับสัญญา" />
          </Box>
          <MenuListItem data={menu2} />
        </Stack>
        {/* <Box sx={{ bgcolor: "#000", p: 2 }}>
          <Typography variant="h5" color="#fff" children="ประวัติการชำระ" />
        </Box>
        <AppBar position="static" sx={{ bgcolor: "#eeeeee" }}>
          <Tabs
            variant="fullWidth"
            sx={{ color: "orange" }}
            TabIndicatorProps={{
              sx: {
                background: "orange",
              },
            }}
            textColor="inherit"
            value={value}
            onChange={handleChange}
          >
            <Tab label="รอการชำระ" />

            <Tab label="ชำระแล้ว" />
          </Tabs>
        </AppBar>
        <Stack
          sx={{ flex: 1, gap: 2, p: 2, maxHeight: "55vh", overflow: "auto" }}
        >
          {fillterRows.length < 1 ? (
            <Stack sx={{ p: 5, justifyContent: "center", textAlign: "center" }}>
              {" "}
              <Typography variant="h6" sx={{ color: "#fff" }}>
                ไม่พบรายการในขณะนี้
              </Typography>
            </Stack>
          ) : (
            fillterRows.map((row, index) => (
              <Stack
                key={index}
                sx={{ p: 2, bgcolor: "var(--color2)", borderRadius: 2 }}
              >
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Stack gap={1.5} sx={{ px: 2 }}>
                    <Typography
                      variant="body1"
                      children={toDate(row.installment_date, 9)}
                    />

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          border: 1,
                          p: 0.5,
                          color: row.isPaid ? "limegreen" : "orange",
                        }}
                      >
                        <Typography
                          variant="body2"
                          children={row.isPaid ? "สำเร็จ" : "รอการชำระ"}
                        />
                      </Box>
                    </Stack>
                    <Typography
                      variant="body1"
                      children={`วันครบกำหนดชำระ : ${toDate(
                        row.installment_date,
                        1
                      )}`}
                    />
                  </Stack>
                  <Stack direction="row" sx={{ alignItems: "center" }}>
                    <Typography variant="h6" children={toTHB(row.paid)} />
                    <Box sx={{ p: 2 }}>
                      <IconButton onClick={() => onOpenDetails(row.id)}>
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            ))
          )}
        </Stack> */}
      </Stack>
    </Stack>
  )}
  </>)
}

export default MyLoans;
