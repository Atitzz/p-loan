import {
  Box,
  IconButton,
  Stack,
  Modal,
  keyframes,
  Button,
  Typography,
  TextField,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ArrowForwardIos, Cancel, Close, Download } from "@mui/icons-material";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import LoadScreen from "./LoadScreen";
import liff from '@line/liff';
const defaultPayment = {
  total: "",
  orderdatetime: "2024-09-20 16:14:54",
  expiredate: "2024-09-20 16:24:54",
  image: "",
  loan_number: "",
};
function Payable({ open, onClose, loan }) {
  const { AddAlert } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toTHB, toDate, calculateTimeLeft, paymentCalculator } =
    useContext(ToolsContext);
  const [payment, setPayment] = useState(defaultPayment);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState<any>();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("max");
  const [cal, setCal] = useState<any>();
  const expirationDate = new Date("2024-09-20T11:39:49").getTime(); // แปลง Date เป็น timestamp
  const [timeLeft, setTimeLeft] = useState<object>(
    calculateTimeLeft(expirationDate)
  );

  useEffect(() => {
    if (open) {
    //   const initializeLiff = async () => {
    //     try {
    //         // กำหนด LIFF ID ของคุณที่นี่
    //         await liff.init({ liffId: '2005669969-m0oGeJQ0' });
    //         console.log('LIFF initialized successfully');

    //         // ตรวจสอบว่าเปิดอยู่ใน LINE Client หรือไม่
    //         if (liff.isInClient()) {
    //             // ทำงานใน LINE Client ได้ที่นี่
    //             const profile = await liff.getProfile();
    //             console.log('User Profile:', profile);
    //         } else {
    //             console.log('Not in LINE Client');
    //         }
    //     } catch (error) {
    //         console.error('Error initializing LIFF:', error);
    //     }
    // };

    // initializeLiff();
      setTimeout(() => {
        setLoad(true);
      }, 750);
      if (
        !data ||
        data["loan_number"] !== loan["loan_number"] ||
        (Number(timeLeft["minutes"]) == 0 && Number(timeLeft["seconds"]) == 0)
      ) {
        setStep(0);
        setData(loan);
        setPayment(defaultPayment);
        const response = paymentCalculator(
          loan.amount,
          loan.remaining,
          loan.interestRate,
          loan.total_installment,
          loan.installment_start,
          new Date().toISOString(),
          loan.per_installment,
          loan.overdue_balance,
          loan.given_installment,
          loan.pay_days,
          loan.delay_value,
          loan.delay_charge
        );
        setCal(response);
        setMethod('max');
        setAmount(response["max_pay"]);
      }
    } else {
      setLoad(false);
    }
  }, [open, loan]);

  const downloadQRCode = (link) => {
    if (liff.isInClient()) {
        liff.openWindow({
            url: link,
            external: true, 
        });
    } else {
        alert('กรุณาเปิดใน LINE App');
    }
};


  const [timer, setTimer] = useState(null); // เก็บ timer ใน state

  const nextStep = () => {
    // เคลียร์ interval ก่อนหน้า ถ้ามีการทำงานอยู่
    if (timer) {
      clearInterval(timer);
    }
  
    Post("payment/create", {
      loan_number: loan.loan_number,
      amount: Number(amount).toFixed(2),
    })
      .then((res) => {
        setPayment(res.data.data);
        setStep(1);
        const newTimer = setInterval(() => {
          const _left = calculateTimeLeft(
            new Date(res.data.data.expiredate).getTime()
          );
          if (Number(_left["minutes"]) === 0 && Number(_left["seconds"]) === 0) {
            clearInterval(newTimer); // หยุดเมื่อเวลาหมด
            return;
          }
          setTimeLeft(_left);
        }, 1000);
        setTimer(newTimer); // บันทึก timer ใหม่
      })
      .catch((err) => {
        AddAlert(ErrorResponse(err), "error");
      });
  };
  
  const decimalWithOptionalTwoPlaces = /^(\d+|\d*\.\d{1,2})$/;
  const [error, setError] = useState(false);
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "radio") {
      if (value == "max") {
        setError(false);
        setAmount(cal.max_pay);
        setMethod("max");
      } else if (value == "min") {
        setError(false);
        setAmount(cal.mini_pay);
        setMethod("min");
      } else {
        setMethod("custom");
      }
    } else {
      if (!decimalWithOptionalTwoPlaces.test(value)) setError(true);
      else setError(false);
      setAmount(value);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {!load ? (
        <LoadScreen />
      ) : (
        <Box
          sx={{
            p: 6,
            height: "100vh",
            background:
              "linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(219,174,91,1) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          {(() => {
            if (step === 0)
              return (
                <Stack component={Paper} sx={{ gap: 2, p: 4 }}>
                  <Typography sx={{ textAlign: "center" }} variant="h5">
                    <strong>ชำระสินเชื่อ</strong>
                  </Typography>
                  <Divider />
                  <Stack sx={{ gap: 1 }}>
                    <Typography>
                      <strong>สินเชื่อ:</strong>
                      {loan.planname}{" "}
                    </Typography>
                    <Typography>
                      <strong>เลขที่สัญญา:</strong>
                      {loan.loan_number}
                    </Typography>
                    <Typography>
                      <strong>เลขที่อ้างอิง:</strong>
                      {loan.reference}
                    </Typography>
                  </Stack>
                  <Divider />
                  <Typography sx={{ textAlign: "center" }} variant="h6">
                    <strong>จำนวนที่ต้องการชำระ</strong>
                  </Typography>
                  <Divider />
                  <Box
                    sx={{ p: 4, border: "1px solid #e5e5e5", borderRadius: 4 }}
                  >
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio"
                        value={method}
                        onChange={onChange}
                      >
                        <FormControlLabel
                          value="max"
                          control={<Radio />}
                          label="เต็มจำนวน"
                        />
                        <FormControlLabel
                          value="min"
                          control={<Radio />}
                          label="ขั้นต่ำ"
                        />
                        <FormControlLabel
                          value="custom"
                          control={<Radio />}
                          label="ระบุ"
                        />
                      </RadioGroup>
                    </FormControl>
                    {method === "custom" && (
                      <TextField
                        error={error}
                        variant="standard"
                        value={amount}
                        onChange={onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">บาท</InputAdornment>
                          ),
                        }}
                      />
                    )}
                    {method != "max" && (
                      <FormHelperText sx={{ color: "#eb0000" }}>
                        สำคัญ:
                        การชำระคืนไม่เต็มจำนวนอย่างต่อเนื่องจะทำให้ต้องจ่ายดอกเบี้ยรวมทั้งสัญญาในจำนวนสูง
                        และใช้เวลาในการปิดจบหนี้นาน
                        เมื่อเทียบกับการชำระเต็มจำนวน
                      </FormHelperText>
                    )}
                  </Box>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", mt: 5 }}
                  >
                    <Stack
                      direction="row"
                      sx={{ gap: 2, alignItems: "center" }}
                    >
                      <Button
                        color="warning"
                        variant="contained"
                        sx={{ p: 4, borderRadius: "50%" }}
                        onClick={() => onClose()}
                      >
                        <Close sx={{ fontSize: 25 }} />
                      </Button>
                      <Typography variant="h6">
                        <strong>ยกเลิก</strong>
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      sx={{ gap: 2, alignItems: "center" }}
                    >
                      <Typography variant="h6">
                        <strong>ต่อไป</strong>
                      </Typography>
                      <Button
                        disabled={
                          (method == "custom" && Number(amount) < 1) || error
                        }
                        onClick={nextStep}
                        color="info"
                        variant="contained"
                        sx={{ p: 4, borderRadius: "50%" }}
                      >
                        <ArrowForwardIos sx={{ fontSize: 25 }} />
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              );
            else
              return (
                <>
                  <Stack gap={5} sx={{ textAlign: "center" }}>
                    <Typography variant="h5" sx={{ color: "#fff" }}>
                      สแกน QR Code เพื่อชำระสินเชื่อ
                    </Typography>
                    <img
                      src={`${import.meta.env.VITE_BASE}/file/${payment.image}`}
                      // onClick={onPayment}
                    />
                    {(() => {
                      if (
                        Number(timeLeft["minutes"]) == 0 &&
                        Number(timeLeft["seconds"]) == 0
                      )
                        return (
                          <Typography variant="h6" sx={{ color: "#eb0000" }}>
                            หมดเวลาในการชำระ
                          </Typography>
                        );
                      else
                        return (
                          <Typography
                            sx={{ color: "white", textAlign: "end", px: 2 }}
                          >
                            {String(timeLeft["minutes"]).padStart(2, "0")}:
                            {String(timeLeft["seconds"]).padStart(2, "0")}
                          </Typography>
                        );
                    })()}

                    {loan && (
                      <Stack gap={2} sx={{ p: 4, alignItems: "center" }}>
                        <Typography variant="h6" sx={{ color: "#fff" }}>
                          ยอดชำระสุทธิ: {toTHB(Number(payment.total))} บาท
                        </Typography>
                        <Button
                          fullWidth
                          variant="contained"
                          // component="a"
                          // download={true}
                          // href={`${import.meta.env.VITE_BASE}/file/${payment.image}`}
                          // target="_blank"
                          onClick={()=>downloadQRCode(`${import.meta.env.VITE_BASE}/file/${payment.image}`)}
                          // sx={{ bgcolor: "#eeeeee"}}
                          size="large"
                        >
                          ดาวโหลด
                        </Button>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => onClose()}
                          size="large"
                          color="warning"
                        >
                          ปิดหน้าต่าง
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </>
              );
          })()}
        </Box>
      )}
    </Modal>
  );
}

export default Payable;
