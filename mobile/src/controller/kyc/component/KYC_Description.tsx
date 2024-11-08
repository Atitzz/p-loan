import { HttpContext } from "@/context/Context";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import verifyImg from "@/assets/img/img2.png";
function KYC_Description({ onAccept }) {
  const onClick = async () => {
    onAccept(true);
  };
  return (
    <Stack sx={{ height: "100vh" }}>
      <Box
        sx={{ position: "fixed", top: 0, left: 0, width: "100vw", zIndex: 0 }}
      >
        <img
          src={verifyImg}
          width={"100%"}
          height={"100%"}
          alt={verifyImg}
          style={{ objectFit: "cover", height: "170px" }}
        />
      </Box>
      <Box
        sx={{ width: "100vw", height: "135px", bgcolor: "transparent" }}
      ></Box>
      <Box sx={{ px: 2, zIndex: 2, height: "100%" }}>
        <Container
          sx={{
            borderRadius: "20px 20px 0 0",
            backgroundColor: "#fff",
            border: "1px solid var(--color1)",
            height: "100%",
            p: 0,
          }}
        >
          <Box
            sx={{
              borderRadius: "20px 20px 0 0",
              bgcolor: "var(--color1)",
              textAlign: "start",
              p: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>
              ยืนยันตัวตน
            </Typography>
          </Box>
          <Box textAlign={"start"} p={3}>
            <Typography 
            variant="body1">
              การยืนยันตัวเป็นขั้นตอนสำคัญเพื่อความปลอดภัยของทรัพสินของท่านกรุณายื่นเอกสารดังต่อไปนี้
            </Typography>
            <ul>
                    <li>ชื่อ - นามสกุล</li>
                    <li>เลขที่บัตรประชาชน</li>
                    <li>สมุดบัญชี</li>
                    <li>อื่นๆ</li>
                  </ul>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ my: 6, mx: 3 }}>
            <Button className="btn-1" onClick={onClick}>
              ยื่นเอกสารยืนตันตัวตน
            </Button>
          </Box>
        </Container>
      </Box>
    </Stack>
  );
}

export default KYC_Description;
