import RichText from "@/component/RichText";
import Switch from "@/component/Switch";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
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
  "id": 4,
  "created_at": "2024-07-25T10:46:54.179Z",
  "category_id": 3,
  "form_id": 4,
  "name": "",
  "title": "",
  "minimum_amount": "0",
  "maximum_amount": "0",
  "per_installment": "0.00",
  "installment_interval": 30,
  "total_installment": 12,
  "application_fixed_charge": "0.00000000",
  "application_percent_charge": "0.00000000",
  "instruction": null,
  "delay_value": 12,
  "fixed_charge": "0.00000000",
  "percent_charge": "0.00000000",
  "is_featured": "Non-Featured",
  "status": "Enable",
  "interest_rate": -40
};

const defaultFields = {
  index: 0,
  type: "Text",
  is_required: "required",
  label: "",
  width: 100,
  options: [],
  extensions: [],
  instruction: "",
};

const file_extension = [".png", ".jpg", ".jpeg", ".pdf"];

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function FormPlans() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toDate, toTHB } = useContext(ToolsContext);
  const [data, setData] = useState(defaultData);
  const [dataField, setDataField] = useState(defaultFields);
  const [erros, setErrors] = useState([]);
  const [applicationForm, setApplicationForm] = useState<(typeof dataField)[]>(
    []
  );
  const [method, setMethod] = useState('create');
  const [categories,setCategories] = useState([]);
 
  useEffect(() => {
    Get(`category?limit=1000`).then((response) => {
      setCategories(response.data.data);
    });
    if(id)
    {
      setMethod('edit');
      Get(`plan/loan/edit/${id}`).then((response) => {
        setData(response.data.data.loanPlan);
        setApplicationForm(response.data.data.applicationForm);
      });
    }
    else
    {
      setMethod('create');
    }
  
  }, [id]);
  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setDataField((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmit = () => {
    if(method === 'create')
    {
      Post(`plan/loan/create`, {...data,applicationForm: applicationForm})
      .then((response) => {
        setData(response.data.data);
        AddAlert(MessageResponse(response), "info");
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        if (error?.response?.data) setErrors(error.response.data.data);
      });
    }else
    {
      Put(`plan/loan/edit/${data.id}`, {...data,applicationForm: applicationForm})
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
              index:applicationForm.length+1
            };
          return form;
        })
      );
    setApplicationForm((prev) => [...prev, dataField]);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(applicationForm);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setApplicationForm(newItems.map((item,index)=>{
      return {
       ...item,
        index: index+1
      };
    }));
  };
  const inputRender = (label, field, end = "") => {
    const __error = erros.find((x) => x.field == field) || false;
    return (
      <Box sx={{ flex: 1 }}>
        <InputLabel>{label}</InputLabel>
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

  const inputFieldRender = (label, field, end = "") => {
    const __error = erros.find((x) => x.field == field) || false;
    return (
      <Box sx={{ flex: 1 }}>
        <InputLabel>{label}</InputLabel>
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
        <InputLabel>{label}</InputLabel>
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
        <InputLabel>{label}</InputLabel>
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
        <InputLabel>{useLang("เพิ่ม ทางเลือก", "Add Options")}</InputLabel>
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
            <InputLabel>
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

  const [dialogField, setDialogField] = useState(false);
  return (
    <Stack spacing={2}>
      <Box>
      <Button startIcon={<Icons.ArrowBackIos/>} variant="contained" onClick={()=>navigate(-1)}>Back</Button>
      </Box>
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
                {
                  value: "Email",
                  label: "Email",
                },
                {
                  value: "Number",
                  label: "Number",
                },
                {
                  value: "Url",
                  label: "Url",
                },
                {
                  value: "DateTime",
                  label: "DateTime",
                },
                {
                  value: "Date",
                  label: "Date",
                },
                {
                  value: "Time",
                  label: "Time",
                },
                {
                  value: "Select",
                  label: "Select",
                },
                {
                  value: "Checkbox",
                  label: "Checkbox",
                },
                {
                  value: "Radio",
                  label: "Radio",
                },
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
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {inputRender(useLang("ชื่อแผน*", "Plan Name*"), "name")}
            {inputRender(useLang("เรื่อง*", "Title*"), "title")}
            {inputRender(
              useLang("จำนวนขั้นต่ำ*", "Minimum Amount*"),
              "minimum_amount",
              useLang("บาท", "THB"),
            )}
            {inputRender(
              useLang("จำนวนสูงสุด*", "Maximum Amount*"),
              "maximum_amount",
              useLang("บาท", "THB"),
            )}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
          {selectRender(
               useLang("หมวดหมู่*", "Category*"),
                "category_id",
                categories.map(category => {
                  return {
                    value: category.id,
                    label: category.name
                  }
                })
              )}
            
            {inputRender(
              useLang("ค่างวด (%)*", "Per Installment (%)*"),
              "per_installment",
              "%"
            )}
            {inputRender(
              useLang("การผ่อนชำระ*", "Installment Interval*"),
              "installment_interval",
              useLang("วัน", "Days"),
            )}
            {inputRender(
              useLang("ยอดผ่อนชำระทั้งหมด*", "Total Installments*"),
              "total_installment",
              useLang("ครั้ง", "Times"),
            )}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            {
               <Box sx={{ flex: 1 }}>
               <InputLabel>{useLang("ผลตอบแทน*", "Profit*")}</InputLabel>
               <TextField
               disabled={true}
                 fullWidth
                 size="small"
                 value={(Number(data.per_installment) * Number(data.total_installment)) -100}
                 InputProps={{
                   endAdornment: (
                     <InputAdornment position="start">%</InputAdornment>
                   ),
                 }}
               />
             </Box>
            }
        
            {inputRender(
              useLang("Application Fixed Charge*", "Application Fixed Charge*"),
              "application_fixed_charge",
              useLang("บาท", "THB"),
            )}
            {inputRender(
              useLang("Application Percent Charge *", "Application Percent Charge *"),
              "application_percent_charge"
            )}
             {selectRender(
                useLang("Feature *", "Feature *"),
                "is_featured",
                [
                  {
                    value: "Non-Featured",
                    label: useLang("Non-Featured", "Non-Featured"),
                  },
                  {
                    value: "Featured",
                    label: useLang("Featured", "Featured"),
                  },
                ]
              )}
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel>{useLang("คำแนะนำ*", "Instruction*")}</InputLabel>
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
                "Charge Will Apply If Delay*",
                "Charge Will Apply If Delay*"
              ),
              "delay_value",
              useLang("วัน", "Day"),
            )}
            {inputRender(
              useLang("Fixed Charge*", "Fixed Charge*"),
              "fixed_charge",
              useLang("บาท", "THB"),
            )}
            {inputRender(
              useLang("Percent Charge*", "Percent Charge*"),
              "percent_charge",
              "%"
            )}
          </Stack>
        </Stack>
      </Stack>

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {useLang(
                "Loan Application Form Fields",
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
                                <InputLabel>Label</InputLabel>
                                <Box component="span">{item.label}</Box>
                              </Stack>
                              <Stack flex={1}>
                                <InputLabel>Type</InputLabel>
                                <Box component="span">{item.type}</Box>
                              </Stack>
                              <Stack flex={1}>
                                <InputLabel>Width</InputLabel>
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
        Submit
      </Button>
    </Stack>
  );
}

export default FormPlans;
