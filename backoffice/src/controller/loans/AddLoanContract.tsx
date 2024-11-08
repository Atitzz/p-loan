import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const digitOnly = /^[0-9]*$/;
function AddLoanContract() {
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toDate, toTHB, toFloat } = useContext(ToolsContext);
  const [data, setData] = useState({ plan_id: -1,guarantee_id:-1 });
  const [erros, setErrors] = useState([]);
  const [loanPlans, setLoanPlans] = useState([]);
  const [guarantees, setGuarantees] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState({});


  const renameType = (type) => {
    switch (type) {
      case 'flatrate':
        return 'ดอกเบี้ยคงที่';
      case 'effectiverate':
        return 'ดอกเบี้ยลดต้นลดดอก';
      default:
        return type; 
    }
  };


  useEffect(() => {
    Get(`plan/loan/all?search=&page=1&limit=1000`)
      .then((response) => {
        setLoanPlans(
          response.data.data.map((params) => {
            return {
              value: params.id,
              label: params.name,
              type_interest: renameType(params.type_interest)
            };
          })
        );
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));

      Get(`guarantee?search=&page=1&limit=1000`)
      .then((response) => {
        setGuarantees(
          response.data.data.map((guarantee) => {
            return {
              value: guarantee.id,
              name: guarantee.name,
              type: guarantee.type,
            };
          })
        );
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, []);
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name == "amount") {
      if (digitOnly.test(value))
        setData((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
    } else
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const inputRender = (label, field, type = "text", options = []) => {
    const __error = erros.find((x) => x.field == field) || false;

    switch (String(type).toLowerCase()) {
      case "select":
        if (field === "plan_id") {
          return (
            <Box sx={{ flex: 1 }}>
              <InputLabel>{label}</InputLabel>
              <TextField
                error={__error}
                select
                fullWidth
                size="small"
                value={data[field]}
                name={field}
                onChange={onChange}
              >
                {options.map((ops, index) => (
                  <MenuItem key={index} value={ops?.value}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <span>{ops?.label}</span>
                      {ops?.type_interest && (
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: 'grey', 
                            fontWeight: 'bold',
                            ml: 2,
                            minWidth: '80px',
                            textAlign: 'right'
                          }}
                        >
                          {ops.type_interest}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              {__error && (
                <FormHelperText sx={{ color: "#eb2222" }}>
                  {__error.message}
                </FormHelperText>
              )}
            </Box>
          );
        }
        else if (field === "guarantee_id") {
          if (plan && plan.is_guarantee === "is_guarantee") {
            return (
              <Box sx={{ flex: 1 }}>
                <InputLabel>{label}</InputLabel>
                <TextField
                  error={__error}
                  select
                  fullWidth
                  size="small"
                  value={data[field]}
                  name={field}
                  onChange={onChange}
                >
                  <MenuItem value={null}>ไม่ระบุ</MenuItem>
                  {options.map((ops, index) => (
                    <MenuItem key={index} value={ops.value}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <span>{ops.name}</span>
                        <Typography
                          variant="body2"
                          sx={{ color: 'grey', fontWeight: 'bold' }}
                        >
                          {ops.type}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
                {__error && (
                  <FormHelperText sx={{ color: "#eb2222" }}>
                    {__error.message}
                  </FormHelperText>
                )}
              </Box>
            );
          }
        } else {
        return (
          <Box sx={{ flex: 1 }}>
            <InputLabel>{label}</InputLabel>
            <TextField
              error={__error}
              select
              fullWidth
              size="small"
              value={data[field]}
              name={field}
              onChange={onChange}
            >
              {options.map((ops, index) => (
                <MenuItem key={index} value={ops?.value}>
                  {ops?.label}
                </MenuItem>
              ))}
            </TextField>
            {__error && (
              <FormHelperText sx={{ color: "#eb2222" }}>
                {__error.message}
              </FormHelperText>
            )}
          </Box>
        );
      }
      break;
      default:
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
            />
            {__error && (
              <FormHelperText sx={{ color: "#eb2222" }}>
                {__error.message}
              </FormHelperText>
            )}
          </Box>
        );
    }
  };

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [mainUser, setMainUser] = useState<any>();

  const onChangeLoanInput = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      if (value === '') {
        setInputLoan((prev) => ({
          ...prev,
          [name]: value,
        }));
        setErrors((prevErrors) => {
          return [...prevErrors, { field: name, message: "" }];
        });
      } else if (digitOnly.test(value)) {
        setInputLoan((prev) => ({
          ...prev,
          [name]: value,
        }));
        setErrors((prevErrors) => prevErrors.filter(err => err.field !== name));
      } 
    } else {
      setInputLoan((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // setInputLoan((prev) => {
    //   return {
    //     ...prev,
    //     [name]: value,
    //   };
    // });
  };

  useEffect(() => {
    setInputLoan((prev) => {
      return {
        ...prev,
        user_id: mainUser?.id || -1,
      };
    });
  }, [mainUser]);

  useEffect(() => {
    Get(`customer/users/all?search=${search}&page=1&limit=10`).then(
      (response) => {
        setCustomers(response.data.data);
      }
    );
  }, [search]);

  const [plan, setPlan] = useState<any>();
  const [inputLoan, setInputLoan] = useState<any>({
    user_id: -1,
    plan_id: -1,
    amount: 0,
    installment: 12,
    interest_rate: 0,
    pay_per_month: 0,
    total_receive:0,
    total_interest:0
  });
  const [appForm, setAppForm] = useState([]);
  useEffect(() => {
    Get(`plan/loan/edit/${data.plan_id}`).then((resoinse) => {
      setAppForm(resoinse.data.data.applicationForm);
      setPlan(resoinse.data.data.loanPlan);
      setInputLoan((prev) => {
        return {
          ...prev,
          plan_id: data.plan_id,
        };
      });
    });
  }, [data.plan_id]);

  useEffect(() => {
    if (!plan) return;
    const __founded = plan.rate.find(
      (rate) => rate.installment == inputLoan.installment
    );
    if (__founded)
      setInputLoan((prev) => {
        return {
          ...prev,
          interest_rate: __founded.interest_rate,
        };
      });
  }, [inputLoan.installment]);

  // const [startDate, setStartDate] = useState<any>(dayjs(Date.now()));
  const [startDate, setStartDate] = useState<any>(null);
  const [createDate, setCreateDate] = useState<any>(dayjs(Date.now()));
  const [installmentDetails, setInstallmentDetails] = useState([]);

  const calculateDefaultStartDate = (createDate) => {
    return dayjs(createDate).add(1, 'month').set('date', 5);
  };

  useEffect(() => {
    setStartDate(calculateDefaultStartDate(createDate));
  }, [createDate]);

  const onCalcurate = () => {
    const type_interest = plan?.type_interest || 'effectiverate';
  
    Post(`loan/calcurate`, {
      ...inputLoan,
      rate: Number(inputLoan.interest_rate) + Number(plan?.application_percent_charge || 0),
      start: startDate,
      created: createDate,
      type_interest, // ส่งประเภทดอกเบี้ยไปกับข้อมูล
    })
      .then((response) => {
        setInstallmentDetails(response.data.data.installment);
        setInputLoan((prev) => ({
          ...prev,
          pay_per_month: response.data.data.pay_per_month,
          total_receive: response.data.data.total_receive,
          total_interest: response.data.data.total_interest,
        }));
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        // if (error?.response?.data) setErrors(error.response.data.data);
      });
  };

  const [appInput, setAppInput] = useState<any>({});
  const onChangeApp = (e) => {
    setAppInput({ ...appInput, [e.target.name]: e.target.value });
  };
  // const formRender = (prop, index) => {
  //   switch (String(prop.type).toLowerCase()) {
  //     case "select":
  //       return (
  //         <Stack key={index}>
  //           <Typography variant="body1">
  //             {prop.label}
  //             {prop.is_required == "required" && (
  //               <span style={{ color: "red" }}>*</span>
  //             )}
  //           </Typography>
  //           <TextField
  //             select
  //             id="outlined-select"
  //             variant="outlined"
  //             type="text"
  //             className="input-custom-2"
  //             size="small"
  //             name={prop.field_name}
  //             value={appInput[prop.field_name]}
  //             onChange={onChangeApp}
  //             sx={{ width: `${prop.width}%` }}
  //           >
  //             {prop.options.map((value, index) => (
  //               <MenuItem key={index} value={value}>
  //                 {value}
  //               </MenuItem>
  //             ))}
  //           </TextField>
  //         </Stack>
  //       );

  //       // ---------------------------------- ปิงเพิ่ม ---------------------------------- //
  //       case "file":
  //         return (
  //           <Stack key={index}>
  //             <Typography variant="body1">
  //               {prop.label}
  //               {prop.is_required == "required" && (
  //                 <span style={{ color: "red" }}>*</span>
  //               )}
  //             </Typography>
  //             <input
  //               id={`file-upload-${index}`}
  //               type="file"
  //               style={{ display: "none" }} 
  //               onChange={(e) => {
  //                 const file = e.target.files[0];
  //                 if (file) {
  //                   const reader = new FileReader();
  //                   reader.onloadend = () => {
  //                     setAppInput((prev) => ({
  //                       ...prev,
  //                       [prop.field_name]: reader.result,
  //                     }));
  //                   };
  //                   reader.readAsDataURL(file);
  //                   setSelectedFileName((prev) => ({
  //                     ...prev,
  //                     [prop.field_name]: file.name,
  //                   }));
  //                 }
  //               }}
  //             />
  //             <Button
  //               variant="contained"
  //               component="span"
  //               onClick={() => document.getElementById(`file-upload-${index}`).click()}
  //               sx={{
  //                 backgroundColor: 'white',  
  //                 color: "#071251",
  //                 border: "2px solid #071251", 
  //                 "&:hover": {
  //                   backgroundColor: "#071251",  
  //                   color: "white",    
  //                 },
  //                 boxShadow: "none",
  //                 maxWidth: '40%',
  //               }}
  //             >
  //               เลือกไฟล์
  //             </Button>
  //             {selectedFileName[prop.field_name] && (
  //               <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
  //                 ไฟล์ที่เลือก: {selectedFileName[prop.field_name]}
  //               </Typography>
  //             )}
  //           </Stack>
  //         );
  //         // ---------------------------------- end ---------------------------------- //

  //     default:
  //       return (
  //         <Stack key={index}>
  //           <Typography variant="body1">
  //             {prop.label}
  //             {prop.is_required == "required" && (
  //               <span style={{ color: "red" }}>*</span>
  //             )}
  //           </Typography>
  //           <TextField
  //             id="outlined-text"
  //             variant="outlined"
  //             type="text"
  //             className="input-custom-2"
  //             size="small"
  //             name={prop.field_name}
  //             value={appInput[prop.field_name]}
  //             onChange={onChangeApp}
  //             sx={{ width: `${prop.width}%` }}
  //           />
  //         </Stack>
  //       );
  //   }
  // };
  const formRender = (prop, index) => {
    const renderField = () => {
      switch (String(prop.type).toLowerCase()) {
        case "select":
          return (
            <TextField
              select
              fullWidth
              variant="outlined"
              size="small"
              name={prop.field_name}
              value={appInput[prop.field_name]}
              onChange={onChangeApp}
            >
              {prop.options.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          );
  
        case "file":
          return (
            <>
              <input
                id={`file-upload-${index}`}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setAppInput((prev) => ({
                        ...prev,
                        [prop.field_name]: reader.result,
                      }));
                    };
                    reader.readAsDataURL(file);
                    setSelectedFileName((prev) => ({
                      ...prev,
                      [prop.field_name]: file.name,
                    }));
                  }
                }}
              />
              <Button
                variant="contained"
                component="span"
                onClick={() => document.getElementById(`file-upload-${index}`).click()}
                sx={{
                  backgroundColor: 'white',
                  color: "#071251",
                  border: "2px solid #071251",
                  "&:hover": {
                    backgroundColor: "#071251",
                    color: "white",
                  },
                  boxShadow: "none",
                  width: '100%',
                }}
              >
                เลือกไฟล์
              </Button>
              {selectedFileName[prop.field_name] && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  ไฟล์ที่เลือก: {selectedFileName[prop.field_name]}
                </Typography>
              )}
            </>
          );
  
        default:
          return (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              name={prop.field_name}
              value={appInput[prop.field_name]}
              onChange={onChangeApp}
            />
          );
      }
    };
  
    return (
      <Box sx={{ width: '49%', padding: 1 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {prop.label}
          {prop.is_required == "required" && (
            <span style={{ color: "red" }}>*</span>
          )}
        </Typography>
        {renderField()}
      </Box>
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { user_id, plan_id, amount ,installment} = inputLoan;
    const send = {
      user_id:Number(user_id),
      plan_id:Number(plan_id),
      installment:isNaN(installment) ? 0 : Number(installment),
      amount:isNaN(amount) ? 0 : Number(amount),
      startDate,
      createDate,
      appForm: appInput,
      guarantee: guarantees.find(g => g.value === data.guarantee_id)?.name
    };
    Post(`loan/register`, send)
      .then((response) => {
        AddAlert(MessageResponse(response), "info");
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        if (error?.response?.data) setErrors(error.response.data.data);
        setIsSubmitting(false);
      });
  };
  return (
    <Stack gap={2}>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Stack sx={{ gap: 2, p: 4 }}>
          <TextField
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            placeholder="ค้นหารายชื่อ..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <TableContainer>
            <Table
              sx={{
                minWidth: 300,
                "& .MuiTableCell-root": {
                  border: "1px solid rgba(224, 224, 224, 1)",
                  fontSize: 12,
                  lineHeight: 1.5,
                },
              }}
              size="medium"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={40}>
                    <strong>#</strong>
                  </TableCell>

                  <TableCell width={250}>
                    <strong>ชื่อ - สกุล</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers
                  .filter((x) => x.firstname !== null)
                  .map((value, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        cursor: "pointer",
                        " :hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                      onClick={() => {
                        setMainUser(value);
                        setOpen(false);
                      }}
                    >
                      <TableCell align="center">{value.id}</TableCell>
                      <TableCell>
                        {value?.firstname || ""} - {value?.lastname || ""}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Dialog>
      <Stack component={Paper} gap={4} sx={{ p: 4 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {useLang("เพิ่มสัญญาเงินกู้", "Add Loan Contract")}
          </Box>
        </Stack>
        <Divider />
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 4 }}>
          <Stack gap={2} sx={{ flex: 1 }}>
            <Box>
              <InputLabel>เลขที่อ้างอิง</InputLabel>
              <TextField fullWidth size="small" disabled />
            </Box>
            {inputRender(
              useLang("แผนสินเชื่อ", "Loan Plans"),
              "plan_id",
              "select",
              loanPlans
            )}
          </Stack>
          <Stack gap={2}>
            <Box>
              <InputLabel>เลขที่สัญญา</InputLabel>
              <TextField fullWidth size="small" disabled />
            </Box>
            <Box>
              <InputLabel>วันที่ทำสัญญา</InputLabel>
              <DatePicker
                format="DD/MM/YYYY"
                slotProps={{ textField: { size: "small", fullWidth: true } }}
                value={createDate}
                onChange={(newValue) => setCreateDate(newValue)}
              />
            </Box>
          </Stack>
        </Stack>

        <Box>
          <InputLabel>ผู้กู้หลัก</InputLabel>
          <TextField
            fullWidth
            size="small"
            value={
              mainUser ? `${mainUser.firstname} - ${mainUser.lastname}` : ""
            }
            onClick={() => setOpen(true)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <InputLabel>ที่อยู่</InputLabel>
          <TextField
            fullWidth
            size="small"
            value={
              mainUser
                ? `${mainUser?.houseno} ${mainUser?.villageno} ${mainUser?.lane} ${mainUser?.subdistrict} ${mainUser?.district} ${mainUser?.province} ${mainUser?.zipcode}`
                : ""
            }
            onClick={() => setOpen(true)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {plan && plan.is_guarantee === "is_guarantee" && (
          <Stack gap={2}>
            {inputRender(
              useLang("หลักประกัน/ทรัพย์สินที่ใช้เป็นประกัน", "Guarantee/Property Insurance"),
              "guarantee_id",
              "select",
              guarantees
            )}
          </Stack>
        )}

        <Divider />
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {useLang("คำนวน", "Calurate")}
          </Box>
        </Stack>
        <Divider />
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 4 }}>
          <Stack sx={{ flex: 1 }}>
            <Stack direction="row" gap={4}>
              <Box sx={{ flex: 1 }}>
                <InputLabel>ยอดเงินกู้</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  onChange={onChangeLoanInput}
                  name="amount"
                  value={inputLoan.amount}
                  error={!!erros.find(err => err.field === 'amount')}
                  helperText={erros.find(err => err.field === 'amount')?.message}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputLabel>อัตราดอกเบี้ย</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={inputLoan.interest_rate}
                />
              </Box>
            </Stack>
            <Stack direction="row" gap={4}>
              <Box sx={{ flex: 1 }}>
                <InputLabel>จำนวนเดือน</InputLabel>
                <TextField
                  select
                  size="small"
                  fullWidth
                  name="installment"
                  onChange={onChangeLoanInput}
                >
                  {plan &&
                    plan.rate.map((rate) => (
                      <MenuItem value={rate.installment}>
                        {rate.installment}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputLabel>เริ่มชำระงวดแรกวันที่</InputLabel>
                <DatePicker
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  // minDate={calculateDefaultStartDate(createDate)}
                  // minDate={dayjs(createDate).add(1, 'month').startOf('month')}
                  minDate={createDate}
                />
              </Box>
            </Stack>
            <Box sx={{ mt: 3 }}>
              <Button fullWidth variant="contained" onClick={onCalcurate}>
                คำนวนสินเชื่อ
              </Button>
            </Box>
            <Box sx={{ my: 2 }}>
              <Divider />
            </Box>
            <Stack direction="row" gap={4}>
              <Box sx={{ flex: 1 }}>
                <InputLabel>ชำระเดือนละ</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={toFloat(inputLoan.pay_per_month)}
                />
              </Box>
              <Box sx={{ flex: 1, width: "100%" }}></Box>
            </Stack>

            <Stack direction="row" gap={4}>
              <Box sx={{ flex: 1 }}>
                <InputLabel>รวมต้องชำระ</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={toFloat(inputLoan.total_receive)}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputLabel>รวมดอกเบี้ย</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={toFloat(inputLoan.total_interest)}
                />
              </Box>
            </Stack>

            <Stack direction="row" gap={4}>
              <Box sx={{ flex: 1 }}>
                <InputLabel>ค่าปรับผิดนัด</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={toFloat(plan?.fixd_charge)}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputLabel>ค่าธรรมเนียมอื่นๆ</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={toFloat(plan?.application_percent_charge)}
                />
              </Box>
            </Stack>

            <Stack direction="row" gap={4}>
              <Box sx={{ flex: 1 }}>
                <InputLabel>ค่าทวงหนี้ (บุคคล ฯ)</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={toFloat(plan?.fixd_charge)}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <InputLabel>ค่าทวงหนี้ (บริษัท ฯ)</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={toFloat(plan?.fixd_charge)}
                />
              </Box>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1 }}>
            <TableContainer sx={{ height: 340 }}>
              <Table
                sx={{
                  minWidth: 300,
                  "& .MuiTableCell-root": {
                    border: "1px solid rgba(224, 224, 224, 1)",
                    fontSize: 12,
                    lineHeight: 1.5,
                  },
                }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" width={40}>
                      <strong>งวดที่</strong>
                    </TableCell>
                    <TableCell>
                      <strong>วันที่ต้องชำระ</strong>
                    </TableCell>
                    <TableCell>
                      <strong>จำนวนชำระ</strong>
                    </TableCell>
                    <TableCell>
                      <strong>จำนวนวัน</strong>
                    </TableCell>
                    <TableCell>
                      <strong>เงินต้น</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ดอกเบี้ย</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ชำระรวม</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {installmentDetails.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell>{toDate(value.date, 1)}</TableCell>
                      <TableCell align="center">
                        {toFloat(value.amount)}
                      </TableCell>
                      <TableCell align="center">{value.days}</TableCell>
                      <TableCell align="center">
                        {toFloat(value.principle)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.interest)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.receive)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {useLang("ข้อมูลเพิ่มเติม", "More")}
          </Box>
        </Stack>
        <Divider />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {appForm.map((form, index) => formRender(form, index))}
        </Box>
        <Divider />
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "กำลังดำเนินการ..." : "เพิ่มสัญญาใหม่"}
        </Button>
      </Stack>
    </Stack>
  );
}

export default AddLoanContract;
