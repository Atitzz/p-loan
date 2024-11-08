import { Box, Button, Divider, Slider, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
const defaultInput = {
  plan_id: -1,
  amount: 0,
  installment: 0,
};
function TakeLoan({ loanPlans, onAccept, loanData }) {
  const { toTHB } = useContext(ToolsContext);
  const [input, setInput] = useState(defaultInput);

  useEffect(() => {
    setInput({
      plan_id: loanPlans.id,
      amount: Number(loanPlans.maximum_amount),
      installment: Number(loanPlans.rate.length-1),
    });
  }, []);
  const onChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const onClick = async () => {
    onAccept(true);
    loanData({ plan_id: loanPlans.id, ...input,installment: Number(loanPlans.rate[input.installment].installment)});
  };

  // const calculate = useMemo(() =>{
  //   const __interest_rate = Number(loanPlans.rate[input.installment].interest_rate);
  //   const __installment = Number(loanPlans.rate[input.installment].installment);
  //   const __application_charge = Number(loanPlans.application_percent_charge);
  //   const __total_interest = ((__interest_rate + __application_charge)/100)/12;
  //   const __interest_bath = input.amount*__total_interest;
  //   const __interest_per_month = Math.pow(1+ __total_interest,__installment)
  //   const __preAmount = __interest_bath*__interest_per_month
  //   const __preInterest = __interest_per_month - 1;
  //   const result = __preAmount/__preInterest;
  //   return result;
  // },[input]);

  const calculate = useMemo(() => {
    const __interest_rate = Number(loanPlans.rate[input.installment].interest_rate);
    const __installment = Number(loanPlans.rate[input.installment].installment);
    const __application_charge = Number(loanPlans.application_percent_charge);
    const __total_interest_rate = __interest_rate + __application_charge;

    if (loanPlans.type_interest === 'flatrate') {
      // Flat Rate calculation
      const totalInterest = (input.amount * (__total_interest_rate / 100) * (__installment / 12));
      const totalAmount = input.amount + totalInterest;
      const monthlyPayment = totalAmount / __installment;
      return {
        monthlyPayment: monthlyPayment,
        totalInterest: totalInterest,
        totalAmount: totalAmount,
      };
    } else {
      // Effective Rate calculation (ลดต้นลดดอก)
      const monthlyRate = (__total_interest_rate / 100) / 12;
      const __diff = input.amount * monthlyRate;
      const __pill = Math.pow(1 + monthlyRate, __installment);
      const __diff2 = __diff * __pill;
      const __pill2 = __pill - 1;
      const monthlyPayment = __diff2 / __pill2;
      const totalAmount = monthlyPayment * __installment;
      const totalInterest = totalAmount - input.amount;
      return {
        monthlyPayment: monthlyPayment,
        totalInterest: totalInterest,
        totalAmount: totalAmount,
      };
    }
  }, [input, loanPlans]);
  return (
    <Stack sx={{ textAlign: "start", gap: 2 }}>
      <Box sx={{ bgcolor: "#000", p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>
          ข้อมูลสินเชื่อ
        </Typography>
      </Box>
      <Stack sx={{ p: 4 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="body1">วงเงินสินเชื่อสูงสุด:</Typography>
          <Typography variant="body1">
            {toTHB(loanPlans.maximum_amount)} บาท
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="body1">อัตราดอกเบี้ยประมานการต่ำสุด:</Typography>
          <Typography variant="body1">
            {Number(loanPlans.rate[input.installment].interest_rate)+loanPlans.application_percent_charge}% ต่อปี
          </Typography>
        </Stack>
        <br />
        <Typography variant="body2">
          หมายเหตุ: ข้อมูลวงเงินสูงสุด อัตราดอกเบี้ยและยอดผ่อนชำระต่อเดือน
          ที่แสดงบนหน้าจอเป็นเพียงแค่ตัวอย่างข้อมูลคำนวนเบื้องต้น
          ซึ่งอัตราดอกเบี้ยที่แท้จริงอยู่ที่ 15%-36% ต่อปี
          โดยสามารถตรวจสอบได้จากเอกสาร/อีเมล แจ้งผลการอนุมัติ
          กรณีเลือกผ่อนระยะสั้น จะประหยัดดอกเบี้ยได้มากขึ้น
        </Typography>

        <br />
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="body1">ยอดผ่อนชำระต่อเดือน:</Typography>
          <Typography variant="body1">
            {/* {toTHB(calculate)} */}
            {toTHB(calculate.monthlyPayment)}
            บาท
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ bgcolor: "var(--color1)", color: "#fff", p: 3 }}>
        <Stack sx={{ p: 4 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="body1">วงเงินสินเชื่อสูงสุด:</Typography>
            <Typography variant="body1">{toTHB(input.amount)} บาท</Typography>
          </Stack>
          <Slider
            aria-label="amount"
            value={input.amount}
            name="amount"
            onChange={onChange}
            step={1000}
            sx={{ color: "#fff" }}
            min={Number(loanPlans.minimum_amount)}
            max={Number(loanPlans.maximum_amount)}
          />
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="body1">ระยะเวลาการผ่อน:</Typography>
            <Typography variant="body1">
              {loanPlans.rate[input.installment].installment} เดือน
            </Typography>
          </Stack>
          <Slider
            aria-label="total_installment"
            value={input.installment}
            name="installment"
            onChange={onChange}
            sx={{ color: "#fff" }}
            step={1}
            min={0}
            max={Number(loanPlans.rate.length-1)}
          />
        </Stack>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ my: 6, mx: 3 }}>
        <Button
          className="btn-1"
          onClick={onClick}
        >
          สมัครสินเชื่อ
        </Button>
      </Box>
    </Stack>
  );
}

export default TakeLoan;
