import RichText from "@/component/RichText";
import Switch from "@/component/Switch";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
const defaultData = {
  "id": -1,
  "created_at": "2024-07-30T10:32:22.030Z",
  "updated_at": "2024-08-08T06:23:14.000Z",
  "deleted_at": null,
  "category_id": 1,
  "form_id": 1,
  "name": "",
  "title": "",
  "minimum_amount": "10000.00000000",
  "maximum_amount": "100000.00000000",
  "instruction": "",
  "delay_value": 15,
  "fixed_charge": "0.00",
  "percent_charge": 0,
  "is_featured": "Non-Featured",
  "status": "Enable",
  "description": "",
  "images": "",
  "per_interest": 12,
  "application_percent_charge": 0,
  "category": "",
  "stamp":"2000.00000000",
  "document":1,
  "is_guarantee": "not_guarantee",
  "type_interest": "effectiverate"
}

const defaultFields = {
  index: 0,
  type: "Text",
  is_required: "required",
  label: "",
  field_name: "",
  width: 100,
  options: [],
  extensions: [],
  instruction: "",
};

const defaultRate = {
  index: 0,
  installment: "1",
  interest_rate: "0",
};

const file_extension = [".png", ".jpg", ".jpeg", ".pdf"];

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ConfirmDialog from "@/component/ConfirmDialog";

function FormPlans() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toDate, toTHB, toFloat } = useContext(ToolsContext);
  const [data, setData] = useState(defaultData);
  const [dataField, setDataField] = useState(defaultFields);
  const [dataRate, setDataRate] = useState(defaultRate);
  const [erros, setErrors] = useState([]);
  const [applicationForm, setApplicationForm] = useState<(typeof dataField)[]>(
    []
  );

  const [rate, setRate] = useState<(typeof dataRate)[]>([]);
  const [method, setMethod] = useState("create");
  const [categories, setCategories] = useState([]);
  const [typeInterest, setTypeInterest] = useState(defaultData.type_interest || 'effectiverate');

  const digitOnly = /^[0-9]*$/;
  const engOnly = /^[a-zA-Z0-9]*$/;

  useEffect(() => {
    Get(`category?limit=1000`).then((response) => {
      setCategories(response.data.data);
    });
    if (id) {
      setMethod("edit");
      Get(`plan/loan/edit/${id}`).then((response) => {
        const { rate, ...plans } = response.data.data.loanPlan;
      setImageUrl(plans.images)
      plans.minimum_amount = Number(plans.minimum_amount);
      plans.maximum_amount = Number(plans.maximum_amount);
      plans.fixed_charge = Number(plans.fixed_charge);
      plans.stamp = Number(plans.stamp);
      plans.type_interest = plans.type_interest || "effectiverate";
        setData(plans);
        setApplicationForm(response.data.data.applicationForm);
        setRate(rate);
      });
    } else {
      setMethod("create");
      setData((prev) => ({
      ...prev,
      minimum_amount: Number(prev.minimum_amount),
      maximum_amount: Number(prev.maximum_amount),
      fixed_charge: Number(prev.fixed_charge),
      stamp: Number(prev.stamp),
      type_interest: "effectiverate",
    }));
    }
  }, [id]);
  // const onChange = (e) => {
  //   const { name, value } = e.target;
    
  //   if (name === 'minimum_amount') {
  //     if (digitOnly.test(value)) {
  //       setData((prev) => {
  //         return {
  //           ...prev,
  //           [name]: value,
  //         };
  //       });
  //     }
  //   } else if (name === 'maximum_amount') {
  //     if (digitOnly.test(value)) {
  //       setData((prev) => {
  //         return {
  //           ...prev,
  //           [name]: value,
  //         };
  //       });
  //     }
  //   } else if (name === 'application_percent_charge') {
  //     if (digitOnly.test(value)) {
  //       setData((prev) => {
  //         return {
  //           ...prev,
  //           [name]: value,
  //         };
  //       });
  //     }
  //   } else if (name === 'delay_value') {
  //     if (digitOnly.test(value)) {
  //       setData((prev) => {
  //         return {
  //           ...prev,
  //           [name]: value,
  //         };
  //       });
  //     }
  //   } else if (name === 'fixed_charge') {
  //     if (digitOnly.test(value)) {
  //       setData((prev) => {
  //         return {
  //           ...prev,
  //           [name]: value,
  //         };
  //       });
  //     }
  //   } else if (name === 'percent_charge') {
  //     if (digitOnly.test(value)) {
  //       setData((prev) => {
  //         return {
  //           ...prev,
  //           [name]: value,
  //         };
  //       });
  //     }
  //   } else if (name === 'stamp') {
  //     if (digitOnly.test(value)) {
  //       setData((prev) => {
  //         return {
  //           ...prev,
  //           [name]: value,
  //         };
  //       });
  //     }
  //   } else if (name === 'document') {
  //     if (digitOnly.test(value)) {
  //       setData((prev) => {
  //         return {
  //           ...prev,
  //           [name]: value,
  //         };
  //       });
  //     }
  //   } else {
  //     setData((prev) => {
  //       return {
  //         ...prev,
  //         [name]: value,
  //       };
  //     });
  //   }
  // };
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
  
    if (name === 'minimum_amount' || name === 'maximum_amount' || name === 'application_percent_charge' ||
        name === 'delay_value' || name === 'fixed_charge' ||
        name === 'stamp' || name === 'document') {
          
          if (value === '') {
            setData((prev) => ({
              ...prev,
              [name]: value,
            }));
            setFieldError(name,"");
          } else if (digitOnly.test(value)) {
            setData((prev) => ({
              ...prev,
              [name]: value,
            }));
            removeFieldError(name);
          }
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onChangeRate = (e) => {
    const { name, value } = e.target;
  
    if (digitOnly.test(value)) {
      setDataRate((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const onChangeField = (e) => {
    const { name, value } = e.target;
    
    if (name === 'field_name') {
      if (engOnly.test(value)) {
        setDataField((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
      }
    } else if (name === 'type') {
      setDataField((prev) => {
        return {
          ...prev,
          [name]: value,
          extensions: value !== 'File' ? [] : prev.extensions,
        };
      });
    } else {
      setDataField((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const onSubmit = () => {

  let validationErrors = [];
  if (data.name === null || data.name === undefined || data.name === "") {
    validationErrors.push({ field: 'name', message: 'กรุณากรอกชื่อแผน' });
  }
  if (data.title === null || data.title === undefined || data.title === "") {
    validationErrors.push({ field: 'title', message: 'กรุณากรอกเรื่อง' });
  }
  if (data.minimum_amount === null || data.minimum_amount === undefined || data.minimum_amount === "") {
    validationErrors.push({ field: 'minimum_amount', message: 'กรุณากรอกจำนวนขั้นต่ำที่ถูกต้อง' });
  }
  if (data.maximum_amount === null || data.maximum_amount === undefined || data.maximum_amount === "") {
    validationErrors.push({ field: 'maximum_amount', message: 'กรุณากรอกจำนวนสูงสุดที่ถูกต้อง' });
  }
  if (data.application_percent_charge === null || data.application_percent_charge === undefined || data.application_percent_charge === "") {
    validationErrors.push({ field: 'application_percent_charge', message: 'กรุณากรอกค่าธรรมเนียม' });
  }
  if (data.delay_value === null || data.delay_value === undefined || data.delay_value === "") {
    validationErrors.push({ field: 'delay_value', message: 'กรุณากรอกเงื่อนไขการคิดค่าทวงถาม' });
  }
  if (data.fixed_charge === null || data.fixed_charge === undefined || data.fixed_charge === "") {
    validationErrors.push({ field: 'fixed_charge', message: 'กรุณากรอกค่าทวงถาม' });
  }
  if (data.stamp === null || data.stamp === undefined || data.stamp === "") {
    validationErrors.push({ field: 'stamp', message: 'กรุณากรอกค่าแสตมป์' });
  }
  if (data.document === null || data.document === undefined || data.document === "") {
    validationErrors.push({ field: 'document', message: 'กรุณากรอกคู่ฉบับ/คู่ฉีก' });
  }
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return; 
  }
  
    if (method === "create") {
      Post(`plan/loan/create`, {
        ...data,
        applicationForm: applicationForm,
        addRate: rate,
      })
        .then((response) => {
          const responseData = response.data.data;

        responseData.minimum_amount = Number(responseData.minimum_amount);
        responseData.maximum_amount = Number(responseData.maximum_amount);
        responseData.fixed_charge = Number(responseData.fixed_charge);
        responseData.stamp = Number(responseData.stamp);

          setData(responseData);
          AddAlert(MessageResponse(response), "info");
        })
        .catch((error) => {
          AddAlert(ErrorResponse(error), "error");
          if (error?.response?.data) setErrors(error.response.data.data);
        });
    } else {
      Put(`plan/loan/edit/${data.id}`, {
        ...data,
        applicationForm: applicationForm,
        addRate: rate,
      })
        .then((response) => {
          setData(response.data.data);
          AddAlert(MessageResponse(response), "info");
        })
        .catch((error) => {
          AddAlert(ErrorResponse(error), "error");
          if (error?.response?.data) setErrors(error.response.data.data);
        });
    }
  };

  // Application Form
  const onSubmitField = () => {
    const __existed = applicationForm.find(
      (form) => form.label === dataField.label
    );
    if (__existed)
      return setApplicationForm((prev) =>
        prev.map((form) => {
          if (form.label === dataField.label)
            return {
              ...dataField,
              index: applicationForm.length + 1,
            };
          return form;
        })
      );
    setApplicationForm((prev) => [
      ...prev,
      { ...dataField, index: rate.length + 1 },
    ]);
  };

  const handleDeleteField = (index) => {
    const __deleted = applicationForm.filter((_, i) => i !== index);
    const formetter = __deleted.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
    setApplicationForm(formetter);
  };
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(applicationForm);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setApplicationForm(
      newItems.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      })
    );
  };

  // Installment Rate
  const onSubmitRate = () => {
    const __existed = rate.find(
      (form) => form.installment === dataRate.installment
    );
    if (__existed)
      return setRate((prev) =>
        prev.map((form) => {
          if (form.installment === dataRate.installment)
            return {
              ...dataRate,
              index: rate.length + 1,
            };
          return form;
        })
      );
    setRate((prev) => [...prev, { ...dataRate, index: rate.length + 1 }]);
  };

  const handleTypeInterestChange = (event) => {
    setTypeInterest(event.target.value);
    setData(prevData => ({
      ...prevData,
      type_interest: event.target.value
    }));
  };

  const handleDeleteRate = (index) => {
    const __deleted = rate.filter((_, i) => i !== index);
    const formetter = __deleted.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    });
    setRate(formetter);
  };
  const handleOnDragEndRate = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(rate);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setRate(
      newItems.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      })
    );
  };
  const inputRender = (label, field, end = "",is_required = 'optional') => {
    const __error = erros.find((x) => x.field == field) || false;

    return (
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" sx={{color:'#000'}}>
              {label}
              {is_required == "required" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </Typography>
        <TextField
          error={__error}
          fullWidth
          size="small"
          value={data[field]}
          name={field}
          onChange={onChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">{end}</InputAdornment>
            ),
          }}
        />
        {__error && (
          <FormHelperText sx={{ color: "#eb2222" }}>
            {__error.message}
          </FormHelperText>
        )}
      </Box>
    );
  };

  const inputRateRender = (label, field, end = "") => {
    const __error = erros.find((x) => x.field == field) || false;
    return (
      <Box sx={{ flex: 1 }}>
        <InputLabel sx={{color:'#000'}}>{label}</InputLabel>
        <TextField
          error={__error}
          fullWidth
          size="small"
          value={dataRate[field]}
          name={field}
          onChange={onChangeRate}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">{end}</InputAdornment>
            ),
          }}
        />
        {__error && (
          <FormHelperText sx={{ color: "#eb2222" }}>
            {__error.message}
          </FormHelperText>
        )}
      </Box>
    );
  };

  const inputFieldRender = (label, field, end = "") => {
    const __error = erros.find((x) => x.field == field) || false;
    return (
      <Box sx={{ flex: 1 }}>
        <InputLabel sx={{color:'#000'}}>{label}</InputLabel>
        <TextField
          error={__error}
          fullWidth
          size="small"
          value={dataField[field]}
          name={field}
          onChange={onChangeField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">{end}</InputAdornment>
            ),
          }}
        />
        {__error && (
          <FormHelperText sx={{ color: "#eb2222" }}>
            {__error.message}
          </FormHelperText>
        )}
      </Box>
    );
  };

  const selectRenderField = (label, field, items) => {
    const __error = erros.find((x) => x.field == field) || false;
    return (
      <Box sx={{ flex: 1 }}>
        <InputLabel sx={{color:'#000'}}>{label}</InputLabel>
        <Select
          size="small"
          fullWidth
          displayEmpty
          name={field}
          value={dataField[field]}
          onChange={onChangeField}
        >
          <MenuItem
            sx={{ display: "none" }}
            children={useLang("เลือกหนึ่งอย่าง", "Select One")}
          />
          {items.map((item, index) => (
            <MenuItem key={index} value={item.value} children={item.label} />
          ))}
        </Select>
        {__error && (
          <FormHelperText sx={{ color: "#eb2222" }}>
            {__error.message}
          </FormHelperText>
        )}
      </Box>
    );
  };

  const selectRender = (label, field, items) => {
    const __error = erros.find((x) => x.field == field) || false;
    return (
      <Box sx={{ flex: 1 }}>
        <InputLabel sx={{color:'#000'}}>{label}</InputLabel>
        <Select
          size="small"
          fullWidth
          displayEmpty
          name={field}
          value={data[field]}
          onChange={onChange}
        >
          <MenuItem
            sx={{ display: "none" }}
            children={useLang("เลือกหนึ่งอย่าง", "Select One")}
          />
          {items.map((item, index) => (
            <MenuItem key={index} value={item.value} children={item.label} />
          ))}
        </Select>
        {__error && (
          <FormHelperText sx={{ color: "#eb2222" }}>
            {__error.message}
          </FormHelperText>
        )}
      </Box>
    );
  };

  const optionRender = () => {
    const __options = dataField.options;
    return (
      <Stack sx={{ gap: 2 }}>
        {__options.map((value, index) => (
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", gap: 2 }}
          >
            <TextField key={index} size="small" fullWidth value={value} />
            <Button
              onClick={() => removeOptions(value)}
              variant="contained"
              color="error"
              children={<Icons.Close />}
            />
          </Stack>
        ))}
      </Stack>
    );
  };

  const [opValue, setOpValue] = useState("");
  const pustOptions = () => {
    const __options = dataField.options;
    const __existed = __options.find((value) => value === opValue);
    if (__existed)
      return AddAlert(useLang("ข้อมูลซ้ำกัน!", "Duplicated!"), "warning");
    __options.push(opValue);
    setDataField((prev) => {
      return {
        ...prev,
        options: __options,
      };
    });
    setOpValue("");
  };

  const removeOptions = (value) => {
    let __options = dataField.options;
    __options = __options.filter((x) => x !== value);
    setDataField((prev) => {
      return {
        ...prev,
        options: __options,
      };
    });
  };
  const showOptions = () => {
    const __render = (
      <Box>
        <InputLabel sx={{color:'#000'}}>{useLang("เพิ่ม ทางเลือก", "Add Options")}</InputLabel>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
          <TextField
            size="small"
            fullWidth
            value={opValue}
            onChange={(e) => setOpValue(e.target.value)}
          />
          <Button
            onClick={pustOptions}
            variant="contained"
            children={<Icons.Add />}
          />
        </Stack>
      </Box>
    );
    switch (dataField.type) {
      case "Select" || "Checkbox":
        return __render;
      case "Checkbox":
        return __render;
      case "Radio":
        return __render;
      case "File":
        return (
          <Box>
            <InputLabel sx={{color:'#000'}}>
              {useLang("นามสกุลไฟล์", "File Extensions *")}
            </InputLabel>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", gap: 2 }}
            >
              <Select
                size="small"
                fullWidth
                multiple
                name="extensions"
                value={dataField.extensions}
                onChange={onChangeField}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 2,
                          border: "1px solid #00000025",
                          bgcolor: "#00000010",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            px: 3,
                            pb: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {value}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              >
                {file_extension.map((value, index) => (
                  <MenuItem key={index} value={value} children={value} />
                ))}
              </Select>
            </Stack>
          </Box>
        );

      default:
        return "";
    }
  };

  const [dialogRate, setDialogRate] = useState(false);
  const [dialogField, setDialogField] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('images', file);
    Post(`plan/loan/upload/${data.id}`, formData).then(res=>{
     setImageUrl(`${res.data.data.images}?t=${Date.now()}`)
     setData(res.data.data);
    });
    // const readFileAsBase64 = (file) => {
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       resolve(reader.result);
    //     };
    //     reader.onerror = reject;
    //     reader.readAsDataURL(file);
    //   });
    // };
    // const __img = await readFileAsBase64(event.target.files[0]);
    // setData({ ...data, [event.target.name]: __img });
  };
  const [openDel, setOpenDel] = useState(false);
  const onDelete = () => {
    setOpenDel(true);
  };

  const deleteSubmit = () => {
    Delete(`plan/loan/delete/${id}`, {
    })
      .then((response) => {
        AddAlert(MessageResponse(response), "info");
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };
  return (
    <Stack spacing={2}>
      <ConfirmDialog
        open={openDel}
        onClose={() => setOpenDel(false)}
        onSubmit={deleteSubmit}
        text={'กรุณากดยืนยันหากคุณต้องการจะลบแผนสินเชื่อนี้'}
      />
      <Stack direction='row' sx={{justifyContent:'space-between'}}>
        <Button
          startIcon={<Icons.ArrowBackIos />}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </Button>
        {id && <Button
          startIcon={<Icons.Delete />}
          color="error"
          variant="contained"
          onClick={onDelete}
        >
          ลบแผน
        </Button>}
      </Stack>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={dialogRate}
        onClose={() => setDialogRate(false)}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <DialogTitle>
            {useLang("สร้างการผ่อนชำระ", "Generate Installment")}
          </DialogTitle>
          <IconButton
            color="error"
            sx={{ mx: 4 }}
            onClick={() => setDialogRate(false)}
          >
            <Icons.Close />
          </IconButton>
        </Stack>

        <Divider />
        <DialogContent>
          <Stack gap={2}>
            <Box>
              {inputRateRender(
                useLang("จำนวนงวด", "Installment"),
                "installment"
              )}
            </Box>
            <Box>
              {inputRateRender(
                useLang("อัตราดอกเบี้ย", "Interest Rate"),
                "interest_rate"
              )}
            </Box>
            <Button variant="contained" onClick={onSubmitRate}>
              {useLang("เพิ่ม", "Add")}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={dialogField}
        onClose={() => setDialogField(false)}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <DialogTitle>
            {useLang("สร้างชุดข้อมูล", "Generate Form")}
          </DialogTitle>
          <IconButton
            color="error"
            sx={{ mx: 4 }}
            onClick={() => setDialogField(false)}
          >
            <Icons.Close />
          </IconButton>
        </Stack>

        <Divider />
        <DialogContent>
          <Stack gap={2}>
            <Box>
              {selectRenderField(useLang("ประเภท *", "Type *"), "type", [
                {
                  value: "Text",
                  label: "Text",
                },
                // {
                //   value: "Email",
                //   label: "Email",
                // },
                // {
                //   value: "Number",
                //   label: "Number",
                // },
                // {
                //   value: "Url",
                //   label: "Url",
                // },
                // {
                //   value: "DateTime",
                //   label: "DateTime",
                // },
                // {
                //   value: "Date",
                //   label: "Date",
                // },
                // {
                //   value: "Time",
                //   label: "Time",
                // },
                {
                  value: "Select",
                  label: "Select",
                },
                // {
                //   value: "Checkbox",
                //   label: "Checkbox",
                // },
                // {
                //   value: "Radio",
                //   label: "Radio",
                // },
                {
                  value: "File",
                  label: "File",
                },
              ])}
            </Box>
            <Box>
              {selectRenderField(
                useLang("ความจำเป็นข้อมูล *", "Is Required *"),
                "is_required",
                [
                  {
                    value: "required",
                    label: useLang("ข้อมูลจำเป็น", "Required"),
                  },
                  {
                    value: "options",
                    label: useLang("ข้อมูลเสริม", "Optionals"),
                  },
                ]
              )}
            </Box>
            <Box>
              {inputFieldRender(useLang("ป้ายชื่อ *", "Label *"), "label")}
            </Box>
            <Box>
              {inputFieldRender(
                useLang("ชื่อตัวแปร (ภาษาอังกฤษเท่านั้น)*", "FieldName (Eng Only)*"),
                "field_name"
              )}
            </Box>
            {showOptions()}
            {optionRender()}
            <Box>
              {selectRenderField(useLang("ความกว้าง *", "Width *"), "width", [
                {
                  value: "100",
                  label: "100%",
                },
                {
                  value: "75",
                  label: "75%",
                },
                {
                  value: "50",
                  label: "50%",
                },
                {
                  value: "33",
                  label: "33%",
                },
                {
                  value: "25",
                  label: "25%",
                },
              ])}
            </Box>
            <Box>
              {inputFieldRender(
                useLang("การสอน (ถ้ามี)", "Instruction (if any)"),
                "instruction"
              )}
            </Box>
            <Button variant="contained" onClick={onSubmitField}>
              {useLang("เพิ่ม", "Add")}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {!id
              ? useLang("เพิ่มแผนใหม่", "Add New Plan")
              : useLang("ปรับปรุงแผน", "Edit Plans")}
          </Box>
          <Divider />
          <Box sx={{ flex: 1 }}>
            <InputLabel sx={{color:'#000'}}>{useLang("ป้ายโฆษณา*", "Banner*")}</InputLabel>
            <Button
            disabled={data.id === -1}
              component="label"
              variant="outlined"
              sx={{ width: "100%", height: 200 }}
            >
              {data.images ? (
                <img
                  src={`${import.meta.env.VITE_BASE}/file/${imageUrl}`}
                  alt="banner"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  onLoad={() => URL.revokeObjectURL(data.images)} // Cleanup the URL after image loads
                />
              ) : (
                "อัปโหลดภาพ"
              )}
              <input
                type="file"
                accept="image/*"
                name="images"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Button>
          </Box>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(useLang("ชื่อแผน", "Plan Name"), "name","","required")}
            {inputRender(useLang("เรื่อง", "Title"), "title","","required")}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(
              useLang("จำนวนขั้นต่ำ", "Minimum Amount"),
              "minimum_amount",
              useLang("บาท", "THB"),
              "required"
            )}
            {inputRender(
              useLang("จำนวนสูงสุด", "Maximum Amount"),
              "maximum_amount",
              useLang("บาท", "THB"),
              "required"
            )}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {/* {selectRender(
              useLang("หมวดหมู่*", "Category*"),
              "category_id",
              categories.map((category) => {
                return {
                  value: category.id,
                  label: category.name,
                };
              })
            )} */}
            {/* {inputRender(
              useLang("คำนวนดอกเบี้ย*", "Per Interest*"),
              "per_interest",
              useLang("เดือน", "Month")
            )} */}
            {inputRender(
              useLang("ค่าธรรมเนียม", "Application Percent Charge *"),
              "application_percent_charge",
              "%"
            )}
            {selectRender(
              useLang("รูปแบบดอกเบี้ย", "Type Interest *"),
              "type_interest",
              [
                {
                  value: "flatrate",
                  label: useLang("ดอกเบี้ยคงที่ (Flat Rate)", "flatrate"),
                },
                {
                  value: "effectiverate",
                  label: useLang("ลดต้นลดดอก (Effective Rate)", "effectiverate"),
                },
              ]
            )}
            {/* {inputRender(useLang("อัตราดอกเบี้ย*", "Interest rate*"), "interest_rate", "%/ปี")}
            {inputRender(
              useLang("การผ่อนชำระ*", "Installment Interval*"),
              "installment_interval",
              useLang("วัน", "Days")
            )}
            {inputRender(
              useLang("การผ่อนชำระทั้งหมด*", "Total Installments*"),
              "total_installment",
              useLang("ครั้ง", "Times")
            )} */}
          </Stack>
          {/* <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {
              <Box sx={{ flex: 1 }}>
                <InputLabel>
                  {useLang("ยอดชำระเงินต้น (%)*", "Per Installment (%)*")}
                </InputLabel>
                <TextField
                  disabled={true}
                  fullWidth
                  size="small"
                  value={
                    (Number(data.interest_rate) + 100) /
                    Number(data.total_installment)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </Box>
            }

            {inputRender(
              useLang("คำนวนดอกเบี้ย*", "Per Interest*"),
              "per_interest",
              useLang("เดือน", "Month")
            )}
            {inputRender(
              useLang(
                "ค่าธรรมเนียม *",
                "Application Percent Charge *"
              ),
              "application_percent_charge",
              "%"
            )}
            {selectRender(useLang("รูปแบบดอกเบี้ย *", "Feature *"), "is_featured", [
              {
                value: "Non-Featured",
                label: useLang("แบบดอกเบี้ยคงที่", "Non-Featured"),
              },
              {
                value: "Featured",
                label: useLang("แบบลดต้นลดดอก", "Featured"),
              },
            ])}
          </Stack> */}

          <Stack component={Paper}>
            <Stack gap={4} sx={{ p: 4 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {useLang("การผ่อนชำระ", "Installment")}
                </Box>
                <Button
                  startIcon={<Icons.Add />}
                  onClick={() => setDialogRate(true)}
                >
                  {useLang("กำหนด งวด/ดอกเบี้ย", "Add Installment/Interest")}
                </Button>
              </Stack>
              <Stack>
                <DragDropContext onDragEnd={handleOnDragEndRate}>
                  <Droppable droppableId="droppable">
                    {(provided) => (
                      <Stack
                        gap={2}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {rate.map((item, index) => (
                          <Draggable
                            key={item.installment}
                            draggableId={item.installment}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  p: 2,
                                  ...provided.draggableProps.style,
                                  borderRadius: 1,
                                  border: "1px solid #00000025",
                                }}
                              >
                                <Stack
                                  direction="row"
                                  gap={2}
                                  sx={{ alignItems: "center" }}
                                >
                                  <Stack
                                    sx={{ width: 50, alignItems: "center" }}
                                  >
                                    <Icons.DragIndicator />
                                  </Stack>
                                  <Stack flex={1}>
                                    <InputLabel sx={{color:'#000'}}>
                                      {useLang("ลำดับ", "Index")}
                                    </InputLabel>
                                    <Box component="span">{item.index}</Box>
                                  </Stack>
                                  <Stack flex={1}>
                                    <InputLabel sx={{color:'#000'}}>
                                      {useLang("จำนวนงวด", "Installment")}
                                    </InputLabel>
                                    <Box component="span">
                                      {toFloat(item?.installment || 0)}{" "}
                                      {useLang("งวด (เดือน)", "times")}
                                    </Box>
                                  </Stack>
                                  <Stack flex={1}>
                                    <InputLabel sx={{color:'#000'}}>
                                      {useLang(
                                        "อัตราดอกเบี้ย (%)",
                                        "Interest Rate"
                                      )}
                                    </InputLabel>
                                    <Box component="span">
                                      {item?.interest_rate || 0} %
                                    </Box>
                                  </Stack>
                                  <Stack
                                    sx={{ width: 100, alignItems: "center" }}
                                  >
                                    <IconButton
                                      onClick={() => handleDeleteRate(index)}
                                    >
                                      <Icons.Cancel color="error" />
                                    </IconButton>
                                  </Stack>
                                </Stack>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Stack>
                    )}
                  </Droppable>
                </DragDropContext>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{color:'#000'}}>{useLang("รายละเอียดอย่างย่อ", "Details")}</InputLabel>
              <ReactQuill
                value={data["instruction"]}
                onChange={(value) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      instruction: value,
                    };
                  });
                }}
              />
            </Box>
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{color:'#000'}}>{useLang("รายละเอียด", "Description")}</InputLabel>
              <ReactQuill
                value={data["description"]}
                onChange={(value) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      description: value,
                    };
                  });
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {useLang(
              "ค่าธรรมเนียมการผ่อนชําระล่าช้า",
              "Installment Delay Charge"
            )}
          </Box>
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(
              useLang(
                "เงื่อนไขการคิดค่าทวงถาม",
                "Charge Will Apply If Delay"
              ),
              "delay_value",
              useLang("วัน", "Day")
            )}
            {inputRender(
              useLang("ค่าทวงถาม", "Fixed Charge"),
              "fixed_charge",
              useLang("บาท", "THB")
            )}
            {/* {inputRender(
              useLang("Percent Charge*", "Percent Charge*"),
              "percent_charge",
              "%"
            )} */}
          </Stack>
        </Stack>
      </Stack>

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {useLang(
              "อากรแสตมป์",
              "Stamp"
            )}
          </Box>
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(
              useLang(
                "แสตมป์",
                "Stamp"
              ),
              "stamp"
            )}
            {inputRender(
              useLang("คู่ฉบับ/คู่ฉีก", "Document"),
              "document"
            )}
            {/* {inputRender(
              useLang("Percent Charge*", "Percent Charge*"),
              "percent_charge",
              "%"
            )} */}
          </Stack>
        </Stack>
      </Stack>

      {/* ------------------------- ปิงเพิ่ม ------------------------- */}
      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {useLang("หลักประกัน", "Guarantee")}
          </Box>
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {selectRender(
              useLang("กำหนดการรับหลักประกัน", "Is There a Guarantee"),
              "is_guarantee",
              [
                { value: "is_guarantee", label: useLang("รับหลักประกัน", "With Guarantee") },
                { value: "not_guarantee", label: useLang("ไม่รับหลักประกัน", "Without Guarantee") },
              ]
            )}
          </Stack>
        </Stack>
      </Stack>
      {/* ------------------------- end ------------------------- */}


      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {useLang(
                "ข้อมูลประกอบการยื่นขอสินเชื่อเพิ่มเติม",
                "Loan Application Form Fields"
              )}
            </Box>
            <Button
              startIcon={<Icons.Add />}
              onClick={() => setDialogField(true)}
            >
              {useLang("เพิ่มข้อมูล", "Add Field")}
            </Button>
          </Stack>
          <Stack>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <Stack
                    gap={2}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {applicationForm.map((item, index) => (
                      <Draggable
                        key={item.label}
                        draggableId={item.label}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 2,
                              ...provided.draggableProps.style,
                              borderRadius: 1,
                              border: "1px solid #00000025",
                            }}
                          >
                            <Stack
                              direction="row"
                              gap={2}
                              sx={{ alignItems: "center" }}
                            >
                              <Stack sx={{ width: 50, alignItems: "center" }}>
                                <Icons.DragIndicator />
                              </Stack>
                              <Stack flex={1}>
                                <InputLabel sx={{color:'#000'}}>Label</InputLabel>
                                <Box component="span">{item.label}</Box>
                              </Stack>
                              <Stack flex={1}>
                                <InputLabel sx={{color:'#000'}}>FieldName</InputLabel>
                                <Box component="span">{item.field_name}</Box>
                              </Stack>
                              <Stack flex={1}>
                                <InputLabel sx={{color:'#000'}}>Type</InputLabel>
                                <Box component="span">{item.type}</Box>
                              </Stack>
                              <Stack flex={1}>
                                <InputLabel sx={{color:'#000'}}>Width</InputLabel>
                                <Box component="span">{item.width}%</Box>
                              </Stack>
                              <Stack flex={1}>
                                <Chip
                                  variant="outlined"
                                  color={
                                    item.is_required == "required"
                                      ? "success"
                                      : "default"
                                  }
                                  label={item.is_required}
                                />
                              </Stack>
                              <Stack sx={{ width: 100, alignItems: "center" }}>
                                <IconButton
                                  onClick={() => handleDeleteField(index)}
                                >
                                  <Icons.Cancel color="error" />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
        </Stack>
      </Stack>

      <Button variant="contained" onClick={onSubmit}>
        บันทึก
      </Button>
    </Stack>
  );
}

export default FormPlans;
