import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Stack,
    TextField,
  } from "@mui/material";
  import "@/css/slide_button.css";
  import { useContext, useEffect, useRef, useState } from "react";
  import Switch from "@/component/Switch";
  import BoxLoans from "@/component/BoxLoans";
  import { useNavigate, useParams } from "react-router-dom";
  import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
  import {
    Camera,
    CameraAlt,
    Close,
    Replay,
    Reply,
    Save,
  } from "@mui/icons-material";
  import Capture from "@/component/Capture";
  import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
  
  const defaultData = {
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "ไทย",
    email: "",
    username: "",
    citizen_id: "",
    mobile: null,
    imgFront: null,
    imgBack: null,
    imgBook: null,
    accept_privacy: "accept",
  };
  
  function System_Users() {
    const navigate = useNavigate();
    const { AddAlert, useLang, dataRoute } = useContext(MainContext);
    const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
      useContext(HttpContext);
    const { toDate, toTHB } = useContext(ToolsContext);
    const [data, setData] = useState(defaultData);
    const [erros, setErrors] = useState([]);
    const [cap, setCap] = useState(false);
  
    const onChange = (e) => {
      const { name, value } = e.target;
      setData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    };
  
    const onSubmit = () => {
      Post(`customer/users`, data)
        .then((response) => {
          setData(response.data.data);
          AddAlert(MessageResponse(response), "info");
          navigate(-1);
        })
        .catch((error) => {
          AddAlert(ErrorResponse(error), "error");
          if (error?.response?.data) setErrors(error.response.data.data);
        });
    };
  
    // const viewKYC = () => {
    //   const __route = dataRoute.find((x) => x.component == "users_kyc");
    //   navigate(`${__route.link}/${id}`);
    // };
  
    const inputRender = (label:string, field:string, type:string|undefined = "text", options = []) => {
      const __error = erros.find((x) => x.field == field) || false;
      return (
        <Box sx={{ flex: 1 }}>
          <InputLabel>{label}</InputLabel>
          {type === "date" ? (
            <DatePicker
              format="DD/MM/YYYY"
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              value={data[field]}
              onChange={(newValue) =>
                onChange({ target: { name: field, value: newValue } })
              }
            />
          ) : type === "select" ? (
            <TextField
              select
              error={__error}
              fullWidth
              size="small"
              value={data[field]}
              name={field}
              onChange={onChange}
            >
              {options.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              error={__error}
              fullWidth
              size="small"
              value={data[field]}
              name={field}
              onChange={onChange}
            />
          )}
          {__error && (
            <FormHelperText sx={{ color: "#eb2222" }}>
              {__error.message}
            </FormHelperText>
          )}
        </Box>
      );
    };
    const [capName, setCapName] = useState("image");
    const handleOnCapture = (name) => {
      setCap(true);
      setCapName(name);
    };
  
    const handleOnSave = (value) => {
      setData((prev) => {
        return {
          ...prev,
          [capName]: value,
        };
      });
      setCap(false);
    };

    
  const [waitData,setWaitData] = useState(false);
  const handleOnHookSmartCard = () => {
    const ws = new WebSocket("ws://127.0.0.1:8998/socket");
    setWaitData(true)
    ws.onmessage = (event) => {
      setWaitData(false)
      const data = JSON.parse(event.data);
      const thaiInfo = data["ThaiPersonalInfo"];
      const addresInfo = data["AddressInfo"];
      console.log(data)
      setData((prev) => {
        return {
          ...prev,
          titlename: thaiInfo["Prefix"],
          firstname: thaiInfo["FirstName"],
          lastname: thaiInfo["LastName"],
          citizen_id: data["CitizenID"],
          birthdate: dayjs(new Date(data["DateOfBirth"])),
          address:`${addresInfo["HouseNo"]} ${addresInfo["VillageNo"]} ${addresInfo["Lane"]} ${addresInfo["Road"]} ${addresInfo["SubDistrict"]} ${addresInfo["District"]} ${addresInfo["Province"]}`,
          houseno: addresInfo["HouseNo"],
          villageNo: addresInfo["VillageNo"],
          lane: addresInfo["Lane"],
          road: addresInfo["Road"],
          subdistrict: addresInfo["SubDistrict"],
          district: addresInfo["District"],
          province: addresInfo["Province"],
          nhouseno: addresInfo["HouseNo"],
          nvillageNo: addresInfo["VillageNo"],
          nlane: addresInfo["Lane"],
          nroad: addresInfo["Road"],
          nsubdistrict: addresInfo["SubDistrict"],
          ndistrict: addresInfo["District"],
          nprovince: addresInfo["Province"],
          sex: data["Sex"],
        };
      });
      ws.close();
    };
  };
    return (
      <Stack gap={4}>
        <Capture
          open={cap}
          onClose={() => setCap(false)}
          onSave={handleOnSave}
          person={capName == "imgBack"}
        />
        {/* Infomation */}
        <Stack component={Paper}>
          <Stack gap={4} sx={{ p: 4 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {useLang("สร้างผู้ใช้งาน", "Create User")}
              </Box>
              <Button variant="contained" disabled={waitData} sx={{width:150}} onClick={handleOnHookSmartCard}>
               {useLang("อ่านบัตรประชาชน", "Read Identification Card")}
               {waitData && <CircularProgress size={20} sx={{position:'fixed'}}/> }
            </Button>
            </Stack>
            <Divider />
            <Stack gap={2}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-around" }}
                gap={2}
              >
                <Box sx={{ flex: 1, cursor: "pointer" }}>
                  <InputLabel>{useLang("ใบหน้า*", "Face*")}</InputLabel>
  
                  {data.imgBack == null ? (
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ height: 200 }}
                      onClick={() => handleOnCapture("imgBack")}
                    >
                      <CameraAlt />
                    </Button>
                  ) : (
                    <Button fullWidth onClick={() => handleOnCapture("imgBack")}>
                      <img src={data.imgBack} width="100%" />
                    </Button>
                  )}
                </Box>
                <Box sx={{ flex: 1, cursor: "pointer" }}>
                  <InputLabel>
                    {useLang("บัตรประจำตัว*", "Citizen Card*")}
                  </InputLabel>
                  {data.imgFront == null ? (
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ height: 200 }}
                      onClick={() => handleOnCapture("imgFront")}
                    >
                      <CameraAlt />
                    </Button>
                  ) : (
                    <Button fullWidth onClick={() => handleOnCapture("imgFront")}>
                      <img src={data.imgFront} width="100%" />
                    </Button>
                  )}
                </Box>
                <Box sx={{ flex: 1, cursor: "pointer" }}>
                  <InputLabel>{useLang("สมุดบัญชี*", "Book Bank*")}</InputLabel>
  
                  {data.imgBook == null ? (
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ height: 200 }}
                      onClick={() => handleOnCapture("imgBook")}
                    >
                      <CameraAlt />
                    </Button>
                  ) : (
                    <Button fullWidth onClick={() => handleOnCapture("imgBook")}>
                      <img src={data.imgBook} width="100%" />
                    </Button>
                  )}
                </Box>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
              {inputRender(useLang("คำนำหน้า*", "Title Name*"), "titlename")}
              {inputRender(useLang("ชื่อ*", "Fist Name*"), "firstname")}
              {inputRender(useLang("นามสกุล*", "Last Name*"), "lastname")}
            </Stack>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
              {inputRender(useLang("เลขบัตรประชาชน*", "Email*"), "citizen_id")}
              {inputRender(useLang("เลขหลังบัตรประชาชน*", "Mobile*"), "back_id")}
              {inputRender(
                useLang("วันเกิด*", "Birth Date*"),
                "birthdate",
                "date"
              )}
            </Stack>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
              {inputRender(useLang("เบอร์.มือถือ*", "Mobile*"), "mobile")}
              {inputRender(useLang("อาชีพ*", "Job*"), "job")}
              {inputRender(useLang("เงินเดือน*", "Salary*"), "salary")}
            </Stack>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
              {inputRender(useLang("เลขที่บัญชี*", "Bank Account*"), "book")}
              {inputRender(useLang("ธนาคาร*", "Bank Name*"), "bank", "select", [
                "ธนาคารกรุงเทพ",
                "ธนาคารกสิกรไทย",
                "ธนาคารกรุงไทย",
                "ธนาคารทหารไทย",
                "ธนาคารไทยพาณิชย์",
                "ธนาคารกรุงศรีอยุธยา",
                "ธนาคารเกียรตินาคิน",
                "ธนาคารซีไอเอ็มบีไทย",
                "ธนาคารทิสโก้",
                "ธนาคารธนชาต",
                "ธนาคารยูโอบี",
                "ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)",
                "ธนาคารไทยเครดิตเพื่อรายย่อย",
                "ธนาคารแลนด์ แอนด์ เฮาส์",
                "ธนาคารไอซีบีซี (ไทย)",
                "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย",
                "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",
                "ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย",
                "ธนาคารออมสิน",
                "ธนาคารอาคารสงเคราะห์",
                "ธนาคารอิสลามแห่งประเทศไทย",
                "ธนาคารแห่งประเทศจีน",
                "ธนาคารซูมิโตโม มิตซุย ทรัสต์ (ไทย)",
                "ธนาคารฮ่องกงและเซี้ยงไฮ้แบงกิ้งคอร์ปอเรชั่น จำกัด",
              ])}
            </Stack>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
              {inputRender(useLang("ที่อยู่*", "Address*"), "address")}
            </Stack>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
              {inputRender(useLang("เลขที่", "House No"), "houseno")}
              {inputRender(useLang("หมู่ที่", "Village No"), "villageno")}
              {inputRender(useLang("ซอย", "Lane"), "lane")}
            </Stack>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
              {inputRender(useLang("แขวง", "Sub District"), "subdistrict")}
              {inputRender(useLang("เขต", "Disctrict"), "district")}
              {inputRender(useLang("จังหวัด", "Province"), "province")}
            </Stack>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
              {inputRender(useLang("รหัสไปรษณี", "Zipcode"), "zipcode")}
              {inputRender(useLang("ประเทศ", "Country"), "country","select",["ไทย", "ต่างชาติ"])}
            </Stack>
            
            <Divider/>

            {inputRender(useLang("ประเทศ", "Country"), "country","select",["ไทย", "ต่างชาติ"])}

            {inputRender(useLang("ประเทศ", "Country"), "country","select",["ไทย", "ต่างชาติ"])}
            <Button variant="contained" onClick={onSubmit}>
              ยืนยัน
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
  }  
export default System_Users
