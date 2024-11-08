import { ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const defaultError = {
  total: true,
  customeremail: true,
};

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const decimalPattern = /^\d+(\.\d+)?$/;
function Paysolution() {
  const { loan_number, amount, refno } = useParams();
  const { toTHB } = useContext(ToolsContext);
  const [errors, setErrors] = useState(defaultError);
  const [ok,setOK] = useState(true);
  const [input, setInput] = useState({
    loan_number: loan_number,
    total: amount,
    refno: refno,
    customeremail: "",
    channel: "promptpay",
  });
  const [details, setDetails] = useState("ชำระสินเชื่อ");
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name == "total") {
      if (!decimalPattern.test(value))
        setErrors((prev) => {
          return { ...prev, total: false };
        });
      else
        setErrors((prev) => {
          return { ...prev, total: true };
        });
    } else if (name == "customeremail") {
      if (!emailPattern.test(value)) {
        setErrors((prev) => {
          return { ...prev, customeremail: false };
        });
      } else {
        setErrors((prev) => {
          return { ...prev, customeremail: true };
        });
      }
    }

    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    setDetails(
      `เลขที่สัญญา ${input.loan_number} เลชที่อ้างอิง ${
        input.refno
      } จำนวนเงิน ${toTHB(input.total)} `
    );
  }, [input]);

  useEffect(()=>{
    if(errors.customeremail && errors.total)
        if(input.customeremail != "" && input.total != "")
        setOK(false)
    else
        setOK(true)
  },[errors])
  
  return (
    <Box
      sx={{
        py: 6,
        height: "100vh",
        background:
          "linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(219,174,91,1) 100%)",
        display: "flex",
        flexDirection: "column",
        //   justifyContent:"space-around"
      }}
    >
      <Container maxWidth="md">
        <Box sx={{mb:10}}>
        <img src="https://api-member.moneyforyou.co.th/public/banner_logo.png" />
        </Box>
        <Box sx={{mb:4}}>
        <Typography variant="h5" color='#fff'>ชำระสินเชื่อ</Typography></Box>

        <Stack
          component="form"
          method="post"
          action="https://payment.paysolutions.asia/epaylink/payment.aspx"
          sx={{ gap: 2 }}
        >
          <TextField
            size="small"
            className="input-custom-2"
            error={!errors.customeremail}
            type="text"
            name="customeremail"
            value={input.customeremail}
            onChange={onChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">อีเมล:</InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            type="text"
            name="refno"
            value={input.refno}
            sx={{ display: "none" }}
          />

          <TextField
            size="small"
            type="text"
            name="merchantid"
            value={import.meta.env.VITE_MERCHANTID}
            sx={{ display: "none" }}
          />

          <TextField
            size="small"
            type="text"
            name="cc"
            value="00"
            sx={{ display: "none" }}
          />
          <TextField
            size="small"
            className="input-custom-2"
            error={!errors.total}
            type="text"
            name="total"
            value={input.total}
            onChange={onChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">จำนวนเงิน:</InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">บาท</InputAdornment>,
            }}
          />

          <TextField
            size="small"
            type="text"
            name="lang"
            value="TH"
            sx={{ display: "none" }}
          />
          <TextField
            size="small"
            select
            name="channel"
            value={input.channel}
            className="input-custom-2"
            onChange={onChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  ช่องทางการชำระ:
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="full"> Full Payment </MenuItem>
            <MenuItem value="amex"> Full Payment American Express </MenuItem>
            <MenuItem value="cup"> Full Payment Union Pay </MenuItem>
            <MenuItem value="installment"> Installment </MenuItem>
            <MenuItem value="bill"> Bill </MenuItem>
            <MenuItem value="promptpay"> PromptPay </MenuItem>
            <MenuItem value="alipay"> Alipay </MenuItem>
            <MenuItem value="wechat"> WeChat pay </MenuItem>
            <MenuItem value="truewallet"> True Money Wallet </MenuItem>
            <MenuItem value="ibanking"> iBanking </MenuItem>
            <MenuItem value="ibanking_kbank"> iBanking - Kbank </MenuItem>
            <MenuItem value="ibanking_scb"> iBanking - SCB </MenuItem>
            <MenuItem value="ibanking_ktb"> iBanking - KTC </MenuItem>
            <MenuItem value="ibanking_bay"> iBanking - BAY </MenuItem>
            <MenuItem value="ibanking_bbl"> iBanking - BBL </MenuItem>
            <MenuItem value="ibanking_ttb"> iBanking - TTB </MenuItem>
          </TextField>
          <TextField
            size="small"
            type="text"
            name="productdetail"
            value={details}
            multiline
            rows={4}
            sx={{ display: "none" }}
            InputProps={{
              startAdornment: (
                <InputAdornment sx={{ alignItems: "start" }} position="start">
                  รายละเอียด:
                </InputAdornment>
              ),
              sx: { alignItems: "start" },
              readOnly: true,
            }}
          />
          <Button disabled={ok} className="btn-1" variant="contained" type="submit" sx={{my:5,bgcolor:ok ?'#a0a0a0 !important' :'',color:ok ?'#000 !important' :''}}>
            ชำระสินเชื่อ
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default Paysolution;
