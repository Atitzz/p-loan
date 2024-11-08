import { ToolsContext } from '@/context/Context';
import { ArrowBackIos } from '@mui/icons-material';
import { Box, Button, Container, Divider, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const defaultError = {
    total: true,
    customeremail: true,
}

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const decimalPattern = /^\d+(\.\d+)?$/;
function Paysolution() {
  const { loan_number, amount, refno ,email} = useParams();
  const navigate = useNavigate();
  const { toTHB } = useContext(ToolsContext);
  const [errors, setErrors] = useState(defaultError);
  const [ok,setOK] = useState(true);
  const [input, setInput] = useState({
    loan_number: loan_number,
    total: amount,
    refno: refno,
    customeremail: email ? email : "info@moneyforyou.co.th",
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
    <Stack spacing={2}>
         <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          startIcon={<ArrowBackIos />}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </Button>
        
      </Stack>
    <Stack component={Paper}>
        <Stack component="form" method="post" action="https://payment.paysolutions.asia/epaylink/payment.aspx" sx={{gap:4,p:4}}>
        <Box component="span" sx={{ fontWeight: "bold" }}>
        ชำระสินเชื่อ
          </Box>
          <Divider />
         <TextField size='small' error={!errors.customeremail} type="text" name="customeremail" value={input.customeremail} onChange={onChange}
         InputProps={{startAdornment:<InputAdornment position='start'>อีเมล:</InputAdornment>}}/>
     
         <TextField size='small' type="text" name="refno" value={input.refno} InputProps={{startAdornment:<InputAdornment position='start'>เลขที่อ้างอิง:</InputAdornment>,readOnly:true}}/>
       
         <TextField size='small' type="text" name="merchantid" value={import.meta.env.VITE_MERCHANTID} InputProps={{startAdornment:<InputAdornment position='start'>รหัสร้านค้า:</InputAdornment>,readOnly:true}}/>
      
         <TextField size='small' type="text" name="cc" value="00" sx={{display:'none'}}/>
         <TextField size='small' error={!errors.total}  type="text" name="total" value={input.total}  onChange={onChange}
          InputProps={{startAdornment:<InputAdornment position='start'>จำนวนเงิน:</InputAdornment>,endAdornment:<InputAdornment position='end'>บาท</InputAdornment>}}/>
       
         <TextField size='small' type="text" name="lang" value="TH" sx={{display:'none'}}/>
         <TextField size='small' select name="channel"
         onChange={onChange}
          InputProps={{startAdornment:<InputAdornment position='start'>ช่องทางการชำระ:</InputAdornment>}}>
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
         <TextField size='small' type="text" name="productdetail" value={details} multiline rows={4} 
          InputProps={{startAdornment:<InputAdornment  sx={{alignItems:'start'}} position='start'>รายละเอียด:</InputAdornment>,readOnly:true, sx:{alignItems:'start'}}}/>
         <Button disabled={ok} className="btn-1" variant="contained" type="submit" sx={{my:5,bgcolor:ok ?'#a0a0a0 !important' :'',color:ok ?'#000 !important' :''}}>
            ชำระสินเชื่อ
          </Button>
      </Stack>
    </Stack>
    
    </Stack>
  )
}

export default Paysolution
