import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormHelperText,
  InputLabel,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import BoxTransaction from "@/component/BoxTransaction";
import "@/css/slide_button.css";
import { useContext, useEffect, useState } from "react";
import Switch from "@/component/Switch";
import BoxLoans from "@/component/BoxLoans";
import { useNavigate, useParams } from "react-router-dom";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
const defaultData = {
  id: -1,
  created_at: "2024-07-09T03:58:41.414Z",
  updated_at: "2024-07-10T10:08:15.295Z",
  deleted_at: null,
  firstname: "",
  lastname: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  email: "",
  username: "",
  permissionsId: -1,
  citizen_id: "",
  kyc: "unverfied",
  tf: "false",
  mobile: null,
  line_id: null,
  display_name: null,
  picture_url: null,
  ban_reason: null,
  status: "active",
  ev: "unverfied",
  sv: "unverfied",
  pa: "false",
  pin: "",
  la: "false",
  loan_pending: 0,
  loan_running: 0,
  loan_due: 0,
  loan_pain: 0,
  loan_reject: 0,
  balance: 0,
  deposits: 0,
  withdrawals: 0,
  transactions: 0,
};

const defaultKYC = {
  id: -1,
  created_at: "2024-07-31T12:01:59.631Z",
  updated_at: "2024-07-31T12:01:59.631Z",
  deleted_at: null,
  user_id: -1,
  titlename: "",
  firstname: "",
  lastname: "",
  birthdate: "2535-06-18",
  citizen_id: "",
  back_id: "MJ3-1111111-11",
  job: "-",
  salary: "0.00000000",
  imgFront: "",
  imgBack: "",
  imgBook: "",
  book: "",
  bank: "",
  status: "unverfied",
  reject_reason: null,
  address: "",
  houseno: "",
  villageno: "",
  lane: "",
  road: "",
  subdistrict: "",
  district: "",
  province: "",
  country: "",
  job_company_name: "",
  job_houseno: "",
  job_villageno: "",
  job_lane: "",
  job_road: "",
  job_subdistrict: "",
  job_district: "",
  job_province: "",
  job_country: "",
  email: ""
};
function UserKYC() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang ,dataRoute} = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toDate, toTHB } = useContext(ToolsContext);
  // const [data, setData] = useState(defaultData);
  const [kyc, setKYC] = useState(defaultKYC);
  const [erros, setErrors] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    Get(`customer/users/kyc/details/${id}`)
      .then((response) => {
        setKYC(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc); 
    setOpenImage(true);
  };

  const onApprove = () => {
    Post(`customer/users/kyc/approve/${kyc.user_id}`, {})
      .then((response) => {
        // setData({ ...data, kyc: "approve" });
        navigate(-1);
        setKYC({ ...kyc, status: "approve" });
        AddAlert(MessageResponse(response), "info");
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        // if (error?.response?.data) setErrors(error.response.data.data);
      });
  };
  const [reject_reason, setRejectReason] = useState("");
  const [dialog, setDialog] = useState(false);
  const handleDialogOpen = () => {
    setDialog(true);
  };
  const onReject = () => {
    Post(`customer/users/kyc/reject/${kyc.user_id}`, {reject_reason})
      .then((response) => {
        // setData({ ...data, kyc: "reject" });
        setDialog(false);
        navigate(-1);
        setKYC({ ...kyc, status: "reject" });
        AddAlert(MessageResponse(response), "info");
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        // if (error?.response?.data) setErrors(error.response.data.data);
      });
  };

  const editKYC = () => {
    const __route = dataRoute.find((x) => x.component == "users_create");
    navigate(`${__route.link}/${id}`);
  };
  return (
    <Stack gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
      <Dialog
        open={dialog}
        fullWidth
        maxWidth="sm"
        onClose={() => setDialog(false)}
      >
        <DialogContent>
          <Stack gap={2}>
            <Typography variant="h5">
              <strong>สาเหตุการปฏิเศษ</strong>
            </Typography>
            <Divider />
            <TextField
              fullWidth
              multiline
              rows={4}
              label={useLang("สาเหตุการปฏิเศษ", "Reject Reason")}
              value={reject_reason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Stack>
          <Stack sx={{ my: 4, gap: 2 }}>
            <Button onClick={onReject} variant="contained" color="error">
              ปฏิเศษ
            </Button>
            <Button
              onClick={() => setDialog(false)}
              variant="contained"
              color="primary"
            >
              ยกเลิก
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          startIcon={<Icons.ArrowBackIos />}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </Button>
        <Button
          startIcon={<Icons.Edit />}
          variant="contained"
          onClick={editKYC}
        >
          แก้ไข
        </Button>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Stack component={Paper} sx={{ flex: 3 }}>
          <Stack spacing={1} sx={{ p: 4 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ชื่อ - สกุล", "FirstName - Lastname")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {`${kyc["titlename"]} ${kyc["firstname"]} ${kyc["lastname"]}`}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("วันเกิด", "BirthDate")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {toDate(kyc["birthdate"])}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("เลขหน้าบัตรประชาชน", "Citizen ID")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["citizen_id"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("เลขหลังบัตรประชาชน", "Back ID")}
              </Box>
              <Box component="span" sx={{ color: "#ff9f63" }}>
                {kyc["back_id"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("เงินเดือน", "Salary")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {toTHB(kyc["salary"])}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("อาชีพ", "Job")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("เลขที่บัญชี", "Bank Account")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["book"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ธนาคาร", "Bank")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["bank"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ที่อยู่", "address")}
              </Box>
              <Box component="span" sx={{ color: "#28c76f" }}>
                {kyc["address"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("เลขที่", "House No")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["houseno"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("หมู่ที่", "Village No")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["villageno"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ซอย", "Lane")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["lane"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ถนน", "Road")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["road"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("แขวง/ตำบล", "Sub District")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["subdistrict"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("เขต/อำเภอ", "District")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["district"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("จังหวัด", "Province")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["province"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("รหัสไปรษณีย์", "Zipcode")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["zipcode"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ประเทศ", "Country")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["country"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("บริษัท", "Company")}
              </Box>
              <Box component="span" sx={{ color: "#28c76f" }}>
                {kyc["job_company_name"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("เลขที่", "House No")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_houseno"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("หมู่ที่", "Village No")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_villageno"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ซอย", "Lane")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_lane"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ถนน", "Road")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_road"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("แขวง", "Sub District")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_subdistrict"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("เขต", "District")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_district"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("จังหวัด", "Province")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_province"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("รหัสไปรษณี", "Zipcode")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_zipcode"]}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ประเทศ", "Country")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["job_country"]}
              </Box>
            </Stack>
            <Divider />

            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("อีเมล", "email")}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {kyc["email"]}
              </Box>
            </Stack>
            <Divider />

          </Stack>
        </Stack>
        <Stack component={Paper} sx={{ flex: 5 }}>
          <Stack spacing={1} sx={{ p: 4 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "#5b6e88" }}
              >
                {useLang("ข้อมูลการยืนยันตัวตน", "KYC Information")}
              </Box>
            </Stack>
            <Divider />

            {/* -------------------------- ปิงเพิ่ม -------------------------- */}
            <Dialog
                open={openImage}
                onClose={() => setOpenImage(false)}
                fullWidth
                maxWidth="sm"
            >
                <Stack sx={{ position: "relative" }}>
                    <Box sx={{ position: "absolute", right: 0 }}>
                        <IconButton onClick={() => setOpenImage(false)}>
                            <Icons.Cancel />
                        </IconButton>
                    </Box>

                    <DialogContent>
                        <img
                            src={selectedImage}
                            alt="Selected"
                            style={{
                                width: '100%',
                                height: '500px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                            }}
                        />
                    </DialogContent>
                </Stack>
            </Dialog>
            {/* -------------------------- end -------------------------- */}

            <Stack gap={2}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-around" }}
                gap={2}
              >
                <Box sx={{ flex: 1, cursor: "pointer" }} onClick={() => handleImageClick(kyc.imgBack)}>
                  <InputLabel>{useLang("ใบหน้า*", "Face*")}</InputLabel>
                  <img src={kyc.imgBack} width="100%" />
                  {kyc.imgBack == null && (
                    <FormHelperText sx={{ color: "#eb2222" }}>
                      {useLang("ไม่พบภาพประกอบ", "No Picture")}
                    </FormHelperText>
                  )}
                </Box>
                <Box sx={{ flex: 1, cursor: "pointer" }} onClick={() => handleImageClick(kyc.imgFront)}>
                  <InputLabel>
                    {useLang("บัตรประจำตัว*", "Citizen Card*")}
                  </InputLabel>
                  <img src={kyc.imgFront} width="100%" />
                  {kyc.imgFront == null && (
                    <FormHelperText sx={{ color: "#eb2222" }}>
                      {useLang("ไม่พบภาพประกอบ", "No Picture")}
                    </FormHelperText>
                  )}
                </Box>
                <Box sx={{ flex: 1, cursor: "pointer" }} onClick={() => handleImageClick(kyc.imgBook)}>
                  <InputLabel>{useLang("สมุดบัญชี*", "Book Bank*")}</InputLabel>
                  <img src={kyc.imgBook} width="100%" />
                  {kyc.imgBook == null && (
                    <FormHelperText sx={{ color: "#eb2222" }}>
                      {useLang("ไม่พบภาพประกอบ", "No Picture")}
                    </FormHelperText>
                  )}
                </Box>
              </Stack>
            </Stack>
            <Divider />
            <Box sx={{ flex: 1 }}>
              <InputLabel>สาเหตุการปฏิเศษ</InputLabel>
              <TextField
                aria-readonly
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={4}
                size="small"
                value={kyc.reject_reason}
              />
            </Box>
            {String(kyc["status"]).toLowerCase() !== "approve" && (
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="success" onClick={onApprove}>
                  {useLang("อนุมัติ", "Approve")}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDialogOpen}
                >
                  {useLang("ปฏิเศษ", "Reject")}
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
export default UserKYC;
