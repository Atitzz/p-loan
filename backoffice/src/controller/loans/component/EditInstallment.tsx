import Capture from "@/component/Capture";
import { HttpContext, ToolsContext } from "@/context/Context";
import { CameraAlt } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
const startDate = dayjs(new Date());
const defaultInput = {
  paidAmount: 0,
  type: "cash",
  paymentDate: startDate,
  image: "",
};
function EditInstallment({ open, onClose, onSubmit, data }) {
  const { Post, ErrorResponse, MessageResponse } = useContext(HttpContext);
  const { toDate, toFloat, paymentCalculator } = useContext(ToolsContext);
  const [input, setInput] = useState(defaultInput);
  const [demo, setDemo] = useState({
    days: 0,
    daysInYear: 0,
    principle: 0,
    interest: 0,
    max_pay: 0,
    mini_pay: 0,
    nor_pay: 0,
    close_pay: 0,
    installment: 1,
    total_installment: 12,
    paid_interest: 0,
    paid_principle: 0,
    principle_remaining: 0,
    interest_remaining: 0,
    delay_charge: 0,
    delay_times: 0,
    delay_days: 0,
  });
  useEffect(() => {
    setInput({
      ...defaultInput,
      paymentDate: dayjs(data?.installment_due || new Date())
    });
  }, [open]);
  const [isCal, setIsCal] = useState(false);
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "paidAmount") {
      const regex = /^\d*\.?\d*$/;
      if (regex.test(value) || value === "") {
        setInput({ ...input, [name]: value });
      }
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const handleOnSubmit = () => {
    onSubmit({
      ...input,
      paidAmount: isNaN(input.paidAmount) ? 0 : Number(input.paidAmount),
    });
    onClose();
    setInput(defaultInput);
  };

  const handleOnCalcurate = () => {
    console.log(data);
    Post(`loan/payment/calcurate`, {
      amount: data.amount,
      remaining: data.remaining,
      interest_rate: data.interestRate,
      total_installment: data.total_installment,
      installment_date:data.installment_start,
      payment_date:input.paymentDate,
      pay: 0,
      interest_stack: data.overdue_balance,
      installment: data.given_installment,
      type_interest: data.type_interest,
      pay_days:data.pay_days,
      delay_value:data.delay_value,
      delay_charge:data.delay_charge
    }).then((res) => {
      // console.log(res.data);
      const response = res.data.data
      setIsCal(true);
      setDemo(response);
      setInput((prev) => {
        return {
          ...prev,
          paidAmount: response.nor_pay,
        };
      });
    });
    // const response = paymentCalculator(
    //   data.amount,
    //   data.remaining,
    //   data.interestRate,
    //   data.total_installment,
    //   data.installment_start,
    //   input.paymentDate,
    //   data.per_installment,
    //   data.overdue_balance,
    //   data.given_installment,
    //   data.pay_days,
    //   data.delay_value,
    //   data.delay_charge
    // );
    // setIsCal(true);
    // setDemo(response);
    // setInput((prev) => {
    //   return {
    //     ...prev,
    //     paidAmount: response.nor_pay,
    //   };
    // });
  };

  const selectChecker = (amount) => {
    if (
      amount !== demo.close_pay &&
      amount !== demo.max_pay &&
      amount !== demo.mini_pay &&
      amount !== demo.nor_pay
    )
      return Number(amount);
    return 0;
  };
  // const [cap, setCap] = useState(false);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* <Capture
        open={cap}
        onClose={() => setCap(false)}
        onSave={(e) =>
          setInput((prev) => {
            return { ...prev, image: e };
          })
        }
        person={false}
        width={350}
        height={350}
      /> */}
      <DialogTitle sx={{ textAlign: "center" }}>แก้ไขการชำระสินเชื่อ</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Stack direction="row" gap={2}>
            <Stack gap={2} sx={{ flex: 2 }}>
              <Stack direction="row" gap={2}>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>กำหนดชำระ: </strong>
                  </Typography>
                  <Typography variant="body1">
                    {toDate(data?.installment_due, 1)}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ยอดกู้: </strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(data?.amount)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={2}>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>งวดที่: </strong>
                  </Typography>
                  <Typography variant="body1">{`${data?.given_installment}/${data?.total_installment}`}</Typography>
                </Stack>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ยอดคงเหลือ: </strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(data?.remaining)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={2}>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ยอดชำระ/งวด</strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(demo.nor_pay)}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ยอดค้างชำระ</strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(data?.overdue_balance)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={2}>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>เงินต้น</strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(demo.principle)}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ดอกเบี้ย</strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(demo.interest)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={2}>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ชำระเต็มจำนวน</strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(demo.max_pay)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={2}>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ชำระขั้นต่ำ</strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(demo.mini_pay)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={2}>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ค่าทวงถาม</strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(demo.delay_charge)}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2} sx={{ flex: 1 }}>
                  <Typography variant="body1">
                    <strong>ปิดสัญญา</strong>
                  </Typography>
                  <Typography variant="body1">
                    {toFloat(demo.close_pay)}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
            </Stack>
            {/* <Stack
              sx={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              {input.image != "" ? (
                <Button
                variant="outlined"
                sx={{ width: 200, height: 200 }}
                onClick={() => setCap(true)}
              >
              <img src={input.image} width="100%" />
              </Button>
               
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<CameraAlt />}
                  sx={{ width: 200, height: 200 }}
                  onClick={() => setCap(true)}
                >
                  ถ่ายภาพ
                </Button>
              )}
            </Stack> */}
          </Stack>
          <Stack sx={{ gap: 2, my: 2 }}>
            <DatePicker
              format="DD/MM/YYYY"
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              value={input.paymentDate}
              onChange={(newValue) =>
                onChange({ target: { name: "paymentDate", value: newValue } })
              }
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleOnCalcurate}
              fullWidth
            >
              คำนวนยอดชำระ
            </Button>
          </Stack>
          <Divider />
          {isCal && (
            <Stack sx={{ gap: 3 }}>
              <TextField
                select
                label="ชำระจำนวน"
                name="paidAmount"
                value={input.paidAmount}
                onChange={onChange}
              >
                <MenuItem value={demo.nor_pay}>ชำระปกติ</MenuItem>
                {demo.nor_pay !== demo.max_pay && (
                  <MenuItem value={demo.max_pay}>ชำระเต็มจำนวน</MenuItem>
                )}
                <MenuItem value={demo.mini_pay}>ชำระขั้นต่ำ</MenuItem>
                <MenuItem value={demo.close_pay}>ปิดสัญญา</MenuItem>
                <MenuItem value={selectChecker(Number(input.paidAmount))}>
                  ระบุเอง
                </MenuItem>
              </TextField>
              <TextField
                label="ชำระจำนวน"
                name="paidAmount"
                value={input.paidAmount}
                onChange={onChange}
                inputProps={{
                  inputMode: "decimal",
                  pattern: "[0-9]*\\.?[0-9]*",
                }}
              />
              <TextField
                select
                label="ช่องทางการชำระ"
                name="type"
                value={input.type}
                onChange={onChange}
              >
                <MenuItem value={"cash"}>เงินสด</MenuItem>
                <MenuItem value={"transfer"}>เงินโอน</MenuItem>
              </TextField>

              <Button variant="contained" onClick={handleOnSubmit} fullWidth>
                ชำระสินเชื่อ
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default EditInstallment;
