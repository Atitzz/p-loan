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
import img1 from "../../assets/img/img.png";
import KYC_Description from "./component/KYC_Description";
import ApplyKYC from "./component/ApplyKYC";
import LoadScreen from "@/component/LoadScreen";
function KYC() {
  // const navigate = useNavigate();
  // const { AddAlert } = useContext(MainContext);
  // const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
  //   useContext(HttpContext);
  // const [data, setData] = useState<any>({});
  const [load,setLoad] = useState(false);
  const [accept, setAccept] = useState(false);
  // const [apply, setApply] = useState(false);
  useEffect(() => {
    // Get(`plan/loan/${id}`).then((resoinse) => {
    //   setAppForm(resoinse.data.data.applicationForm);
    //   setLoanPlans(resoinse.data.data.loanPlan);
    // });
    setTimeout(() => {
      setLoad(true);
    }, 750);
  }, []);

  // useEffect(() => {
  //   if (apply) {
  //     Post("profile/kyc", data)
  //       .then((res) => {
  //         navigate("/");
  //         AddAlert(MessageResponse(res), "success");
  //       })
  //       .catch((err) =>{
  //          const data_type = err.response.data.system_response.data_type;
  //       if (data_type === "array") {
  //         const __errors = err.response.data.data;
  //         __errors.map((__obj) =>
  //           setErrors((prev) => {
  //             return {
  //               ...prev,
  //               [__obj.field]: false,
  //             };
  //           })
  //         );
  //       }
  //         });
  //   }
  // }, [apply]);
  return (
    <>
    {!load ? (
      <LoadScreen/>
    ) : (
    <Stack sx={{ height: "100vh" }}>
        {!accept ?
         <KYC_Description onAccept={setAccept} />
         :
         <ApplyKYC />
        }
    </Stack>)}
    </>
  );
}
export default KYC
