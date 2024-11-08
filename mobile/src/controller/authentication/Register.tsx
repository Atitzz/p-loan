import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Modal,
  FormHelperText,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import img from "../../assets/img/logo2.png";
import { useNavigate, useParams } from "react-router-dom";
import MobileBody from "@/component/MobileBody";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 250,
  bgcolor: "background.paper",
  border: "2px solid #fff",
  borderRadius: "30px",
  boxShadow: 0,
  p: 4,
  textAlign: "center",
};

function Register() {
  const { line } = useParams();
  const navigate = useNavigate();
  const { AddAlert, setAuth } = useContext(MainContext);
  const { Post, ErrorResponse, MessageResponse } = useContext(HttpContext);
  const {} = useContext(ToolsContext);

  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
    remember: true,
    confirm_password: "",
    mobile: "",
    otp: "",
    ref: "",
    accept_privacy: "decline",
  });
  const [error, setErrors] = useState({
    email: true,
    username: true,
    password: true,
    confirm_password: true,
    mobile: true,
    otp: true,
    ref: true,
  });

  const [open, setOpen] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setButtonDisabled(false);
    }
  };

  const onAccept = () => {
    setOpen(false);
    setInput({ ...input, accept_privacy: "accept" });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const onChange = (e) => {
    const { name, value, checked } = e.target;
    setInput((prev) => {
      return {
        ...prev,
        [name]: name === "remember" ? checked : value,
      };
    });
  };
  const onSubmit = () => {
    if (input.password !== input.confirm_password || input.password.length < 7)
      return setErrors((prev) => {
        return {
          ...prev,
          password: false,
          confirm_password: false,
        };
      });
    Post(`register`, { ...input, line_id: line })
      .then((response) => {
        AddAlert(MessageResponse(response));
        navigate(`/`);
      })
      .catch((err) => {
        const data_type = err.response.data.system_response.data_type;
        if (data_type === "array") {
          const __errors = err.response.data.data;
          __errors.map((__obj) =>
            setErrors((prev) => {
              return {
                ...prev,
                [__obj.field]: false,
              };
            })
          );
        }
        AddAlert(ErrorResponse(err), "error");
      });
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
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
          <DialogContentText sx={{ whiteSpace: "pre-line",color:'black'  }}>
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
      <MobileBody>
        <Stack gap={2} sx={{ px: 5 }}>
          <Typography variant="h6" fontWeight={700}>
            สมัครสมาชิก
          </Typography>
          {/* <Box>
            <Typography variant="body1" textAlign={"start"} sx={{ ml: 2 }}>
              อีเมล *
            </Typography>
            <TextField
              fullWidth
              required={true}
              error={!error.email}
              id="input-with-sx"
              name="email"
              size="small"
              onChange={onChange}
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }}
            />
            {!error.email && (
              <FormHelperText sx={{ color: "red" }}>
                *กรุณาระบุอีเมล
              </FormHelperText>
            )}
          </Box>
          <Box>
            <Typography variant="body1" textAlign={"start"} sx={{ ml: 2 }}>
              ชื่อผู้ใช้ *
            </Typography>
            <TextField
              fullWidth
              required={true}
              error={!error.username}
              id="input-with-sx"
              name="username"
              size="small"
              onChange={onChange}
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }}
            />
            {!error.username && (
              <FormHelperText sx={{ color: "red" }}>
                *กรุณาระบุชื่อผู้ใช้งาน
              </FormHelperText>
            )}
          </Box> */}
          <Box>
            <Typography variant="body1" textAlign={"start"} sx={{ ml: 2 }}>
              เบอร์โทรศัพท์ *
            </Typography>
            <TextField
              fullWidth
              required={true}
              error={!error.mobile}
              id="input-with-sx"
              name="mobile"
              size="small"
              onChange={onChange}
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }}
            />
            {!error.mobile && (
              <FormHelperText sx={{ color: "red" }}>
                *หมายเลขโทรศัพไม่ถูกต้อง
              </FormHelperText>
            )}
          </Box>
          <Box>
            <Typography variant="body1" textAlign={"start"} sx={{ ml: 2 }}>
              รหัสผ่าน *
            </Typography>
            <TextField
              required={true}
              error={!error.password}
              id="input-with-sx"
              type="password"
              name="password"
              size="small"
              onChange={onChange}
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box>
            <Typography variant="body1" textAlign={"start"} marginLeft={2}>
              ยืนยันรหัสผ่าน
            </Typography>
            <TextField
              fullWidth
              type="password"
              variant="outlined"
              sx={textFieldStyles}
              InputLabelProps={{ shrink: true }}
              size="small"
              name="confirm_password"
              value={input.confirm_password}
              onChange={onChange}
              error={!error.confirm_password}
            />
            {!error.confirm_password && (
              <FormHelperText sx={{ color: "red" }}>
                *รหัสผ่าน และ ยืนยันรหัสผ่านต้องตรงกัน และ มีความยาวอย่างน้อย 8
                ตัวอักษร
              </FormHelperText>
            )}
          </Box>
          <Stack gap={2} sx={{ my: 2 }}>
            <Button
              disabled={input.accept_privacy != "accept"}
              fullWidth
              variant="contained"
              onClick={onSubmit}
              sx={{
                py: 0.75,
                px: 1.5,
                borderRadius: "25px",
                fontSize: "18px",
                bgcolor: "#000",
              }}
            >
              สมัคร
            </Button>
          </Stack>
          <Stack gap={1} sx={{ my: 5 }}>
            <Button
              fullWidth
              sx={{ color: "#000" }}
              onClick={() => navigate("/")}
            >
              เป็นสมาชิกอยู่แล้ว? เข้าสู่ระบบ
            </Button>
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
      </MobileBody>
    </React.Fragment>
  );
}

export default Register;
