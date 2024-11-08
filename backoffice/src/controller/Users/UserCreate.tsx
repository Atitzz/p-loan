import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "@/css/slide_button.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HttpContext, MainContext } from "@/context/Context";
import {
  ArrowBackIos,
  CameraAlt,
} from "@mui/icons-material";
import Capture from "@/component/Capture";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
const defaultData = {
  titlename: "",
  firstname: "",
  lastname: "",
  citizen_id: "",
  back_id: "",
  birthdate: dayjs(),
  job: "",
  salary: "",
  book: "",
  bank: "",
  phone: "",
  mobile: "",
  address: "",
  houseno: "",
  villageno: "",
  lane: "",
  road: "",
  subdistrict: "",
  district: "",
  province: "",
  zipcode: "",
  country: "ไทย",
  job_company_name: "",
  job_houseno: "",
  job_villageno: "",
  job_lane: "",
  job_road: "",
  job_subdistrict: "",
  job_district: "",
  job_province: "",
  job_zipcode: "",
  job_country: "ไทย",
  imgFront: null,
  imgBack: null,
  imgBook: null,
  email: ""
};

const digitOnly = /^[0-9]*$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const digitOnly13 = /^[0-9]{0,13}$/;

function UserCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const [data, setData] = useState(defaultData);
  const [erros, setErrors] = useState([]);
  const [cap, setCap] = useState(false);
  const [method, setMethod] = useState("create");
  
  useEffect(() => {
    if (id) {
      setMethod("edit");
      Get(`customer/users/kyc/details/${id}`).then((response) => {
        setData(response.data.data);
      });
    } else {
      setMethod("create");
    }
  }, [id]);
  const [myProvince, setmyProvince] = useState<any>({
    province: -1,
    district: -1,
    subdistrict: -1,
  });
  const [jobProvince, setJobProvince] = useState<any>({
    province: -1,
    district: -1,
    subdistrict: -1,
  });
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [subdistrict, setSubdistrict] = useState([]);

  const onChangeMyProvince = (e) => {
    setmyProvince({ ...myProvince, [e.target.name]: e.target.value });
  };
  const onChangeJobProvince = (e) => {
    setJobProvince({ ...jobProvince, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    Get("province").then((res) => {
      setProvince(res.data.data);
    });
    Get(`district`).then((res) => {
      setDistrict(res.data.data);
    });
    Get(`subdistrict`).then((res) => {
      setSubdistrict(res.data.data);
    });
  }, []);

  useEffect(() => {
    if(province.length > 0 &&district.length > 0 &&subdistrict.length > 0)
      {
    setmyProvince({
      province: province.find((x) => x.name_th == data.province)?.id || -1,
      district: district.find((x) => x.name_th == data.district)?.id || -1,
      subdistrict:
        subdistrict.find((x) => x.name_th == data.subdistrict)?.id || -1,
    });
    setJobProvince({
      province: province.find((x) => x.name_th == data.job_province)?.id || -1,
      district: district.find((x) => x.name_th == data.job_district)?.id || -1,
      subdistrict:
        subdistrict.find((x) => x.name_th == data.job_subdistrict)?.id || -1,
    });
  }
  }, [id,province,district,subdistrict]);

  const onChange = (e) => {
    const { name, value } = e.target;

    const setFieldError = (field, message) => {
      setErrors((prevErrors) => {
        if (!prevErrors.some((err) => err.field === field)) {
          return [...prevErrors, { field, message }];
        }
        return prevErrors;
      });
    };
  
    const removeFieldError = (field) => {
      setErrors((prevErrors) => prevErrors.filter((err) => err.field !== field));
    };
    // if (name == "citizen_id") {
    //   if (digitOnly.test(value))
    //     setData((prev) => {
    //       return {
    //         ...prev,
    //         [name]: value,
    //       };
    //     });
    // } else if (name == "mobile") {
    //   if (digitOnly.test(value))
    //     setData((prev) => {
    //       return {
    //         ...prev,
    //         [name]: value,
    //       };
    //     });
    // } else if (name == "book") {
    //   if (digitOnly.test(value))
    //     setData((prev) => {
    //       return {
    //         ...prev,
    //         [name]: value,
    //       };
    //     });
    // } else if (name == "salary") {
    //   if (digitOnly.test(value))
    //     setData((prev) => {
    //       return {
    //         ...prev,
    //         [name]: value,
    //       };
    //     });
    // } else if (name === "email") {
    //   if (value === "" || emailPattern.test(value)) {
    //     setErrors((prevErrors) => prevErrors.filter((err) => err.field !== name));
    //   } else {
    //     setErrors((prevErrors) => [...prevErrors, { field: name, message: "" }]);
    //   }
    //   setData((prev) => ({ ...prev, [name]: value }));
    // } else
    //   setData((prev) => {
    //     return {
    //       ...prev,
    //       [name]: value,
    //     };
    //   });

    const formatBackId = (value) => {
      let formatted = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      
      if (formatted.length > 3) {
        formatted = formatted.slice(0, 3) + '-' + formatted.slice(3);
      }
      if (formatted.length > 11) {
        formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
      }
      return formatted.slice(0, 14);
    };

    if (name === "citizen_id") {
      if (digitOnly13.test(value)) {
        setData((prev) => ({
          ...prev,
          [name]: value,
        }));
  
        if (value.length === 13 && digitOnly13.test(value)) {
          removeFieldError(name);
        } else if (value.length === 13) {
          setFieldError(name, "");
        } else {
          setFieldError(name, "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง");
        }
      }
    } 
    else if (name === "back_id") {
      const formattedValue = formatBackId(value);
      setData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      
      if (/^[A-Z]{2}\d{1}-\d{7}-\d{2}$/.test(formattedValue)) {
        removeFieldError(name);
      } else {
        setFieldError(name, "กรุณากรอกเลขหลังบัตรประชาชนให้ถูกต้อง (เช่น MJ0-0000000-00)");
      }
    } 
    else if (["imgBack", "imgFront", "imgBook"].includes(name)) {
      if (value) {
        setData((prev) => ({
          ...prev,
          [name]: value,
        }));
        removeFieldError(name);
      } else {
        setFieldError(name, `กรุณาอัปโหลด ${name}`);
      }
    } else if (["mobile", "book", "salary"].includes(name)) {
      if (value === '') {
        setData((prev) => ({
          ...prev,
          [name]: value,
        }));
        setFieldError(name, "");
      } else if (digitOnly.test(value)) {
        setData((prev) => ({
          ...prev,
          [name]: value,
        }));
        removeFieldError(name);
      } else {
        setFieldError(name, "");
      }
    } else if (name === "email") {
      if (value === "" || emailPattern.test(value)) {
        removeFieldError(name);
      } else {
        setFieldError(name, "");
      }
      setData((prev) => ({ ...prev, [name]: value }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (value) {
        removeFieldError(name);
      } else {
        setFieldError(name, `กรุณากรอกข้อมูล ${name}`);
      }
    }
  };

  const onSubmit = () => {
    const send = data;
    send.province =
      province.find((x) => x.id == myProvince.province)?.name_th || "";
    send.district =
      district.find((x) => x.id == myProvince.district)?.name_th || "";
    send.subdistrict =
      subdistrict.find((x) => x.id == myProvince.subdistrict)?.name_th || "";
    send.zipcode =
      subdistrict.find((x) => x.id == myProvince.subdistrict)?.zip_code || "";

    send.job_province =
      province.find((x) => x.id == jobProvince.province)?.name_th || "";
    send.job_district =
      district.find((x) => x.id == jobProvince.district)?.name_th || "";
    send.job_subdistrict =
      subdistrict.find((x) => x.id == jobProvince.subdistrict)?.name_th || "";
    send.job_zipcode =
      subdistrict.find((x) => x.id == jobProvince.subdistrict)?.zip_code || "";

  let validationErrors = [];
  if (!data.imgBack) {
    validationErrors.push({ field: 'imgBack', message: 'กรุณาถ่ายภาพใบหน้า' });
  }
  if (!data.imgFront) {
    validationErrors.push({ field: 'imgFront', message: 'กรุณาถ่ายภาพบัตรประจำตัว' });
  }
  if (!data.imgBook) {
    validationErrors.push({ field: 'imgBook', message: 'กรุณาถ่ายภาพสมุดบัญชี' });
  }
  if (!data.titlename) {
    validationErrors.push({ field: 'titlename', message: 'กรุณาระบุคำนำหน้า' });
  }
  if (!data.firstname) {
    validationErrors.push({ field: 'firstname', message: 'กรุณาระบุชื่อ' });
  }
  if (!data.lastname) {
    validationErrors.push({ field: 'lastname', message: 'กรุณาระบุนามสกุล' });
  }
  if (!data.citizen_id) {
    validationErrors.push({ field: 'citizen_id', message: 'กรุณาระบุเลขบัตรประชาชน' });
  }
  if (!data.back_id) {
    validationErrors.push({ field: 'back_id', message: 'กรุณาระบุเลขหลังบัตรประชาชน' });
  }
  if (!data.mobile) {
    validationErrors.push({ field: 'mobile', message: 'กรุณาระบุเบอร์มือถือ' });
  }
  if (!data.job) {
    validationErrors.push({ field: 'job', message: 'กรุณาระบุอาชีพ' });
  }
  if (!data.salary) {
    validationErrors.push({ field: 'salary', message: 'กรุณาระบุเงินเดือน' });
  }
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return; 
  }
  
      if (method === "create") {
    Post(`customer/users`, send)
      .then((response) => {
        // setData(response.data.data);
        AddAlert(MessageResponse(response), "info");
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        if (error?.response?.data) setErrors(error.response.data.data);
      });
    }else{
      Put(`customer/users/kyc/details/${id}`, send)
        .then((response) => {
          AddAlert(MessageResponse(response), "info");
          navigate(-1);
        })
        .catch((error) => {
          AddAlert(ErrorResponse(error), "error");
          if (error?.response?.data) setErrors(error.response.data.data);
        });
    }
  };

  const inputRender = (
    label: string,
    field: string,
    type: string | undefined = "text",
    options = [],
    is_required = "optional"
  ) => {
    const __error = erros.find((x) => x.field == field) || false;
    return (
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1">
          {label}
          {is_required == "required" && <span style={{ color: "red" }}>*</span>}
        </Typography>
        {type === "date" ? (
          <DatePicker
            format="DD/MM/YYYY"
            slotProps={{ textField: { size: "small", fullWidth: true } }}
            value={dayjs(new Date(data[field]))}
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
        ) : type === "capture" ? (
          <Box sx={{ flex: 1, cursor: "pointer" }}>
            {data[field] == null ? (
              <Button
                variant="outlined"
                fullWidth
                sx={{ height: 200 }}
                onClick={() => handleOnCapture(field)}
              >
                <CameraAlt />
              </Button>
            ) : (
              <Button fullWidth onClick={() => handleOnCapture(field)}>
                <img src={data[field]} width="100%" />
              </Button>
            )}
            {erros[field] && (
              <FormHelperText sx={{ color: "#eb2222" }}>
                *กรุณาถ่ายภาพ
              </FormHelperText>
            )}
          </Box>
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
    const removeFieldError = (field) => {
      setErrors((prevErrors) => prevErrors.filter((err) => err.field !== field));
    };
    
    setData((prev) => {
      return {
        ...prev,
        [capName]: value,
      };
    });
    removeFieldError(capName);
    setCap(false);
  };

  const [waitData, setWaitData] = useState(false);
  const handleOnHookSmartCard = () => {
    const ws = new WebSocket("ws://127.0.0.1:8998/socket");
    setWaitData(true);
    ws.onmessage = (event) => {
      setWaitData(false);
      const data = JSON.parse(event.data);
      const thaiInfo = data["ThaiPersonalInfo"];
      const addresInfo = data["AddressInfo"];
      console.log(data);
      setData((prev) => {
        return {
          ...prev,
          titlename: thaiInfo["Prefix"],
          firstname: thaiInfo["FirstName"],
          lastname: thaiInfo["LastName"],
          citizen_id: data["CitizenID"],
          birthdate: dayjs(new Date(data["DateOfBirth"])),
          address: `${addresInfo["HouseNo"]} ${addresInfo["VillageNo"]} ${addresInfo["Lane"]} ${addresInfo["Road"]} ${addresInfo["SubDistrict"]} ${addresInfo["District"]} ${addresInfo["Province"]}`,
          houseno: addresInfo["HouseNo"],
          villageno: addresInfo["VillageNo"],
          lane: addresInfo["Lane"],
          road: addresInfo["Road"],
          subdistrict: addresInfo["SubDistrict"],
          district: addresInfo["District"],
          province: addresInfo["Province"],
          nhouseno: addresInfo["HouseNo"],
          nvillageno: addresInfo["VillageNo"],
          nlane: addresInfo["Lane"],
          nroad: addresInfo["Road"],
          nsubdistrict: addresInfo["SubDistrict"],
          ndistrict: addresInfo["District"],
          nprovince: addresInfo["Province"],
          sex: data["Sex"],
        };
      });

      setmyProvince({
        province: province.find((x) => addresInfo["Province"].includes(x.name_th))?.id || -1,
        district: district.find((x) => addresInfo["District"].includes(x.name_th))?.id || -1,
        subdistrict:
          subdistrict.find((x) => addresInfo["SubDistrict"].includes(x.name_th))?.id || -1,
      });
      ws.close();
    };
  };
  return (
    <Stack gap={4}>
         <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          startIcon={<ArrowBackIos />}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </Button>
    
      </Stack>
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
            <Button
              variant="contained"
              disabled={waitData}
              sx={{ width: 150 }}
              onClick={handleOnHookSmartCard}
            >
              {useLang("อ่านบัตรประชาชน", "Read Identification Card")}
              {waitData && (
                <CircularProgress size={20} sx={{ position: "fixed" }} />
              )}
            </Button>
          </Stack>
          <Divider />
          <Stack gap={2}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-around" }}
              gap={2}
            >
              {inputRender(
                useLang("ใบหน้า", "Face"),
                "imgBack",
                "capture",
                [],
                "required"
              )}
              {inputRender(
                useLang("บัตรประจำตัว", "Citizen Card"),
                "imgFront",
                "capture",
                [],
                "required"
              )}
              {inputRender(
                useLang("สมุดบัญชี", "Book Bank"),
                "imgBook",
                "capture",
                [],
                "required"
              )}
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(
              useLang("คำนำหน้า", "Title Name"),
              "titlename",
              "select",
              ["นาย", "นาง", "นางสาว"],
              "required"
            )}
            {inputRender(
              useLang("ชื่อ", "Fist Name"),
              "firstname",
              "text",
              [],
              "required"
            )}
            {inputRender(
              useLang("นามสกุล", "Last Name"),
              "lastname",
              "text",
              [],
              "required"
            )}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(useLang("เลขบัตรประชาชน", "Citizenid"), "citizen_id")}
            {inputRender(useLang("เลขหลังบัตรประชาชน", "Backid"), "back_id", "text", [], "required")}
            {inputRender(useLang("วันเกิด", "Birth Date"), "birthdate", "date")}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(
              useLang("เบอร์มือถือ", "Mobile"),
              "mobile",
              "text",
              [],
              "required"
            )}
            {inputRender(
              useLang("อีเมล", "email"),
              "email",
              "text",
            )}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(useLang("อาชีพ", "Job"), "job", "select", [
              "วิทยาศาสตร์และเทคโนโลยี",
              "วิศวกรรมและการก่อสร้าง",
              "สุขภาพและการแพทย์",
              "การศึกษาและวิชาการ",
              "ธุรกิจ การเงิน และการบริหาร",
              "ศิลปะ การออกแบบ และสถาปัตยกรรม",
              "การบันเทิงและสื่อสารมวลชน",
              "บริการลูกค้าและการค้าปลีก",
              "กฎหมายและการปกครอง",
              "การเกษตรและอุตสาหกรรมการผลิต",
              "เทคโนโลยีสารสนเทศและการสื่อสาร",
              "ขนส่งและโลจิสติกส์",
              "การท่องเที่ยวและการโรงแรม",
              "อื่นๆ",
            ])}
            {inputRender(useLang("เงินเดือน", "Salary"), "salary")}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(useLang("เลขที่บัญชี", "Bank Account"), "book")}
            {inputRender(useLang("ธนาคาร", "Bank Name"), "bank", "select", [
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
            {inputRender(useLang("ที่อยู่", "Address"), "address")}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(useLang("เลขที่", "House No"), "houseno")}
            {inputRender(useLang("หมู่ที่", "Village No"), "villageno")}
            {inputRender(useLang("ซอย", "Lane"), "lane")}
            {inputRender(useLang("ถนน", "Road"), "road")}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("จังหวัด", "Province")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={myProvince.province}
                name="province"
                onChange={onChangeMyProvince}
              >
                 <MenuItem value={-1}>
                    กรุณาระบุ
                  </MenuItem>
                {province.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.name_th}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("เขต/อำเภอ", "Disctrict")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={myProvince.district}
                name="district"
                onChange={onChangeMyProvince}
              >
                 <MenuItem value={-1}>
                    กรุณาระบุ
                  </MenuItem>
                {district
                  .filter((x) => x.province_id == myProvince.province)
                  .map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name_th}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("แขวง/ตำบล", "Sub District")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={myProvince.subdistrict}
                name="subdistrict"
                onChange={onChangeMyProvince}
              >
                 <MenuItem value={-1}>
                    กรุณาระบุ
                  </MenuItem>
                {subdistrict
                  .filter((x) => x.amphure_id == myProvince.district)
                  .map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name_th}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("รหัสไปรษณีย์", "Zipcode")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={
                  subdistrict.find((x) => x.id === myProvince.subdistrict)
                    ?.zip_code || ""
                }
              />
            </Box>
            {inputRender(useLang("ประเทศ", "Country"), "country", "select", [
              "ไทย",
              "ต่างชาติ",
            ])}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(useLang("บริษัท", "company"), "job_company_name")}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(useLang("เลขที่", "House No"), "job_houseno")}
            {inputRender(useLang("หมู่ที่", "Village No"), "job_villageno")}
            {inputRender(useLang("ซอย", "Lane"), "job_lane")}
            {inputRender(useLang("ถนน", "Road"), "job_road")}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("จังหวัด", "Province")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={jobProvince.province}
                name="province"
                onChange={onChangeJobProvince}
              >
                 <MenuItem value={-1}>
                    กรุณาระบุ
                  </MenuItem>
                {province.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.name_th}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("เขต/อำเภอ", "Disctrict")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={jobProvince.district}
                name="district"
                onChange={onChangeJobProvince}
              >
                 <MenuItem value={-1}>
                    กรุณาระบุ
                  </MenuItem>
                {district
                  .filter((x) => x.province_id == jobProvince.province)
                  .map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name_th}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("แขวง/ตำบล", "Sub District")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={jobProvince.subdistrict}
                name="subdistrict"
                onChange={onChangeJobProvince}
              >
                 <MenuItem value={-1}>
                    กรุณาระบุ
                  </MenuItem>
                {subdistrict
                  .filter((x) => x.amphure_id == jobProvince.district)
                  .map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name_th}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("รหัสไปรษณีย์", "Zipcode")}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={
                  subdistrict.find((x) => x.id === jobProvince.subdistrict)
                    ?.zip_code || ""
                }
              />
            </Box>
            {inputRender(
              useLang("ประเทศ", "Country"),
              "job_country",
              "select",
              ["ไทย", "ต่างชาติ"]
            )}
          </Stack>
          <Button variant="contained" onClick={onSubmit}>
            ยืนยัน
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
export default UserCreate;
