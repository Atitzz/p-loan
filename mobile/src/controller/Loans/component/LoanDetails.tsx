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

function LoanDetails({ open, onClose, data, loan }) {
  const { toTHB, toDate } = useContext(ToolsContext);

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
          justifyContent: "space-around",
        }}
      >
        <Card sx={{ borderRadius: 2 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="h5" sx={{ p: 2 }}>
              ใบแจ้งยอดชำระ
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
          <Divider />
          <CardContent>
            <Stack gap={2}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Stack sx={{ flex: 1 }}>
                  <InputLabel>สินเชื่อ</InputLabel>
                  <Typography>{loan.plan}</Typography>
                </Stack>
                <Stack sx={{ flex: 1 }}>
                  <InputLabel>สถานะ</InputLabel>
                  <Typography sx={{color: data.isPaid ? 'limegreen' : 'orange'}}>
                    {data.isPaid ? "ชำระแล้ว" : "รอการชำระ"}
                  </Typography>
                </Stack>
               
              </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Stack sx={{ flex: 1 }}>
                  <InputLabel>เลขที่ใบเสร็จ</InputLabel>
                  <Typography>-</Typography>
                </Stack>
                <Stack sx={{ flex: 1 }}>
                  <InputLabel>เลขที่สินเชื่อ</InputLabel>
                  <Typography>{loan.loan_number}</Typography>
                </Stack>
                </Stack>
              
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Stack sx={{ flex: 1 }}>
                <InputLabel>วงเงินสินเชื่อ</InputLabel>
                <Typography>{toTHB(loan.amount)}</Typography>
              </Stack>
              <Stack sx={{ flex: 1 }}>
                <InputLabel>ยอดชำระรวม</InputLabel>
                <Typography>{toTHB(loan.total_paid)}</Typography>
              </Stack>
              </Stack>
              <Stack sx={{ flex: 1 }}>
                <InputLabel>วันที่รายการมีผล</InputLabel>
                <Typography>{toDate(data.date,1)}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Stack sx={{ flex: 1 }}>
                  <InputLabel>ยอดชำระ</InputLabel>
                  <Typography>{toTHB(data.amount)}</Typography>
                </Stack>

                <Stack sx={{ flex: 1 }}>
                  <InputLabel>ค่าทวงถาม</InputLabel>
                  <Typography>{toTHB(data.delay_charge)}</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Stack sx={{ flex: 1 }}>
                  <InputLabel>ชำระ</InputLabel>
                  <Typography>{toTHB(data.paid)}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
}

export default LoanDetails;
