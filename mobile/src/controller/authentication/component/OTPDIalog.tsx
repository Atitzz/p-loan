import MobileBody from "@/component/MobileBody";
import { HttpContext, MainContext } from "@/context/Context";
import { Replay } from "@mui/icons-material";
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormHelperText,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const textFieldStyles = {
  flex: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
    "&.Mui-focused fieldset": {
      borderColor: "#D2720DD9",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D2720DD9",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D2720DD9",
  },
};
const digitOnly = /^\d+$/;
function OTPDIalog({ open }) {
  const { AddAlert, setAuth, auth } = useContext(MainContext);
  const { Post, ErrorResponse, MessageResponse } = useContext(HttpContext);
  const [mobileValidate, setMobileValidate] = useState({
    error: false,
    text: "",
  });
  const navigate = useNavigate();
  const [input, setInput] = useState({
    mobile: "",
    otp: "",
    token: "",
    ref_code: "",
  });

  const onChange = (event) => {
    if (event.target.name == "mobile") {
      if (!digitOnly.test(event.target.value)) {
        setMobileValidate({
          error: true,
          text: "กรุณาระบุเฉพาะตัวเลขเท่านั้น",
        });
      } else if (event.target.value.length > 10)
        setMobileValidate({
          error: true,
          text: "หมายเลขโทรศัพท์ต้องไม่เกิน 10 หลัก",
        });
      else if (event.target.value.length < 10)
        setMobileValidate({
          error: true,
          text: "หมายเลขโทรศัพท์ต้องมากกว่า 10 หลัก",
        });
      else
        setMobileValidate({
          error: false,
          text: "",
        });
    }
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const [req, setReq] = useState(false);
  const [count, setCount] = useState(0);

  const resendOTP = async () => {
    if(mobileValidate.error) return AddAlert('โปรดตรวจสอบความถูกต้องของเบอร์โทร!','error')
    try {
      const response = await Post(`resendotp`, input);
      setInput((prev) => {
        setReq(true);
        const interval = setInterval(() => {
          setCount((prevCount) => {
            if (prevCount >= 60) {
              clearInterval(interval); // หยุดเมื่อครบ 60 ครั้ง
              setReq(false);
              return 0;
            }
            return prevCount + 1;
          });
        }, 1000); // นับทุกๆ 1 วินาที
        return { ...prev, ...response.data.data };
      });
      AddAlert(MessageResponse(response));
    } catch (error) {
      AddAlert(ErrorResponse(error), "error");
    }
  };

  const verify = async () => {
    try {
      const response = await Post("verifyotp", {
        id: auth.id,
        mobile: input.mobile,
        otp_code: input.otp,
      });
      setAuth(response.data.data);
      AddAlert(MessageResponse(response));
      navigate("/signin");
    } catch (error) {
      AddAlert(ErrorResponse(error), "error");
    }
  };

  const [show, setShow] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [accept, setAccept] = useState(true);
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setButtonDisabled(false);
    }
  };

  const onAccept = () => {
    setAccept(false);
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  return (
    <Box
      sx={{
        bgcolor: "var(--color2)",
        textAlign: "center",
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: 999,
        display: open ? "block" : "none",
      }}
    >
      <MobileBody>
        <Stack sx={{ flex: 1, justifyContent: "space-around" }}>
          <Stack gap={2} sx={{ p: 5 }}>
            <Box component="h2">กรุณายืนยัน OTP </Box>
            <Box>
              <TextField
                error={mobileValidate.error}
                size="small"
                fullWidth
                sx={textFieldStyles}
                name="mobile"
                onChange={onChange}
                placeholder="หมายเลขโทรศัพท์"
              />
              {mobileValidate.error && (
                <FormHelperText sx={{ color: "#eb0000" }}>
                  *{mobileValidate.text}
                </FormHelperText>
              )}
            </Box>
            <Box component="span" sx={{ textAlign: "start" }}>
              {`รหัสอ้างอิง (REF : ${input.ref_code})`}
            </Box>
            <Box sx={{ textAlign: "start" }}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  size="small"
                  fullWidth
                  sx={textFieldStyles}
                  name="otp"
                  onChange={onChange}
                  placeholder="OTP CODE"
                />
                <Button
                  endIcon={<Replay />}
                  sx={{ position: "absolute", right: 2, top: 2 }}
                  onClick={resendOTP}
                  disabled={req}
                >
                  {count > 0 ? `${60 - Number(count)} วิ` : `ส่งรหัสยืนยัน`}
                </Button>
              </Box>
              <FormHelperText sx={{ color: "red" }}>
                *กรุณาระบุหมายเลข OTP ที่ได้รับ
              </FormHelperText>
            </Box>
            <Button
            disabled={input.ref_code === ''}
              variant="contained"
              onClick={verify}
              sx={{
                py: 0.75,
                px: 1.5,
                borderRadius: "25px",
                fontSize: "18px",
                bgcolor: "#000",
              }}
            >
              ยืนยัน
            </Button>
            <Stack gap={1} sx={{ my: 2 }}>
              {/* <Button fullWidth sx={{ color: "#000" }} onClick={()=>navigate('/signup')}>
              ยังไม่ได้เป็นสมาชิก? สมัครใช้งาน
            </Button> */}
            </Stack>
          </Stack>
          <Stack gap={1}>
            <Stack direction="row" gap={1} sx={{ justifyContent: "center" }}>
              <Typography variant="subtitle2">
                นโยบายการรักษาความปลอดภัยของข้อมูล
              </Typography>
              <Button
                onClick={handleOpen}
                sx={{
                  color: "var(--color1)",
                  fontWeight: 700,
                  padding: 0,
                  minWidth: 0,
                }}
              >
                &nbsp;อ่านต่อ
              </Button>
            </Stack>
            <Stack direction="row" gap={1} sx={{ justifyContent: "center" }}>
              <Typography variant="subtitle2">
                ศึกษารายละเอียดเพิ่มเติมเกี่ยวกับ&nbsp;..............&nbsp;
              </Typography>
              <Button
                onClick={handleOpen}
                sx={{
                  color: "var(--color1)",
                  fontWeight: 700,
                  padding: 0,
                  minWidth: 0,
                }}
              >
                &nbsp;ที่นี่
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Dialog open={show} onClose={handleClose}>
          <DialogTitle>
            <Stack sx={{ textAlign: "center", color: "Highlight" }}>
              <Typography variant="h5">นโยบายความเป็นส่วนตัว</Typography>
              <Typography variant="h5">(Privacy Policy)</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent
            dividers
            style={{ maxHeight: "300px", overflowY: "scroll" }}
            onScroll={handleScroll}
          >
            <DialogContentText sx={{ whiteSpace: "pre-line", color: "black" }}>
              บริษัทของเราตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของคุณ
              เรามุ่งมั่นที่จะรักษาความปลอดภัยและความเป็นส่วนตัวของข้อมูลที่คุณมอบให้กับเรา
              ดังนั้น
              เราขอแจ้งให้คุณทราบเกี่ยวกับนโยบายความเป็นส่วนตัวของเราดังนี้
              <p>
                1. การเก็บรวบรวมข้อมูลส่วนบุคคล
                เราจะเก็บรวบรวมข้อมูลส่วนบุคคลของคุณเมื่อคุณสมัครใช้บริการสินเชื่อของเรา
                ข้อมูลที่เราเก็บรวบรวมอาจรวมถึงชื่อ ที่อยู่ เบอร์โทรศัพท์ อีเมล
                และข้อมูลการเงินที่จำเป็นสำหรับการพิจารณาสินเชื่อ
              </p>
              <p>
                2. การใช้ข้อมูลส่วนบุคคล
                เราจะใช้ข้อมูลส่วนบุคคลของคุณเพียงเพื่อวัตถุประสงค์ในการให้บริการสินเชื่อและบริการอื่นๆ
                ที่เกี่ยวข้อง รวมถึงการตรวจสอบและประเมินคำขอสินเชื่อ
                การติดต่อสื่อสารกับคุณ และการปฏิบัติตามกฎหมายและระเบียบข้อบังคับ
              </p>
              <p>
                3. การเปิดเผยข้อมูลส่วนบุคคล
                เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สาม
                ยกเว้นในกรณีที่ได้รับความยินยอมจากคุณ
                หรือเป็นไปตามข้อกำหนดของกฎหมาย
                หรือเพื่อวัตถุประสงค์ในการป้องกันและระงับการทุจริต
              </p>
              <p>
                4. การรักษาความปลอดภัยของข้อมูล
                เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึง
                การใช้ การเปิดเผย การแก้ไข
                หรือการทำลายข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต
                เราจะเก็บข้อมูลของคุณในระบบที่มีการป้องกันและจำกัดการเข้าถึง
              </p>
              <p>
                5. การเข้าถึงและแก้ไขข้อมูลส่วนบุคคล
                คุณมีสิทธิ์ในการเข้าถึงและขอแก้ไขข้อมูลส่วนบุคคลของคุณที่เราเก็บรวบรวม
                หากคุณต้องการเข้าถึงหรือแก้ไขข้อมูลส่วนบุคคลของคุณ
                กรุณาติดต่อเราผ่านช่องทางที่ระบุไว้ในเว็บไซต์ของเรา
              </p>
              <p>
                6. การเก็บรักษาข้อมูล
                เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณตามระยะเวลาที่จำเป็นสำหรับวัตถุประสงค์ในการให้บริการสินเชื่อและการปฏิบัติตามกฎหมายและระเบียบข้อบังคับ
                เมื่อข้อมูลส่วนบุคคลของคุณไม่มีความจำเป็นสำหรับวัตถุประสงค์ดังกล่าวแล้ว
                เราจะทำการลบหรือทำให้ข้อมูลดังกล่าวไม่สามารถระบุตัวตนได้
              </p>
              <p>
                7. การใช้คุกกี้
                เราอาจใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานเว็บไซต์ของคุณ
                คุกกี้เป็นไฟล์ขนาดเล็กที่ถูกเก็บไว้ในอุปกรณ์ของคุณเมื่อคุณเยี่ยมชมเว็บไซต์
                คุณสามารถตั้งค่าเบราว์เซอร์ของคุณให้ปฏิเสธคุกกี้ได้
                แต่อาจส่งผลกระทบต่อการทำงานของเว็บไซต์บางส่วน
              </p>
              <p>
                8. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว
                เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงนโยบายความเป็นส่วนตัวนี้ได้ทุกเวลา
                หากมีการเปลี่ยนแปลงนโยบายความเป็นส่วนตัว
                เราจะแจ้งให้คุณทราบผ่านทางเว็บไซต์ของเรา ติดต่อเรา
              </p>
              <p>
                หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวของเรา
                กรุณาติดต่อเราผ่านทางช่องทางที่ระบุไว้ในเว็บไซต์ของเรา
              </p>
              <p>เราขอขอบคุณที่ไว้วางใจและเลือกใช้บริการของเรา</p>
            </DialogContentText>
          </DialogContent>
          <Box textAlign={"center"} sx={{ color: "red", fontSize: 10 }} p={1}>
            <span>กรุณาเลื่อนอ่านไปข้างล่างสุดเพื่อดำเนินการต่อ</span>
          </Box>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={handleClose}
              variant="contained"
              fullWidth
              sx={{
                py: 0.75,
                px: 1.5,
                borderRadius: "25px",
                fontSize: "18px",
                bgcolor: "#000",
              }}
            >
              ปฏิเสธ
            </Button>
            <Button
              onClick={onAccept}
              fullWidth
              variant="contained"
              sx={{
                py: 0.75,
                px: 1.5,
                borderRadius: "25px",
                fontSize: "18px",
                bgcolor: "var(--color1)",
              }}
              disabled={buttonDisabled}
            >
              ยอมรับ
            </Button>
          </DialogActions>
        </Dialog>
      </MobileBody>
    </Box>
  );
}

export default OTPDIalog;
