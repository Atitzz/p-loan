import { ToolsContext } from "@/context/Context";
import { Close } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Modal,
  keyframes,
  Button,
  Typography,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Divider,
  InputLabel,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

function LoanSlip({ open, onClose, data, loan }) {
  const { toFloat, toDate } = useContext(ToolsContext);

  const getBillingNumber = (id) =>{
    const __year = Number((new Date()
    .getFullYear()+543)
    .toString()
    .slice(2, 4))
    return `L${__year}${id?.toString().padStart(5,"0")}`
  }
  return (
    <Modal open={open} onClose={onClose}>
         <Box
        sx={{
          p: 6,
          height: "100vh",
          background: "#00000025",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems:"center"
        }}
      >
     
        <Stack component={Paper} sx={{width:'57mm',p:2}}>
     <Stack gap={2}> 
      <Stack direction='row' gap={2} sx={{flex:1,justifyContent:'center'}}>
          <Typography variant="body1"><strong>ใบเสร็จ </strong></Typography>
        </Stack>
      <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>บริษัท มันนี่ฟอร์ยู จำกัด </strong></Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>2/69 ซ.สุขุมวิท 42 แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร 10110</strong></Typography>
        </Stack>
      <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>เลขที่ใบเสร็จ: </strong></Typography>
          <Typography variant="body2">{data?.receipt_number}</Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>เลขที่สัญญา: </strong></Typography>
          <Typography variant="body2">{data?.loan_number}</Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>วันที่ชำระ: </strong></Typography>
          <Typography variant="body2">{toDate(data?.given_at,1)}</Typography>
        </Stack>
        <Stack direction='row' gap={2}>
        <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>งวดที่: </strong></Typography>
          <Typography variant="body2">{`${data?.installment}/${data?.total_installment}`}</Typography>
        </Stack>
        </Stack>
        <Divider/>
        <Stack direction='row' gap={2} sx={{flex:1,justifyContent:'space-between'}}>
        <Typography variant="body2"><strong>รายการ</strong></Typography>
        <Typography variant="body2"><strong>จำนวน</strong></Typography>
        </Stack>
        <Divider/>
       
        <Stack direction='row' gap={2} sx={{flex:1,justifyContent:'space-between'}}>
          <Typography variant="body2">เงินต้น</Typography>
          <Typography variant="body2">{`${toFloat(data?.principle_paid)}.-`}</Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{flex:1,justifyContent:'space-between'}}>
          <Typography variant="body2">ดอกเบี้ย</Typography>
          <Typography variant="body2">{`${toFloat(data?.interest_paid)}.-`}</Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{flex:1,justifyContent:'space-between'}}>
          <Typography variant="body2">ค่าทวงถาม</Typography>
          <Typography variant="body2">{`${toFloat(data?.delay_charge_paid)}.-`}</Typography>
        </Stack>
        <Divider/>
        <Stack direction='row' gap={2} sx={{flex:1,justifyContent:'space-between'}}>
        <Typography variant="body2"><strong>รวม</strong></Typography>
        <Typography variant="body2">{`${toFloat(data?.paid)}.-`}</Typography>
        </Stack>
        <Divider/>
        <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>ยอดกู้: </strong></Typography>
          <Typography variant="body2">{`${toFloat(data?.amount)}.-`}</Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>ยอดกู้คงเหลือ: </strong></Typography>
          <Typography variant="body2">{`${toFloat(data?.remaining)}.-`}</Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>ยอดค้างชำระ: </strong></Typography>
          <Typography variant="body2">{`${toFloat(data?.overdue_balance)}.-`}</Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{flex:1}}>
          <Typography variant="body2"><strong>ชำระโดย: </strong></Typography>
          <Typography variant="body2">{`${data?.paid_by || 'ไม่ระบุ'}`}</Typography>
        </Stack>
        <Stack sx={{gap:3}}>
        {/* <TextField label="ชำระจำนวน" name='paidAmount' value={input.paidAmount} onChange={onChange}/>
        
        <TextField select label="วิธีการชำระ" name='type' value={input.type} onChange={onChange}>
          <MenuItem value={'cash'}>เงินสด</MenuItem>
          <MenuItem value={'transfer'}>เงินโอน</MenuItem>
        </TextField> */}
        </Stack>
       
      </Stack>
      </Stack>
      <Box sx={{my:4}}>
      <Button variant='contained' color="error" onClick={onClose}>ปิดหน้าต่าง</Button>
      </Box>
    
      </Box>
    </Modal>
  );
}

export default LoanSlip
