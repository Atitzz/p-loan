import { MainContext, ToolsContext } from "@/context/Context";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

export const A4_Paper = ({ loanPlan }) => {
  const { auth, AddAlert } = useContext(MainContext);
  const { toTHB, toDate, toFloat, NumberToThaiWords, calcurateAge } =
    useContext(ToolsContext);
  const [loan, setLoan] = useState<any>();
  useEffect(() => {
    setLoan(loanPlan);
  }, [loanPlan]);
  return (
    <Stack
      sx={{ bgcolor: "#fff", width: "210mm", height: "297mm", color: "#000",textAlign:'start' }}
    >
      <Stack gap={2} sx={{ m: 5, color: "#000" }}>
        <Box sx={{ textAlign: "center", bgcolor: "var(--color1)", p: 2 }}>
          <Typography variant="h5">สัญญากู้ยืมเงิน</Typography>
        </Box>
        <Stack direction="row" gap={4}>
          <Stack direction="row" sx={{ flex: 2, gap: 1 }}>
            <Typography variant="body2">เลขที่สัญญา</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              {loan?.loan_number || ""}
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ flex: 2, gap: 1 }}>
            <Typography variant="body2">ทำที่ </Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              บริษัท มันนี่ ฟอร์ยู จำกัด
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={4}>
          <Stack direction="row" sx={{ flex: 2, gap: 1 }}></Stack>

          <Stack direction="row" sx={{ flex: 2, gap: 1 }}>
            <Typography variant="body2">วันที่ </Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              {toDate(loan?.created_at || "", 1)}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2" sx={{ pl: 15 }}>
              ข้าพเจ้า
            </Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              {`${auth.titlename} ${auth.firstname} ${auth.lastname}`}
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">
              ถือบัตรประจำตัวประชาชนเลขที่{" "}
            </Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              {auth?.citizen_id || ""}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="body2">อายุ </Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              {`20 ปี`}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="body2">ที่อยู่ตามทะเบียนบ้านเลขที่</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              147
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="body2">หมู่ที่</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              10
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="body2">ตรอก/ซอย</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              พระราม 2 44
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">ถนน</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              พระราม 2
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">ตำบล/แขวง</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              จอมทอง
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">อำเภอ/เขต</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              จอมทอง
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">จังหวัด</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              กรุงเทพ
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">สถานที่ทำงานปัจจุบัน บริษัท</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              Musion co.,ltd
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="body2">เลขที่</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              147
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="body2">หมู่ที่</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              10
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Typography variant="body2">ตรอก/ซอย</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              พระราม 2 44
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">ถนน</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              พระราม 2
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">ตำบล/แขวง</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              จอมทอง
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">อำเภอ/เขต</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              จอมทอง
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">จังหวัด</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              กรุงเทพ
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">
              ในฐานะ "ผู้กู้" ฝ่ายหนึ่ง กับบริษัท
            </Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              บริษัท มันนี่ ฟอร์ยู จำกัด
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">มีสถานประกอบการอยู่ที่</Typography>
            <Typography
              variant="body2"
              sx={{ borderBottom: "1px solid #000000", flex: 1 }}
            >
              2/69 ซ.สุขุมวิท 42 แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร 10110
            </Typography>
            <Typography variant="body2">
              ในฐานะ "ผู้ให้กู้" อีกฝ่ายหนึ่ง
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
            <Typography variant="body2">
              คู่ตกลงทั้งสองฝ่ายตกลงทำสัญญา
              โดยผู้กู้ตกลงยินยอมผูกพันตามข้อกำหนดและเงื่อนไขสัญญาสินเชื่อตามรายละเอียดดังต่อไปนี้
            </Typography>
          </Stack>
        </Stack>
        <ol>
          <li>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body2">
                  <strong>จำนวนเงินที่กู้ </strong>
                  ผู้กู้ตกลงขอสินเชื่อจากผู้ให้กู้ในรูปแบบของเงินกู้ยืม
                  ตามรายละเอียดที่ระบุไว้ในใบสมัครสินเชื่อ
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body2">
                  มันนี่ ฟอร์ยูและสัญญานี้ โดยผู้กู้ได้กู้ยืมเงินจากผู้ให้กู้
                  เป็นจำนวนเงิน
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ borderBottom: "1px solid #000000" }}
                >
                  {toFloat(loan?.amount || 0)} บาท
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ borderBottom: "1px solid #000000" }}
                >
                  ({NumberToThaiWords(loan?.amount || 0)})
                </Typography>
              </Stack>
            </Stack>
          </li>
          <li>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body2"><strong>การเบิกใช้สินเชื่อ </strong> 
                  ผู้ให้กู้จะมอบเงินกู้ให้แก่ผู้กู้ทั้งจำนวนเพียงครั้งเดียวในวันที่ผู้ให้กู้กำหนด
                  โดยผู้ให้กู้จะนำเงินเข้าบัญชีธนาคารของผู้กู้ตามที่ระบุไว้ในใบสมัคร
                  และ/หรือ ส่งมอบเงินกู้
                  โดยวิธีการอื่นใดตามที่ทั้งสองฝ่ายตกลงกัน ทั้งนี้ ภายใต้ รูปแบบ
                  วิธีการ และเงื่อนไขที่ผู้ให้กู้กำหนด
                  และเมื่อผู้ให้กู้ได้โอนเงินไปยังบัญชีของผู้กู้
                  หรือดำเนินการอื่นใดอันเป็นการส่งมอบเงินกู้ตามวิธีการอื่นใดที่ได้ตกลงกันแล้ว
                  ให้ถือว่าผู้กู้ได้รับเงินกู้จากผู้ให้กู้ครบถ้วนถูกต้องแล้วทั้งจำนวนที่ได้รับอนุมัติ
                  แม้ว่าผู้กู้จะยังไม่ได้เบิกถอน หรือนำไปใช้จ่าย
                  และ/หรือดำเนินการใดๆก็ตาม
                </Typography>
              </Stack>
            </Stack>
          </li>
        </ol>
      </Stack>
    </Stack>
  );
};
