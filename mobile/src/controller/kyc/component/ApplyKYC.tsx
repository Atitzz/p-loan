import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  IconButton,
  MenuItem,
  MobileStepper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { useNavigate } from "react-router-dom";
import img1 from "@/assets/img/img2.png";
import profile from "@/assets/img/profile-icon.png";
import book from "@/assets/img/p-bookbank.png";
import CameraOpenIdCard from "@/component/CameraOpenIdCard";
import { Reply } from "@mui/icons-material";
import CameraOpenFace from "@/component/CameraOpenFace";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import TakePhotoCard from "@/component/TakePhotoCard";
import TakePhotoFace from "@/component/TakePhotoFace";
import TakePhoto from "@/component/TakePhoto";
import CameraOpenBook from "@/component/CameraOpenBook";
import isValidThaiID from 'thai-id-validator';
import 'dayjs/locale/th'; // นำเข้า locale ภาษาไทย
dayjs.locale('th'); // ตั้งค่า locale ให้เป็นภาษาไทย
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
const defaultError = {
  titlename: true,
  firstname: true,
  lastname: true,
  birthdate: true,
  citizen_id: true,
  back_id: true,
  job: true,
  salary: true,
  book: true,
  bank: true,
  imgFront: true,
  imgBack: true,
  imgBook: true,
  address: true,
  houseno: true,
  villageno: true,
  lane: true,
  subdistrict: true,
  district: true,
  province: true,
  zipcode: true,
  country: true,
  road: true,
  job_company_name: true,
  job_houseno: true,
  job_villageno: true,
  job_lane: true,
  job_road: true,
  job_subdistrict: true,
  job_district: true,
  job_province: true,
  job_zipcode: true,
  job_country: true,
  email: true
};
const kycForm = [
  {
    type: "Select",
    label: "คำนำหน้า",
    is_required: "required",
    field_name: "titlename",
    width: 100,
    options: ["นาย", "นาง", "นางสาว", "อื่นๆ"],
  },
  {
    type: "text",
    label: "ชื่อ",
    is_required: "required",
    field_name: "firstname",
    width: 100,
  },
  {
    type: "text",
    label: "สกุล",
    is_required: "required",
    field_name: "lastname",
    width: 100,
  },
  {
    type: "date",
    label: "วันเกิด (ไทย)",
    is_required: "required",
    field_name: "birthdate",
    width: 100,
  },
  {
    type: "text",
    label: "เลขหน้าบัตรประชาชน",
    is_required: "required",
    field_name: "citizen_id",
    width: 100,
  },
  {
    type: "text",
    label: "เลขหลังบัตรประชาชน (Laser ID MJ0-0000000-00)",
    is_required: "required",
    field_name: "back_id",
    width: 100,
  },
  {
    type: "text",
    label: "อีเมล",
    is_required: "optional",
    field_name: "email",
    width: 100,
  },
];

const kycForm1 = [
  {
    type: "select",
    label: "อาชีพ",
    is_required: "required",
    field_name: "job",
    width: 100,
    options: [
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
    ],
  },
  {
    type: "text",
    label: "เงินเดือน | รายได้",
    is_required: "required",
    field_name: "salary",
    width: 100,
  },
  {
    type: "text",
    label: "เลขที่บัญชี",
    is_required: "required",
    field_name: "book",
    width: 100,
  },
  {
    type: "select",
    label: "ธนาคาร",
    is_required: "required",
    field_name: "bank",
    width: 100,
    options: [
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
    ],
  },
];

const kycForm2 = [
  {
    type: "text",
    label: "ที่อยู่",
    is_required: "required",
    field_name: "address",
    width: 100,
  },
  {
    type: "text",
    label: "เลขที่",
    is_required: "required",
    field_name: "houseno",
    width: 100,
  },
  {
    type: "text",
    label: "หมู่ที่",
    is_required: "optional",
    field_name: "villageno",
    width: 100,
  },
  {
    type: "text",
    label: "ตรอก/ซอย",
    is_required: "required",
    field_name: "lane",
    width: 100,
  },
  {
    type: "text",
    label: "ถนน",
    is_required: "required",
    field_name: "road",
    width: 100,
  },
];

const kycForm3 = [
  {
    type: "text",
    label: "ชื่อสถานที่ทำงาน",
    is_required: "required",
    field_name: "job_company_name",
    width: 100,
  },
  {
    type: "text",
    label: "เลขที่",
    is_required: "required",
    field_name: "job_houseno",
    width: 100,
  },
  {
    type: "text",
    label: "หมู่ที่",
    is_required: "optional",
    field_name: "job_villageno",
    width: 100,
  },
  {
    type: "text",
    label: "ตรอก/ซอย",
    is_required: "required",
    field_name: "job_lane",
    width: 100,
  },
  {
    type: "text",
    label: "ถนน",
    is_required: "required",
    field_name: "job_road",
    width: 100,
  },
];

const defeultErrorMyProvince = {
  province: true,
  district: true,
  subdistrict: true,
};

const digitOnly = /^\d+$/;
const laserID = /^\w{2}\d{1}-\d{7}-\d{2}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

const important = ['citizen_id','back_id','salary','book'] 
function ApplyKYC() {
  const { AddAlert } = useContext(MainContext);
  const { Get, Post, MessageResponse } = useContext(HttpContext);
  const { toDate, toTHB } = useContext(ToolsContext);
  const [input, setInput] = useState<any>(defaultData);
  const [errors, setErrors] = useState(defaultError);
  const [myProvince, setmyProvince] = useState<any>({
    province: -1,
    district: -1,
    subdistrict: -1,
  });
  const [errorsMyProvince, setErrorsMyProvince] = useState(
    defeultErrorMyProvince
  );
  const [jobProvince, setJobProvince] = useState<any>({
    province: -1,
    district: -1,
    subdistrict: -1,
  });
  const [errorsJobProvince, setErrorsJobProvince] = useState(
    defeultErrorMyProvince
  );
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

  const formatBackId = (value) => {
    let formatted = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    formatted = formatted.slice(0, 12);
    if (formatted.length > 3) {
      formatted = formatted.slice(0, 3) + '-' + formatted.slice(3);
    }
    if (formatted.length > 11) {
      formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
    }
    return formatted;
  };

  const onChange = (e) => {
    // if (e.target.name == "citizen_id") {
    //   if (!digitOnly.test(e.target.value))
    //     setErrors((prev) => {
    //       return { ...prev, citizen_id: false };
    //     });
    //   else if (e.target.value.length > 13)
    //     setErrors((prev) => {
    //       return { ...prev, citizen_id: false };
    //     });
    //   else if (e.target.value.length < 13)
    //     setErrors((prev) => {
    //       return { ...prev, citizen_id: false };
    //     });
    //   else if (!isValidThaiID(e.target.value))
    //     setErrors((prev) => {
    //       return { ...prev, citizen_id: false };
    //     });
    //   else
    //     setErrors((prev) => {
    //       return { ...prev, citizen_id: true };
    //     });
    // } 
    if (e.target.name === "citizen_id") {
      const value = e.target.value;
      if (digitOnly.test(value) || value === '') {
        setInput(prev => ({ ...prev, [e.target.name]: value }));
        
        if (value.length !== 13) {
          setErrors(prev => ({ ...prev, citizen_id: false }));
        } else if (!isValidThaiID(value)) {
          setErrors(prev => ({ ...prev, citizen_id: false }));
        } else {
          setErrors(prev => ({ ...prev, citizen_id: true }));
        }
      }
    } 
    else if (e.target.name === "back_id") {
      const formattedValue = formatBackId(e.target.value);
      if (!/^[A-Z]{2}\d{1}-\d{7}-\d{2}$/.test(formattedValue)) {
        setErrors((prev) => {
          return { ...prev, back_id: false };
        });
      } else {
        setErrors((prev) => {
          return { ...prev, back_id: true };
        });
      }
      setInput((prev) => ({ ...prev, back_id: formattedValue }));
      return;
    }
    else if (e.target.name == "salary") {
      if (!digitOnly.test(e.target.value))
        setErrors((prev) => {
          return { ...prev, salary: false };
        });
      else
        setErrors((prev) => {
          return { ...prev, salary: true };
        });
    } else if (e.target.name == "book") {
      if (!digitOnly.test(e.target.value))
        setErrors((prev) => {
          return { ...prev, book: false };
        });
      else
        setErrors((prev) => {
          return { ...prev, book: true };
        });
    } else if (e.target.name == "email") {
      if (!emailPattern.test(e.target.value)) {
          setErrors((prev) => {
              return { ...prev, email: false };
          });
      } else {
          setErrors((prev) => {
              return { ...prev, email: true }; 
          });
      }
  }
    
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onChangeDate = (name, value) => {
    setInput({ ...input, [name]: value });
  };

  const handleFileChange = (event) => {
    setInput({ ...input, [event.target.name]: event.target.files[0] });
  };
  const onClick = async () => {
    const send = input;
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

    Post("profile/kyc", {
      ...send,
      birthdate: new Date(input.birthdate).toISOString().split("T")[0],
    })
      .then((res) => {
        window.location.href = "/";
        AddAlert(MessageResponse(res), "success");
      })
      .catch((err) => {
        const data_type = err.response.data.system_response.data_type;
        setErrors(defaultError);
        if (data_type === "array") {
          const __errors = err.response.data.data;
          __errors.map((__obj) =>
            setErrors((prev) => {
              return {
                ...prev,
                [__obj.field]: false,
              };
            })
          );
        }
      });
  };

  const OnCapture = async (name, base64) => {
    setInput((prev) => {
      return {
        ...prev,
        [name]: base64,
      };
    });
    handleNext();
  };

  const formRender = (prop, index) => {
    switch (String(prop.type).toLowerCase()) {
      case "text":
        return (
          <Stack key={index}>
            <Typography variant="body1">
              {prop.label}
              {prop.is_required == "required" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="text"
              className="input-custom-2"
              size="small"
              name={prop.field_name}
              value={input[prop.field_name]}
              onChange={onChange}
              sx={{ width: `${prop.width}%` }}
              error={!errors[prop.field_name]}
            />
          </Stack>
        );
      case "select":
        return (
          <Stack key={index}>
            <Typography variant="body1">
              {prop.label}
              {prop.is_required == "required" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </Typography>
            <TextField
              select
              id="outlined-basic"
              variant="outlined"
              type="text"
              className="input-custom-2"
              size="small"
              name={prop.field_name}
              value={input[prop.field_name]}
              onChange={onChange}
              sx={{ width: `${prop.width}%` }}
              error={!errors[prop.field_name]}
            >
              {prop.options.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );
      case "date":
        return (
          <Stack key={index}>
            <Typography variant="body1">
              {prop.label}
              {prop.is_required == "required" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </Typography>
            <DatePicker
              className="input-custom-2"
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    width: `${prop.width}%`,
                  },
                },
              }}
              value={input[prop.field_name]}
              onChange={(newValue) => onChangeDate(prop.field_name, newValue)}
              localeText={{
                cancelButtonLabel: 'ยกเลิก',
                okButtonLabel: 'ตกลง',
                toolbarTitle: 'เลือกวันที่',
              }}
            />
          </Stack>
        );
      case "file":
        return (
          <Stack key={index}>
            <Typography variant="body1">
              {prop.label}
              {prop.is_required == "required" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </Typography>
            <Stack sx={{ position: "relative" }}>
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                value={input[prop.field_name]?.name}
                sx={{ width: `${prop.width}%` }}
                error={!errors[prop.field_name]}
              />
              <Box sx={{ position: "absolute", right: 0 }}>
                <IconButton component="label">
                  <AttachmentIcon />
                  <input
                    type="file"
                    accept="image/*"
                    name={prop.field_name}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </IconButton>
              </Box>
            </Stack>
          </Stack>
        );
      default:
        break;
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === 0) {
      const _errors = errors;
      const checklist = kycForm.map((field) => {
        if (
          field.is_required === "required" &&
          input[field.field_name] === ""
        ) {
          _errors[field.field_name] = false;
          return 0;
        }
        else if (
          !_errors[field.field_name] && important.includes(field.field_name)
        )
        {
          return 0;
        }
        _errors[field.field_name] = true;
        return 1;
      });
      if (checklist.filter((x) => x === 0).length > 0) {
        setErrors(_errors);
        return AddAlert("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      }
    } else if (activeStep === 1) {
      const _errors = errors;
      const checklist = kycForm1.map((field) => {
        if (
          field.is_required === "required" &&
          input[field.field_name] === ""
        ) {
          _errors[field.field_name] = false;
          return 0;
        }
        else if (
          !_errors[field.field_name]  && important.includes(field.field_name)
        )
        {
          return 0;
        }
        _errors[field.field_name] = true;
        return 1;
      });
      if (checklist.filter((x) => x === 0).length > 0) {
        setErrors(_errors);
        return AddAlert("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      }
    } else if (activeStep === 2) {
      const _errors = errors;
      const _errors2 = errorsMyProvince;
      const checklist = kycForm2.map((field) => {
        if (
          field.is_required === "required" &&
          input[field.field_name] === ""
        ) {
          _errors[field.field_name] = false;
          return 0;
        }
        else if (
          !_errors[field.field_name]  && important.includes(field.field_name)
        )
        {
          return 0;
        }
        _errors[field.field_name] = true;
        return 1;
      });
      if (myProvince.province == -1) _errors2.province = false;
      if (myProvince.district == -1) _errors2.district = false;
      if (myProvince.subdistrict == -1) _errors2.subdistrict = false;
      setErrorsMyProvince(_errors2);
      if (checklist.filter((x) => x === 0).length > 0) {
        setErrors(_errors);

        return AddAlert("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      }
    } else if (activeStep === 3) {
      const _errors = errors;
      const _errors2 = errorsJobProvince;
      const checklist = kycForm3.map((field) => {
        if (
          field.is_required === "required" &&
          input[field.field_name] === ""
        ) {
          _errors[field.field_name] = false;
          return 0;
        }
        else if (
          !_errors[field.field_name]  && important.includes(field.field_name)
        )
        {
          return 0;
        }
        _errors[field.field_name] = true;
        return 1;
      });
      if (jobProvince.province == -1) _errors2.province = false;
      if (jobProvince.district == -1) _errors2.district = false;
      if (jobProvince.subdistrict == -1) _errors2.subdistrict = false;
      setErrorsJobProvince(_errors2);
      if (checklist.filter((x) => x === 0).length > 0) {
        setErrors(_errors);
        return AddAlert("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Stack
      sx={{
        height: "100vh",
        width: "100vw",
        justifyContent: "space-between",
        textAlign: "start",
        overflow: "auto",
      }}
      gap={2}
    >
      <Stack gap={2}>
        <Box sx={{ px: 2, py: 2, bgcolor: "var(--color1)" }}>
          <TextField
            select
            fullWidth
            value={activeStep}
            // onChange={(e) => setActiveStep(Number(e.target.value))}
          >
            <MenuItem value={0}>ข้อมูลทั่วไป</MenuItem>
            <MenuItem value={1}>ข้อมูลการเงิน</MenuItem>
            <MenuItem value={2}>ข้อมูลที่อยู่</MenuItem>
            <MenuItem value={3}>ข้อมูลสถานที่ทำงาน</MenuItem>
            <MenuItem value={4}>ถ่ายรูปหน้าบัตรประชาชน</MenuItem>
            <MenuItem value={5}>เปิดกล้อง</MenuItem>
            <MenuItem value={6}>ตัวอย่างรูปหน้าบัตรประชาชน</MenuItem>
            <MenuItem value={7}>ถ่ายรูปใบหน้าของคุณ</MenuItem>
            <MenuItem value={8}>ตัวอย่างรูปใบหน้าของคุณ</MenuItem>
            <MenuItem value={9}>เปิดกล้อง</MenuItem>
            <MenuItem value={10}>ถ่ายรูปสมุดบัญชีของคุณ</MenuItem>
            <MenuItem value={11}>เปิดกล้อง</MenuItem>
            <MenuItem value={12}>ตัวอย่างรูปสมุดบัญชีของคุณ</MenuItem>
            <MenuItem value={13}>ยื่นเอกสารยืนตันตัวตน</MenuItem>
          </TextField>
        </Box>
        {activeStep === 0 && (
          <Stack gap={2} sx={{ p: 4 }}>
            {kycForm.map((form, index) => {
              if (form.field_name === "citizen_id") {
                return (
                  <Stack key={index}>
                    <Typography variant="body1">
                      {form.label}
                      {form.is_required === "required" && <span style={{ color: "red" }}>*</span>}
                    </Typography>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      type="text"
                      className="input-custom-2"
                      size="small"
                      name={form.field_name}
                      value={input[form.field_name]}
                      onChange={onChange}
                      sx={{ width: `${form.width}%` }}
                      error={!errors[form.field_name]}
                      inputProps={{
                        maxLength: 13,
                      }}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {!errors[form.field_name] && (
                      <FormHelperText sx={{ color: "red" }}>
                        กรุณากรอกเลขบัตรประชาชน 13 หลักให้ถูกต้อง
                      </FormHelperText>
                    )}
                  </Stack>
                );
              }
              else if (form.field_name === "back_id") {
                return (
                  <Stack key={index}>
                    <Typography variant="body1">
                      {form.label}
                      {form.is_required === "required" && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </Typography>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      type="text"
                      className="input-custom-2"
                      size="small"
                      name={form.field_name}
                      value={input[form.field_name]}
                      onChange={onChange}
                      sx={{ width: `${form.width}%` }}
                      error={!errors[form.field_name]}
                      inputProps={{
                        maxLength: 14,
                        style: { textTransform: 'uppercase' }
                      }}
                    />
                    {!errors[form.field_name] && (
                      <FormHelperText sx={{ color: "red" }}>
                        กรุณากรอกเลขหลังบัตรประชาชนให้ถูกต้อง (เช่น MJ0-0000000-00)
                      </FormHelperText>
                    )}
                  </Stack>
                );
              }
              return formRender(form, index);
            })}
          </Stack>
        )}
        {activeStep === 1 && (
          <Stack gap={2} sx={{ p: 4 }}>
            {kycForm1.map((form, index) => formRender(form, index))}
          </Stack>
        )}
        {activeStep === 2 && (
          <Stack gap={2} sx={{ p: 4 }}>
            {kycForm2.map((form, index) => formRender(form, index))}
            <Stack>
              <Typography variant="body1">
                จังหวัด
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                id="outlined-basic"
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                name="province"
                value={myProvince.province}
                onChange={onChangeMyProvince}
                sx={{ width: `${100}%` }}
                error={!errorsMyProvince.province}
              >
                {province.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.name_th}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack>
              <Typography variant="body1">
                เขต/อำเภอ
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                id="outlined-basic"
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                name="district"
                value={myProvince.district}
                onChange={onChangeMyProvince}
                sx={{ width: `${100}%` }}
                error={!errorsMyProvince.district}
              >
                {district
                  .filter((x) => x.province_id == myProvince.province)
                  .map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name_th}
                    </MenuItem>
                  ))}
              </TextField>
            </Stack>
            <Stack>
              <Typography variant="body1">
                แขวง/ตำบล
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                id="outlined-basic"
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                name="subdistrict"
                value={myProvince.subdistrict}
                onChange={onChangeMyProvince}
                sx={{ width: `${100}%` }}
                error={!errorsMyProvince.subdistrict}
              >
                {subdistrict
                  .filter((x) => x.amphure_id == myProvince.district)
                  .map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name_th}
                    </MenuItem>
                  ))}
              </TextField>
            </Stack>
            <Stack>
              <Typography variant="body1">
                รหัสไปรษณี
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                value={
                  subdistrict.find((x) => x.id === myProvince.subdistrict)
                    ?.zip_code || ""
                }
                sx={{ width: `${100}%` }}
              />
            </Stack>
          </Stack>
        )}
        {activeStep === 3 && (
          <Stack gap={2} sx={{ p: 4 }}>
            {kycForm3.map((form, index) => formRender(form, index))}
            <Stack>
              <Typography variant="body1">
                จังหวัด
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                id="outlined-basic"
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                name="province"
                value={jobProvince.province}
                onChange={onChangeJobProvince}
                sx={{ width: `${100}%` }}
                error={!errorsJobProvince.province}
              >
                {province.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.name_th}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack>
              <Typography variant="body1">
                เขต/อำเภอ
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                id="outlined-basic"
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                name="district"
                value={jobProvince.district}
                onChange={onChangeJobProvince}
                sx={{ width: `${100}%` }}
                error={!errorsJobProvince.district}
              >
                {district
                  .filter((x) => x.province_id == jobProvince.province)
                  .map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name_th}
                    </MenuItem>
                  ))}
              </TextField>
            </Stack>
            <Stack>
              <Typography variant="body1">
                แขวง/ตำบล
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                id="outlined-basic"
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                name="subdistrict"
                value={jobProvince.subdistrict}
                onChange={onChangeJobProvince}
                sx={{ width: `${100}%` }}
                error={!errorsJobProvince.subdistrict}
              >
                {subdistrict
                  .filter((x) => x.amphure_id == jobProvince.district)
                  .map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name_th}
                    </MenuItem>
                  ))}
              </TextField>
            </Stack>
            <Stack>
              <Typography variant="body1">
                รหัสไปรษณี
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                className="input-custom-2"
                size="small"
                value={
                  subdistrict.find((x) => x.id === jobProvince.subdistrict)
                    ?.zip_code || ""
                }
                sx={{ width: `${100}%` }}
              />
            </Stack>
          </Stack>
        )}
        {activeStep === 4 && (
          <Stack gap={2} sx={{ p: 4 }}>
            <Typography variant="h5">ถ่ายรูปหน้าบัตรประชาชนของคุณ</Typography>
            <Box p={3}>
              <img src={img1} alt={img1} width={"100%"} height={"100%"} />
            </Box>
          </Stack>
        )}
        {activeStep === 5 && (
          <Box
            sx={{
              position: "fixed",
              zIndex: 999,
              top: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "#000",
            }}
          >
            {isAndroid() ? (
              <TakePhotoCard
                onBack={handleBack}
                onTake={(base64) => OnCapture("imgFront", base64)}
              />
            ) : (
              <>
                <CameraOpenIdCard
                  setDataImage={(base64) => OnCapture("imgFront", base64)}
                />
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 11,
                    left: 20,
                    zIndex: 99999,
                  }}
                >
                  <IconButton sx={{ color: "#fff" }} onClick={handleBack}>
                    <Reply sx={{ fontSize: 40 }} />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        )}
        {activeStep === 6 && (
          <Stack gap={2} sx={{ p: 4, alignItems: "center" }}>
            <Typography variant="h5">
              ตัวอย่างรูปหน้าบัตรประชาชนของคุณ
            </Typography>
            <img src={input.imgFront} alt={input.imgFront} width={"70%"} />
          </Stack>
        )}
        {activeStep === 7 && (
          <Stack gap={2} sx={{ p: 4 }}>
            <Typography variant="h5">ถ่ายรูปใบหน้าของคุณ</Typography>

            <Box p={3}>
              <img src={profile} alt={profile} width={"100%"} height={"100%"} />
            </Box>
          </Stack>
        )}
        {activeStep === 8 && (
          <Box
            sx={{
              position: "fixed",
              zIndex: 999,
              top: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "#000",
            }}
          >
            {isAndroid() ? (
              <TakePhotoFace
                onBack={handleBack}
                onTake={(base64) => OnCapture("imgBack", base64)}
              />
            ) : (
              <>
                <CameraOpenFace
                  setDataImage={(base64) => OnCapture("imgBack", base64)}
                />
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 11,
                    left: 20,
                    zIndex: 99999,
                  }}
                >
                  <IconButton sx={{ color: "#fff" }} onClick={handleBack}>
                    <Reply sx={{ fontSize: 40 }} />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        )}
        {activeStep === 9 && (
          <Stack gap={2} sx={{ p: 4, alignItems: "center" }}>
            <Typography variant="h5">ตัวอย่างรูปใบหน้าของคุณ</Typography>
            <img src={input.imgBack} alt={input.imgBack} width={"70%"} />
          </Stack>
        )}
        {activeStep === 10 && (
          <Stack gap={2} sx={{ p: 4 }}>
            <Typography variant="h5">ถ่ายรูปสมุดบัญชีของคุณ</Typography>

            <Box p={3}>
              <img src={book} alt={book} width={"100%"} height={"100%"} />
            </Box>
          </Stack>
        )}
        {activeStep === 11 && (
          <Box
            sx={{
              position: "fixed",
              zIndex: 999,
              top: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "#000",
            }}
          >
            {isAndroid() ? (
              <TakePhoto
                onBack={handleBack}
                onTake={(base64) => OnCapture("imgBook", base64)}
              />
            ) : (
              <>
                <CameraOpenBook
                  setDataImage={(base64) => OnCapture("imgBook", base64)}
                />
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 11,
                    left: 20,
                    zIndex: 99999,
                  }}
                >
                  <IconButton sx={{ color: "#fff" }} onClick={handleBack}>
                    <Reply sx={{ fontSize: 40 }} />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        )}
        {activeStep === 12 && (
          <Stack gap={2} sx={{ p: 4, alignItems: "center" }}>
            <Typography variant="h5">ตัวอย่างรูปสมุดบัญชีของคุณ</Typography>
            <img src={input.imgBook} alt={input.imgBook} width={"70%"} />
          </Stack>
        )}
        {activeStep === 13 && (
          <Stack gap={2} sx={{ p: 4, alignItems: "start" }}>
            <Box>
              <Typography variant="body1">
                <strong>คำนำหน้า: </strong>
                {input.titlename}
              </Typography>
              {!errors.titlename && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก คำนำหน้าชื่อ
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>ชื่อ: </strong>
                {input.firstname}
              </Typography>
              {!errors.firstname && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก ชื่อ
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>นามสกุล: </strong>
                {input.lastname}
              </Typography>
              {!errors.lastname && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก นามสกุล
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>วันเกิด: </strong>
                {toDate(input.birthdate)}
              </Typography>
              {!errors.birthdate && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก วันเกิด
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>เลขหน้าบัตรประชาชน: </strong>
                {input.citizen_id}
              </Typography>
              {!errors.citizen_id && (
                <FormHelperText sx={{ color: "red" }}>
                  *เลขหน้าบัตรประชาชน ความยาว 13 ตัวอักษร
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>เลขหลังบัตรประชาชน: </strong>
                {input.back_id}
              </Typography>
              {!errors.back_id && (
                <FormHelperText sx={{ color: "red" }}>
                  *เลขหลังบัตรประชาชน ความยาว 14 ตัวอักษร MJ3-XXXXXXX-XX
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>อีเมล: </strong>
                {input.email}
              </Typography>
              <Typography variant="body1">
                <strong>อาชีพ: </strong>
                {input.job}
              </Typography>
              {!errors.job && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก อาชีพ
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>เงินเดือน | รายได้: </strong>
                {toTHB(input.salary)}
              </Typography>
              {!errors.salary && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก เงินเดือน | รายได้
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>เลขที่บัญชี: </strong>
                {input.book}
              </Typography>
              {!errors.book && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก เลขที่บัญชี
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>ธนาคาร: </strong>
                {input.bank}
              </Typography>
              {!errors.bank && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก ธนาคาร
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>ที่อยู่: </strong>
                {input.address}
              </Typography>
              {!errors.address && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก ที่อยู่
                </FormHelperText>
              )}
              <Stack direction="row" sx={{ gap: 2 }}>
                <Typography variant="body1">
                  <strong>เลขที่: </strong>
                  {input.houseno}
                </Typography>
                <Typography variant="body1">
                  <strong>หมู่: </strong>
                  {input.villageno}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 2 }}>
                <Typography variant="body1">
                  <strong>ซอย: </strong>
                  {input.lane}
                </Typography>
                <Typography variant="body1">
                  <strong>ถนน: </strong>
                  {input.road}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 2 }}>
                <Typography variant="body1">
                  <strong>แขวง: </strong>
                  {input.subdistrict}
                </Typography>
                <Typography variant="body1">
                  <strong>เขต: </strong>
                  {input.district}
                </Typography>
                <Typography variant="body1">
                  <strong>รหัสไปรษณี: </strong>
                  {input.zipcode}
                </Typography>
              </Stack>
              <Typography variant="body1">
                <strong>ประเทศ: </strong>
                {input.country}
              </Typography>
              {!errors.country && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก ประเทศ
                </FormHelperText>
              )}
              <Typography variant="body1">
                <strong>บริษัท: </strong>
                {input.job_company_name}
              </Typography>
              {!errors.job_company_name && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก ที่อยู่
                </FormHelperText>
              )}
              <Stack direction="row" sx={{ gap: 2 }}>
                <Typography variant="body1">
                  <strong>เลขที่: </strong>
                  {input.job_houseno}
                </Typography>
                <Typography variant="body1">
                  <strong>หมู่: </strong>
                  {input.job_villageno}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 2 }}>
                <Typography variant="body1">
                  <strong>ซอย: </strong>
                  {input.job_lane}
                </Typography>
                <Typography variant="body1">
                  <strong>ถนน: </strong>
                  {input.job_road}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 2 }}>
                <Typography variant="body1">
                  <strong>แขวง: </strong>
                  {input.job_subdistrict}
                </Typography>
                <Typography variant="body1">
                  <strong>เขต: </strong>
                  {input.job_district}
                </Typography>
                <Typography variant="body1">
                  <strong>รหัสไปรษณี: </strong>
                  {input.job_zipcode}
                </Typography>
              </Stack>
              <Typography variant="body1">
                <strong>ประเทศ: </strong>
                {input.job_country}
              </Typography>
              {!errors.job_country && (
                <FormHelperText sx={{ color: "red" }}>
                  *กรุณากรอก ประเทศ
                </FormHelperText>
              )}
            </Box>
          </Stack>
        )}
        <Divider />
        <Stack direction="row" sx={{ justifyContent: "center" }}>
          <MobileStepper
            variant="dots"
            steps={14}
            position="static"
            activeStep={activeStep}
            sx={{ bgcolor: "transparent" }}
            nextButton={<></>}
            backButton={<></>}
          />
        </Stack>
        <Stack direction="row" sx={{ my: 2, gap: 2, px: 2 }}>
          {activeStep > 0 && (
            <Button className="btn-1" onClick={handleBack}>
              ย้อนกลับ
            </Button>
          )}
          {activeStep === 13 ? (
            <Button className="btn-4" onClick={onClick}>
              ยื่นเอกสาร
            </Button>
          ) : (
            <Button className="btn-4" onClick={handleNext}>
              ถัดไป
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ApplyKYC;
