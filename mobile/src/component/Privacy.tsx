import { HttpContext, MainContext } from "@/context/Context";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import  { useContext, useEffect, useState } from "react";
const defaultText = ` บริษัทของเราตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของคุณ
          เรามุ่งมั่นที่จะรักษาความปลอดภัยและความเป็นส่วนตัวของข้อมูลที่คุณมอบให้กับเรา
          ดังนั้น เราขอแจ้งให้คุณทราบเกี่ยวกับนโยบายความเป็นส่วนตัวของเราดังนี้
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
            ยกเว้นในกรณีที่ได้รับความยินยอมจากคุณ หรือเป็นไปตามข้อกำหนดของกฎหมาย
            หรือเพื่อวัตถุประสงค์ในการป้องกันและระงับการทุจริต
          </p>
          <p>
            4. การรักษาความปลอดภัยของข้อมูล
            เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึง การใช้
            การเปิดเผย การแก้ไข หรือการทำลายข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต
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
          <p>เราขอขอบคุณที่ไว้วางใจและเลือกใช้บริการของเรา</p>`
function Privacy({ open, onClose, onSubmit }) {
  const { privacy } =
  useContext(MainContext);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setButtonDisabled(false);
    }
  };
 
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Stack sx={{ textAlign: "center", color: "#1E90FF" }}>
          <Typography variant="h5">นโยบายความเป็นส่วนตัว</Typography>
          <Typography variant="h5">(Privacy Policy)</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent
        dividers
        style={{ maxHeight: "300px", overflowY: "scroll" }}
        onScroll={handleScroll}
      > 
        {/* <DialogContentText sx={{ whiteSpace: "pre-line", color: "black" }}> */}
        <Typography
      variant="body1"
      dangerouslySetInnerHTML={{ __html: privacy.message }}
    />
        {/* </DialogContentText> */}
      </DialogContent>
      <Box textAlign={"center"} sx={{ color: "red", fontSize: 10 }} p={1}>
        <span>กรุณาเลื่อนอ่านไปข้างล่างสุดเพื่อดำเนินการต่อ (version:{privacy.version})</span>
      </Box>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
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
          onClick={() => onSubmit()}
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
  );
}

export default Privacy;
