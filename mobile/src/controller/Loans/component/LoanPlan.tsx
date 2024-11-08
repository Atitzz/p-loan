import { HttpContext } from "@/context/Context";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import default_logo from "@/assets/img/default_logo.png";
import { useEffect, useState } from "react";
import LoadScreen from "@/component/LoadScreen";
function LoanPlan({ loanPlans, onAccept }) {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 750);
  }, []);
  const onClick = async () => {
    onAccept(true);
  };
  return (
    <>
      {!load ? (
        <LoadScreen/>
      ) : (
        <Stack sx={{ minHeight: "100vh" }}>
          {loanPlans.images && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                zIndex: 0,
              }}
            >
              <img
               src={loanPlans.images ? `${import.meta.env.VITE_BASE}/file/${loanPlans.images}` : default_logo}
                // src={loanPlans.images}
                width={"100%"}
                height={"100%"}
                alt={loanPlans.images}
                style={{ objectFit: "cover", height: "170px" }}
              />
            </Box>
          )}

          <Box
            sx={{
              zIndex: 2,
              position: "fixed",
              top: 100,
              width: "100%",
              px: 2,
            }}
          >
            <Container
              sx={{
                borderRadius: "20px 20px 0 0",
                backgroundColor: "#fff",
                border: "1px solid var(--color1)",
                p: 0,
                height: "100vh",
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
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#fff" }}
                >
                  {loanPlans.name}
                </Typography>
              </Box>
              <Box
                textAlign={"start"}
                p={3}
                sx={{ minHeight: "58vh", maxHeight: "58vh", overflowY: "auto" }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {loanPlans.title}
                </Typography>
                <Typography
                  variant="subtitle2"
                  dangerouslySetInnerHTML={{ __html: loanPlans.description }}
                />
              </Box>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ my: 6, mx: 3 }}>
                <Button className="btn-1" onClick={onClick}>
                  สมัครสินเชื่อ
                </Button>
              </Box>
            </Container>
          </Box>
        </Stack>
      )}
    </>
  );
}

export default LoanPlan;
