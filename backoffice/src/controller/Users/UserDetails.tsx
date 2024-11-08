import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import BoxTransaction from "@/component/BoxTransaction";
import "@/css/slide_button.css";
import { useContext, useEffect, useState } from "react";
import Switch from "@/component/Switch";
import BoxLoans from "@/component/BoxLoans";
import { useNavigate, useParams } from "react-router-dom";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import ConfirmDialog from "@/component/ConfirmDialog";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
const defaultData = {
  id: -1,
  created_at: "2024-07-09T03:58:41.414Z",
  updated_at: "2024-07-10T10:08:15.295Z",
  deleted_at: null,
  titlename: "",
  firstname: "",
  lastname: "",
  citizen_id: "",
  back_id: "",
  birthdate: dayjs(),
  mobile: "",
  job: "",
  salary:"",
  book:"",
  bank:"",
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
  email: "",
  username: "",
  permissionsId: -1,
  kyc: "unverfied",
  tf: "false",
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
  roles: [],
  permissions: null,
};

const digitOnly = /^[0-9]*$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const digitOnly13 = /^[0-9]{0,13}$/;

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang, dataRoute } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toDate, toTHB } = useContext(ToolsContext);
  const [data, setData] = useState(defaultData);
  const [erros, setErrors] = useState([]);
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
    if (id) {
      Get(`customer/users/details/${id}`)
        .then((response) => {
          const { roles, permissions, ...data } = response.data.data;
          data.salary = Number(data.salary);
          setData(data);
          setRoleInput({
            roles: roles.map((x) => x.key),
            permission: permissions?.id,
          });
        })
        .catch((error) => {
          console.log(error);
          navigate("/404");
        });
    }
  }, [id]);

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
  }, [data,province,district,subdistrict]);

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
    //     setErrors((prevErrors) => [...prevErrors, { field: name, message: "อีเมลไม่ถูกต้อง" }]);
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
    else if (["mobile", "book", "salary"].includes(name)) {
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

    Put(`customer/users`, send)
      .then((response) => {
        setData(response.data.data);
        AddAlert(MessageResponse(response), "info");
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        if (error?.response?.data) setErrors(error.response.data.data);
      });
  };

  const viewKYC = () => {
    const __route = dataRoute.find((x) => x.component == "users_kyc");
    navigate(`${__route.link}/${id}`);
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
            value={dayjs(data[field])}
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

  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleInput, setRoleInput] = useState({
    roles: [],
    permission: null,
  });
  const onChangeRoles = (e) => {
    const { name, value } = e.target;
    setRoleInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleOnSubmit = () => {
    Post(`system/set/roles`, { id: id, ...roleInput })
      .then((response) => {
        AddAlert(MessageResponse(response));
        setOpen(false);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  };

  useEffect(() => {
    Get(`system/permission`)
      .then((response) => {
        setPermissions(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    Get(`system/roles`)
      .then((response) => {
        setRoles(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [openDel, setOpenDel] = useState(false);
  const onDelete = () => {
    setOpenDel(true);
  };

  const delSubmit = () => {
    Post(`user/remove/${id}`, {})
      .then((response) => {
        setData(response.data.data);
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  return (
    <Stack gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
      <ConfirmDialog
        open={openDel}
        onClose={() => setOpenDel(false)}
        onSubmit={delSubmit}
        text={"กรุณากดยืนยันหากคุณต้องการจะลบลูกค้ารายดังกล่าวนี้"}
      />
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          startIcon={<Icons.ArrowBackIos />}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </Button>
        {id && (
          <Button
            startIcon={<Icons.Delete />}
            color="error"
            variant="contained"
            onClick={onDelete}
          >
            {useLang("ลบลูกค้า", "Remove Customers")}
          </Button>
        )}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Stack gap={4}>
            <Typography variant="h6">ปรับสิทธิ์ลูกค้า</Typography>
            <Stack>
              <Typography variant="body1">บทบาทหน้าที่</Typography>

              <Select
                displayEmpty
                size="small"
                fullWidth
                multiple
                name="roles"
                onChange={onChangeRoles}
                value={roleInput.roles}
                renderValue={(values) => {
                  return (
                    <Stack direction="row" gap={2}>
                      {values.join(', ')}
                    </Stack>
                  );
                }}
              >
                {roles.map((role) => (
                  <MenuItem value={role.key}>{role.key}</MenuItem>
                ))}
              </Select>
            </Stack>

            <Stack>
              <Typography variant="body1">อนุญาติสิทธิ์</Typography>
              <Select
                displayEmpty
                size="small"
                fullWidth
                name="permission"
                onChange={onChangeRoles}
                value={roleInput.permission}
              >
                <MenuItem>ไม่กำหนด</MenuItem>
                {permissions.map((per: any) => (
                  <MenuItem value={per.id}>{per.name}</MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <FormHelperText sx={{ color: "#eb2222" }}>
                *หากมีการเพิ่มสิทธิ์ลูกค้าจะถูกปรับให้เป็นพนักงานทันที
              </FormHelperText>
              <Button variant="contained" onClick={handleOnSubmit}>
                ยืนยัน
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      {/* <BoxLoans
        labels={[
          "Running Loans",
          "Pending Loans",
          "Pain Loans",
          "Reject Loans",
        ]}
        values={[
          data["loan_running"],
          data["loan_pending"],
          data["loan_pain"],
          data["loan_reject"],
        ]}
        colors={["#4634ff", "#28c76f", "#eb2222", "#ff9f43"]}
        icons={["RotateRight", "Sync", "TaskAlt", "Block"]}
      /> */}

      {/* Infomation */}

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack direction="row" gap={2} sx={{ alignItems: "center" }}>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {useLang("ข้อมูลผู้ใช้งาน", "Information")}
              </Box>
              {roleInput.roles.length ? (
                <Chip
                  color="info"
                  variant="outlined"
                  label="พนักงาน"
                  sx={{ width: 100 }}
                />
              ) : (
                <Chip
                  color="success"
                  variant="outlined"
                  label="ลูกค้า"
                  sx={{ width: 100 }}
                />
              )}
            </Stack>

            <Stack direction="row" gap={2}>
              <Button variant="contained" onClick={viewKYC}>
                {useLang("ข้อมูลยืนยันตัวตน", "KYC Information")}
              </Button>
              <Button variant="contained" onClick={() => setOpen(true)}>
                {useLang("ปรับสิทธิ์", "Change Roles")}
              </Button>
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(
              useLang("คำนำหน้า", "Title Name"),
              "titlename",
              "select",
              ["นาย", "นาง", "นายสาว"],
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
            {inputRender(useLang("เลขบัตรประชาชน", "Citizen ID"), "citizen_id")}
            {inputRender(useLang("เลขหลังบัตรประชาชน", "Laser ID"), "back_id", "text", [], "required")}
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
          <Stack direction="row" gap={4} flexWrap="wrap">
            <Box sx={{ flex: 1 }}>
              <InputLabel>{useLang("PIN", "PIN")}</InputLabel>
              <Switch
                checked={data["pa"] == "enable"}
                labels={{ checked: "Enable", unchecked: "Disable" }}
                name="pa"
                onChange={onChange}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("ยืนยันเบอร์.มือถือ", "Mobile Verification")}
              </Typography>

              <Switch
                checked={data["sv"] == "verified"}
                name="sv"
                onChange={onChange}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">Line Official</Typography>
              <Switch
                checked={data["la"] == "enable"}
                labels={{ checked: "Enable", unchecked: "Disable" }}
                name="la"
                onChange={onChange}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {useLang("ยืนยัน.ตัวตน", "KYC Verification")}
              </Typography>
              <Switch
                checked={data["kyc"] == "verified"}
                name="kyc"
                onChange={onChange}
              />
            </Box>
          </Stack>
          <Button variant="contained" onClick={onSubmit}>
            ยืนยัน
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default UserDetails;
