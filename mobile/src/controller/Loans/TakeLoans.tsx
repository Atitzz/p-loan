import { HttpContext, MainContext } from "@/context/Context";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LoanPlan from "./component/LoanPlan";
import ApplyLoan from "./component/ApplyLoan";
import TakeLoan from "./component/TakeLoan";
function TakeLoans() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const [loanPlans, setLoanPlans] = useState<any>([]);
  const [appForm, setAppForm] = useState([]);
  const [loanData, setLoanData] = useState<any>({});
  const [accept, setAccept] = useState(false);
  const [takeloan, setTakeLoan] = useState(false);
  const [apply, setApplyLoan] = useState(false);
  useEffect(() => {
    Get(`plan/loan/${id}`).then((resoinse) => {
      setAppForm(resoinse.data.data.applicationForm);
      setLoanPlans(resoinse.data.data.loanPlan);
    });
  }, []);

  useEffect(() => {
    if (apply) {
      Post("loan/register", loanData)
        .then((res) => {
          navigate("/");
          AddAlert(MessageResponse(res), "success");
        })
        .catch((error) =>{
           AddAlert(ErrorResponse(error), "error")
          setApplyLoan(false);
          });
    }
  }, [apply]);
  return (
    <Stack sx={{ height: "100vh" }}>
      {!accept ? (
        <LoanPlan loanPlans={loanPlans} onAccept={setAccept} />
      ) : !takeloan ? (
        <TakeLoan
          loanPlans={loanPlans}
          onAccept={setTakeLoan}
          loanData={setLoanData}
        />
      ) : (
        <ApplyLoan
          appForm={appForm}
          onAccept={setApplyLoan}
          loanData={setLoanData}
          loanPlans={loanPlans}
        />
      )}
    </Stack>
  );
}

export default TakeLoans;
