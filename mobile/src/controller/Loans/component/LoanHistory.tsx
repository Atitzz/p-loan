import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { ArrowForwardIos } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadScreen from "@/component/LoadScreen";
import LoanSlip from "./LoanSlip";

function LoanHistory() {
  const { loan_id } = useParams();
  const navigate = useNavigate();
  const { auth, AddAlert } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toTHB, toDate } = useContext(ToolsContext);
  const [load,setLoad] = useState(false);
  const [data, setData] = useState([]);
  const [loan, setLoan] = useState({
    id: -1,
    loan_number: "",
    plan: "",
    amount: "00000000",
    per_installment: "00000000",
    given_installment: 0,
    total_installment: 12,
    receivable: "00000000",
    delay_charge: "0.00000000",
    delay_value: 12,
    total_paid: "0.00000000",
    remaining: "00000000",
  });
  useEffect(() => {
    Get(`loan/installment/logs/${loan_id}`).then((res) => {
      setData(res.data.data.installment);
      setLoan(res.data.data.loan_summary)
    });
    setTimeout(() => {
      setLoad(true);
    }, 750);
  }, [loan_id]);

  const [details, setDetails] = useState({});
  const [dialogDetails, setDialogDetails] = useState(false);
  const onOpenDetails = (id) => {
    setDialogDetails(true);
    const __existData = data.find((d) => d.id === id);
    if (!__existData) AddAlert("ไม่พบข้อมูลที่คุณเลือก", "error");
    setDetails(__existData);
  };

  return (
    <>
    {!load ? (
      <LoadScreen/>
    ) : (
    <>
      <LoanSlip
        open={dialogDetails}
        onClose={() => setDialogDetails(false)}
        data={details}
        loan={loan}
      />
      <Stack
        sx={{
          height: "100vh",
          width: "100vw",
          justifyContent: "space-between",
          textAlign: "start",
          overflow: "auto",
          background:
            "linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(219,174,91,1) 100%)",
        }}
      >
        <Stack>
          <Box sx={{ background: "var(--color1)", py: "25px", px: 4 }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
              ประวัติการชำระ
            </Typography>
          </Box>
          <Stack
            sx={{ flex: 1, gap: 2, p: 2, maxHeight: "78vh", overflow: "auto" }}
          >
            {data.length < 1 ? (
              <Stack
                sx={{ p: 5, justifyContent: "center", textAlign: "center" }}
              >
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  ไม่พบรายการในขณะนี้
                </Typography>
              </Stack>
            ) : (
              data.reverse().map((row, index) => (
                <Stack
                  key={index}
                  sx={{ p: 2, bgcolor: "var(--color2)", borderRadius: 2 }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack gap={1.5} sx={{ px: 2 }}>
                      <Typography
                        variant="body1"
                        children={toDate(row.installment_date, 9)}
                      />

                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: "center" }}
                      >
                        <Box
                          sx={{
                            border: 1,
                            p: 0.5,
                            color: row.isPaid ? "limegreen" : "orange",
                          }}
                        >
                          <Typography
                            variant="body2"
                            children={row.isPaid ? "สำเร็จ" : "รอการชำระ"}
                          />
                        </Box>
                      </Stack>
                      <Typography
                        variant="body1"
                        children={`วันครบกำหนดชำระ : ${toDate(
                          row.installment_date,
                          1
                        )}`}
                      />
                    </Stack>
                    <Stack direction="row" sx={{ alignItems: "center" }}>
                      <Typography variant="h6" children={toTHB(row.paid)} />
                      <Box sx={{ p: 2 }}>
                        <IconButton onClick={() => onOpenDetails(row.id)}>
                          <ArrowForwardIos />
                        </IconButton>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              ))
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
    )}
    </>
  );
}

export default LoanHistory;
