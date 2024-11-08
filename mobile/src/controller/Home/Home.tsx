import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Section1 from "../../assets/img/bg-sec1.png";
import LoadScreen from "@/component/LoadScreen";
import Payable from "@/component/Payable";
function Home() {
  const navigate = useNavigate();
  const { auth } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const [load, setLoad] = useState(false);
  const { toTHB, toDate } = useContext(ToolsContext);
  const [loans, setLoans] = useState([]);
  useEffect(() => {
    Get("loan/list/all").then((resoinse) => {
      setLoans(
        resoinse.data.data.filter(
          (loan) => String(loan.status).toLowerCase() !== "pending"
        )
      );
      setTimeout(() => {
        setLoad(true);
      }, 750);
    }).catch(error=>{
      console.log(error)
      setTimeout(() => {
        setLoad(true);
      }, 750);
    });
  }, []);

  const [qrcode, setQRcode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const viewContract = (number) => navigate(`/loans/contract/${number}`);
  return (
    <>
      {!load ? (
        <LoadScreen />
      ) : (
        <Stack
          sx={{
            minHeight: "100vh",
            background:
              "linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(219,174,91,1) 100%)",
          }}
        >
          <Payable
            open={qrcode}
            onClose={() => setQRcode(false)}
            loan={loans[activeIndex] || undefined}
            // paymentLink={loans[activeIndex]?.payment_link || null}
          />
          <Box pt={1} sx={{ px: 2 }}>
            <Container>
              {/* <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                color={"#fff"}
              >
                <Box display={"flex"} alignItems={"center"} gap={1}>
                  <Icons.MonetizationOn />
              <Typography variant="subtitle1">เหรียญ 100</Typography>
                </Box>

                <Box>
                  <IconButton color="inherit">
                <Badge color="secondary">
                  <Icons.Notifications />
                </Badge>
              </IconButton>
                  <IconButton color="inherit" onClick={logout}>
                    <Badge color="secondary">
                      <Icons.PowerSettingsNew />
                    </Badge>
                  </IconButton>
                </Box>
              </Box> */}

              <Box
                my={3}
                textAlign={"start"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"end"}
                color={"#fff"}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  fontWeight={"600"}
                  fontSize={"24px"}
                >
                  สมัครง่าย
                  <br />
                  ได้เงินเลยทันที
                </Typography>
                <Button
                  disabled={auth?.kyc == "verified" || auth?.kyc == "pending"}
                  onClick={() => navigate("/kyc")}
                  variant="contained"
                  sx={{
                    mb: 2,
                    backgroundColor: "#fff",
                    color: "var(--color1)",
                    borderRadius: "25px",
                  }}
                  startIcon={
                    auth?.kyc == "verified" ? (
                      <Icons.CheckCircle sx={{ color: "#06c755" }} />
                    ) : (
                      <Icons.PeopleAlt />
                    )
                  }
                >
                  {auth?.kyc == "verified"
                    ? `ยืนยันตัวตนแล้ว`
                    : auth?.kyc == "pending"
                    ? `รอการตรวจสอบ`
                    : `ยืนยันตัวตน`}
                </Button>
              </Box>
            </Container>

            {loans.length === 0 ? (
              <Container>
                <Box
                        sx={{
                          minHeight: "200px",
                          backgroundImage: `url(${Section1})`, // ใช้ภาพเป็น background
                          backgroundSize: "cover", // ทำให้ภาพครอบคลุมพื้นที่ทั้งหมด
                          backgroundPosition: "center",
                          borderRadius:5
                        }}
                      >
                      
                        <Stack
                          sx={{
                            p: 4,
                            gap: 4,
                          }}
                        >
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Box textAlign={"start"}>
                        <Typography variant="subtitle1">
                          วงเงินสินเชื่อ
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={"500"}>
                          {toTHB(0)}
                        </Typography>
                      </Box>
                      <Box textAlign={"end"}>
                        <Typography variant="subtitle1">ยอดคงเหลือ</Typography>
                        <Typography variant="subtitle1" fontWeight={"500"}>
                          {toTHB(0)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign={"start"}>
                      <LinearProgress
                        variant="determinate"
                        color="inherit"
                        sx={{ height: "12px", borderRadius: "5px", mb: 1 }}
                        value={100}
                      />
                      <Typography variant="body1">สินเชื่อ: {"-"}</Typography>
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
                          {toDate("")}
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
                          {toTHB(0)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Container>
            ) : (
              <Swiper
                pagination={{ clickable: true }}
                modules={[Pagination]}
                spaceBetween={30}
                className="mySwiper bannerSwiper"
                style={{ paddingBottom: "24px" }}
                onSlideChange={(value) => {
                  setActiveIndex(value.activeIndex);
                }}
              >
                {loans.map((loan, i) => (
                  <SwiperSlide
                    key={i}
                    // onClick={() => navigate(`/loans/myloan`, { state: loan })}
                  >
                    <Container>
                      <Box
                        sx={{
                          minHeight: "200px",
                          backgroundImage: `url(${Section1})`, // ใช้ภาพเป็น background
                          backgroundSize: "cover", // ทำให้ภาพครอบคลุมพื้นที่ทั้งหมด
                          backgroundPosition: "center",
                          borderRadius:5
                        }}
                      >
                      
                        <Stack
                          sx={{
                            p: 4,
                            gap: 4,
                          }}
                        >
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Box textAlign={"start"}>
                              <Typography variant="subtitle1">
                                วงเงินสินเชื่อ
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                fontWeight={"500"}
                              >
                                {toTHB(Number(loan.amount))}
                              </Typography>
                            </Box>
                            <Box textAlign={"end"}>
                              <Typography variant="subtitle1">
                                ยอดคงเหลือ
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                fontWeight={"500"}
                              >
                                {toTHB(
                                  Number(loan.remaining)
                                )}
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign={"start"}>
                            <LinearProgress
                              variant="determinate"
                              color="inherit"
                              sx={{
                                height: "12px",
                                borderRadius: "5px",
                                mb: 1,
                              }}
                              value={
                                (Number(loan.total_paid) /
                                  Number(loan.receivable)) *
                                100
                              }
                            />
                            <Typography variant="body1" sx={{textWrap:'stable'}}>
                              สินเชื่อ: {loan.planname}
                            </Typography>
                            <Typography variant="body1" sx={{textWrap:'stable'}}>
                              เลขที่สัญญา: {loan.loan_number}
                            </Typography>
                            <Typography variant="body1" sx={{textWrap:'stable'}}>
                              เลขที่อ้างอิง: {loan.reference}
                            </Typography>
                          </Box>
                          <Box
                            gap={2}
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Box
                              sx={{
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                              }}
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
                                {toDate(loan.next_installment)}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                              }}
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
                                {toTHB(loan.per_installment)}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </Container>
                  </SwiperSlide>
                ))}
                <Typography variant="body2" color="var(--color2)">
                  ข้อมูล ณ วันที่{" "}
                  {toDate(new Date(Date.now() + 7 * 60 * 60 * 1000))}
                </Typography>
              </Swiper>
            )}
            <Stack gap={5} sx={{ my: 5 }}>
              <Stack direction="row">
                <Stack gap={1} sx={{ alignItems: "center", flex: 1 }}>
                  <Button
                    sx={{
                      width: 75,
                      height: 75,
                      borderRadius: "50%",
                      border: "2px solid #c0c0c0",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={() => setQRcode(true)}
                    disabled={loans.length === 0}
                  >
                    <Icons.QrCodeScanner
                      sx={{ fontSize: 45, color: loans.length === 0 ? '#a0a0a0' :"#eeeeee" }}
                    />
                  </Button>
                  <Typography variant="body1" color={loans.length === 0 ? '#a0a0a0' :"#eeeeee"}>
                    ชำระสินเชื่อ
                  </Typography>
                </Stack>
                <Stack gap={1} sx={{ alignItems: "center", flex: 1 }}>
                  <Button
                    sx={{
                      width: 75,
                      height: 75,
                      borderRadius: "50%",
                      border: `2px solid #c0c0c0`,
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={() => navigate(`loans/history/${loans[activeIndex]?.loan_id || ""}`)}
                    disabled={loans.length === 0}
                  >
                    <Icons.PendingActions
                      sx={{ fontSize: 45, color: loans.length === 0 ? '#a0a0a0' :"#eeeeee" }}
                    />
                  </Button>
                  <Typography variant="body1" color={loans.length === 0 ? '#a0a0a0' :"#eeeeee"}>
                    ประวัติการชำระ
                  </Typography>
                </Stack>
                <Stack gap={1} sx={{ alignItems: "center", flex: 1 }}>
                  <Button
                    sx={{
                      width: 75,
                      height: 75,
                      borderRadius: "50%",
                      border: "2px solid #c0c0c0",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={() => navigate(`loans/due/${loans[activeIndex]?.loan_id || ""}`)}
                    disabled={loans.length === 0}
                  >
                    <Icons.Receipt
                   sx={{ fontSize: 45, color: loans.length === 0 ? '#a0a0a0' :"#eeeeee" }}
                     />
                  </Button>
                  <Typography variant="body1" color={loans.length === 0 ? '#a0a0a0' :"#eeeeee"}>
                    ใบแจ้งยอด
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row">
                <Stack gap={1} sx={{ alignItems: "center", flex: 1 }}>
                  <Button
                    sx={{
                      width: 75,
                      height: 75,
                      borderRadius: "50%",
                      border: "2px solid #c0c0c0",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    component={Link}
                    to="/loans"
                  >
                    <Icons.AddCard sx={{ fontSize: 45, color: "#eeeeee" }} />
                  </Button>
                  <Typography variant="body1" color="#eeeeee">
                    ขอสินเชื่อ
                  </Typography>
                </Stack>
                <Stack gap={1} sx={{ alignItems: "center", flex: 1 }}>
                  <Button
                    sx={{
                      width: 75,
                      height: 75,
                      borderRadius: "50%",
                      border: "2px solid #c0c0c0",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={() =>
                      viewContract(loans[activeIndex]?.loan_number || "")
                    }
                  >
                    <Icons.MenuBook sx={{ fontSize: 45, color: "#eeeeee" }} />
                  </Button>
                  <Typography variant="body1" color="#eeeeee">
                    สัญญาสินเชื่อ
                  </Typography>
                </Stack>
                <Stack gap={1} sx={{ alignItems: "center", flex: 1 }}>
                  <Button
                    sx={{
                      width: 75,
                      height: 75,
                      borderRadius: "50%",
                      border: "2px solid #c0c0c0",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    component="a"
                    href="https://www.moneyforyou.co.th/contact"
                  >
                    <Icons.Call sx={{ fontSize: 45, color: "#eeeeee" }} />
                  </Button>
                  <Typography variant="body1" color="#eeeeee">
                    ติดต่อเรา
                  </Typography>
                </Stack>
              </Stack>
              <Box sx={{width:'100%',height:100}}></Box>
            </Stack>
          </Box>
        </Stack>
      )}
    </>
  );
}

export default Home;
