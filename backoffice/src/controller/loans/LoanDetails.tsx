import ConfirmDialog from "@/component/ConfirmDialog";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Box, Button, Dialog, DialogContent, DialogActions, Divider, Paper, Stack, TextField, Typography, DialogTitle, IconButton, MenuItem } from "@mui/material";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import Contract from "../loan_contract/Contract";

function LoanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toDate, toTHB } = useContext(ToolsContext);
  const [data, setData] = useState<any>();
  const [appForm, setAppForm] = useState({});
  const [appField, setAppField] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [guarantees, setGuarantees] = useState([]);
  const [selectedGuarantee, setSelectedGuarantee] = useState('');
  const [loanPlan, setLoanPlan] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedImages, setUpdatedImages] = useState({});
  const [tempGuarantee, setTempGuarantee] = useState('');
  const [tempUpdatedImages, setTempUpdatedImages] = useState({});
  const [showContract, setShowContract] = useState(false);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    Get(`loan/detail/${id}`)
      .then((response) => {
        const { application_form, ...obj } = response.data.data;
        setData(obj);
        setAppForm(application_form);
        setSelectedGuarantee(obj.guarantee);
        Get(`plan/loan/edit/${obj.plan_id}`).then((response) => {
          const { applicationForm, loanPlan, ...obj } = response.data.data;
          setAppField(applicationForm);
          setLoanPlan(loanPlan);
        });
      })
      .catch((error) => {
        navigate("/404");
      });

    Get(`guarantee?search=&page=1&limit=1000`)
      .then((response) => {
        setGuarantees(
          response.data.data.map((guarantee) => ({
            value: guarantee.id,
            name: guarantee.name,
            type: guarantee.type,
          }))
        );
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [id]);


  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUpdatedImages(prev => ({
          ...prev,
          [fieldName]: {
            base64: reader.result,
            name: file.name
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setOpenImage(true);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // ถ้าอยู่ในโหมดแก้ไข ให้ย้อนกลับข้อมูลเดิม
      setSelectedGuarantee(tempGuarantee);
      setUpdatedImages(tempUpdatedImages);
    } else {
      // ถ้าเริ่มเข้าสู่โหมดแก้ไข ให้เก็บข้อมูลเดิม
      setTempGuarantee(selectedGuarantee);
      setTempUpdatedImages(updatedImages);
    }
    setIsEditing(!isEditing); // สลับโหมดแก้ไข/ดูข้อมูล
  };

  const onSaveChanges = () => {
    const payload = {
      guarantee: selectedGuarantee,
      appForm: {},
    };

    Object.keys(updatedImages).forEach(fieldName => {
      if (updatedImages[fieldName]?.base64) {
        payload.appForm[fieldName] = updatedImages[fieldName];
      }
    });

    Put(`loan/detail/${id}`, payload)
      .then((response) => {
        setData(response.data.data);

        const newAppForm = { ...appForm };
        response.data.data.fileManagers.forEach(file => {
          newAppForm[file.name] = { ...newAppForm[file.name], base64: file.base64 };
        });
        setAppForm(newAppForm);
        setUpdatedImages({});

        AddAlert(useLang("บันทึกการเปลี่ยนแปลงสำเร็จ", "Changes saved successfully"), "success");
        setIsEditing(false);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  const [isApproving, setIsApproving] = useState(false); 
  const onApprove = () => {
    if (isApproving) return;

    setIsApproving(true);
    Post(`loan/approve/${data?.reference}`, { guarantee: selectedGuarantee })
      .then((response) => {
        setData(response.data.data);
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        setIsApproving(false);
      });
  };

  const [reject_reason, setRejectReason] = useState("");
  const [dialog, setDialog] = useState(false);
  const handleDialogOpen = () => {
    setDialog(true);
  };

  const [isRejecting, setIsRejecting] = useState(false);
  const onReject = () => {
    if (isRejecting) return;

    setIsRejecting(true);
    Post(`loan/reject/${data?.reference}`, { reject_reason })
      .then((response) => {
        setData(response.data.data);
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        setIsRejecting(false);
      });
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const onDelete = () => {
    setOpenDel(true);
  };

  const [openClose, setOpenClose] = useState(false);
  const onCloseLoan = () => {
    setOpenClose(true);
  };

  const delSubmit = () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    Post(`loan/remove/${data?.reference}`, {})
      .then((response) => {
        setData(response.data.data);
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        setIsDeleting(false);
      });
  };

  const closeSubmit = () => {
    Post(`loan/bad/${id}`, {})
      .then((response) => {
        setData(response.data.data);
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  const handleToggleContract = () => {
    setShowContract(!showContract);
  };

  const handleToggleContractDialog = () => {
    setShowContractDialog(!showContractDialog);
    setShowContract(false); // ปิดการแสดงผล Contract ที่ไม่จำเป็น
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  return (
    <Stack spacing={2}>

      {/* --------------------- ปิงเพิ่ม --------------------- */}
      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        fullWidth
        maxWidth="md"
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
      {/* --------------------- end --------------------- */}

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
              disabled={isRejecting}
            />
          </Stack>
          <Stack sx={{ my: 4, gap: 2 }}>
            <Button onClick={onReject} variant="contained" color="error" disabled={isRejecting}>
            {isRejecting ? useLang("กำลังปฏิเสธ...", "Rejecting...") : useLang("ปฏิเสธ", "Reject")}
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
      <ConfirmDialog
        open={openDel}
        onClose={() => setOpenDel(false)}
        onSubmit={delSubmit}
        text={'กรุณากดยืนยันหากคุณต้องการจะลบสัญญานี้'}
      />

      <ConfirmDialog
        open={openClose}
        onClose={() => setOpenClose(false)}
        onSubmit={closeSubmit}
        text={'กรุณากดยืนยันหากคุณต้องการจะตัดหนี้สูญสัญญานี้'}
      />

      {data && (
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
                  {useLang("แผน", "Plan")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {data["planname"]}
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
                  {useLang("วันที่ออกเอกสาร", "Date of Application")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {toDate(data["created_at"])}
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
                  {useLang("เลขที่สินเชื่อ", "Loan Number")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {data["loan_number"]}
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
                  {useLang("เลขที่อ้างอิง", "Ref Number")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {data["reference"]}
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
                  {useLang("เอกสารฉบับที่", "Loan Document")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {`${data["loan_ducument"]}/${data["loan_ducument_max"]}`}
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
                  {useLang("มูลค่า", "Amount")}
                </Box>
                <Box component="span" sx={{ color: "#ff9f63" }}>
                  {toTHB(data["amount"])}
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
                  {useLang("ค่างวด", "Per Installment")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {toTHB(data["per_installment"])}
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
                  {useLang("การผ่อนชำระทั้งหมด", "Total Installment")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {data["total_installment"]}
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
                  {useLang("ผ่อนชำระ", "Given Installment")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {data["given_installment"]}
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
                  {useLang("ผ่อนชำระแล้วทั้งหมด", "Total Payable")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {toTHB(data["total_paid"])}
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
                  {useLang("ดอกเบี้ย", "Interest")}
                </Box>
                <Box component="span" sx={{ color: "#28c76f" }}>
                  {toTHB(data["profit"])}
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
                  {useLang("สถานะ", "Status")}
                </Box>
                <Box component="span" sx={{ color: "#5b6e88" }}>
                  {data["status"]}
                </Box>
              </Stack>
              <Divider />
              <Stack direction="row" sx={{ gap: 4, justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleToggleContractDialog}
                >
                  {useLang("ดูเอกสารสัญญา", "View Contract")}
                </Button>
                {/* <Dialog
                  open={showContractDialog}
                  onClose={handleToggleContractDialog}
                  maxWidth="md"
                  fullWidth
                  PaperProps={{
                    style: {
                      width: '210mm',
                      minHeight: '297mm',
                      maxHeight: '80vh',
                    },
                  }}
                >
                  <DialogTitle>
                    {useLang("สัญญากู้ยืมเงิน", "Loan Contract")}
                    <Button
                      onClick={handlePrint}
                      startIcon={<Icons.Print />}
                      sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                      {useLang("พิมพ์เอกสาร", "Print Document")}
                    </Button>
                  </DialogTitle>
                  <DialogContent>
                    <Box
                      ref={printRef}
                      sx={{
                        bgcolor: "#fff",
                        width: "100%",
                        height: "100%",
                        color: "#000",
                        margin: "auto",
                        textAlign: "start",
                        overflow: "auto",
                      }}
                    >
                      <Contract loanData={data} />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleToggleContractDialog}>
                      {useLang("ปิด", "Close")}
                    </Button>
                  </DialogActions>
                </Dialog> */}
                <Button
                  variant="contained"
                  color="warning"
                  onClick={onCloseLoan}
                >
                  ตัดหนี้สูญ
                </Button>
                <Button variant="contained" color="error" onClick={onDelete} disabled={isDeleting}>
                  ลบสิญเชื่อ
                </Button>
              </Stack>

            </Stack>
          </Stack>
          <Stack component={Paper} sx={{ flex: 5 }}>
            <Stack spacing={1} sx={{ p: 2 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center", p: 2 }}
              >
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: "#5b6e88", alignContent: "center" }}
                >
                  {useLang(
                    "ขอมูลประกอบสินเชื่อ โดย ผู้ใช้งาน",
                    "Loan Form Submitted by User"
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  {isEditing && (
                    <Button
                      variant="contained"
                      onClick={onSaveChanges}
                      sx={{
                        color: "white",
                        backgroundColor: "primary.main",
                        '&:hover': {
                          backgroundColor: "primary.dark",
                        }
                      }}
                    >
                      {useLang("บันทึกการเปลี่ยนแปลง", "Save Changes")}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleToggleEdit}
                    sx={{
                      color: "white",
                      backgroundColor: isEditing ? "error.main" : "primary.main",
                      '&:hover': {
                        backgroundColor: isEditing ? "error.dark" : "primary.dark",
                      }
                    }}
                  >
                    {isEditing ? useLang("ยกเลิกการแก้ไข", "Cancel") : useLang("แก้ไข", "Edit")}
                  </Button>
                </Box>
              </Stack>
              <Divider />

              {/* ---------------- ปิงเพิ่ม ----------------  */}
              {isEditing ? (
                <Stack spacing={3} sx={{ p: 2 }}>
                  {/* เลือกหลักประกันใหม่ */}
                  {isEditing && loanPlan && loanPlan.is_guarantee === "is_guarantee" && (
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={selectedGuarantee}
                      onChange={e => setSelectedGuarantee(e.target.value)}
                      label={useLang("หลักประกัน/ทรัพย์สินที่ใช้เป็นประกัน", "Guarantee/Property Insurance")}
                      InputLabelProps={{
                        sx: {
                          color: 'grey',
                          fontSize: '13.5px',
                          fontWeight: 'bold',
                        }
                      }}
                    >
                      <MenuItem value={null}>ไม่ระบุ</MenuItem>
                      {guarantees.map((guarantee, index) => (
                        <MenuItem key={index} value={guarantee.name}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>{guarantee.name}</span>
                            <Typography variant="body2" sx={{ color: 'grey', fontWeight: 'bold' }}>
                              {guarantee.type}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}


                  {/* แสดงประเภทของหลักประกันที่เลือก */}
                  {/* <Typography variant="body2" sx={{ color: 'gray' }}>
                    {guarantees.find(guarantee => guarantee.name === selectedGuarantee)?.type}
                  </Typography> */}

                  {/* อัพโหลดรูปภาพใหม่สำหรับแต่ละฟิลด์ */}
                  {appField.map((app, index) => (
                    appForm[app.field_name]?.base64 && app.type.toLowerCase() === "file" && (
                      <Stack key={index} spacing={1} position="relative">
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'gray' }}>{app.label}</Typography>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileChange(e, app.field_name)}
                          style={{ display: 'none' }}
                          id={`file-input-${index}`}
                        />
                        <Box
                          onClick={() => document.getElementById(`file-input-${index}`).click()}
                          sx={{
                            width: "100%",
                            maxWidth: '400',
                            height: '200px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            position: 'relative',
                            borderRadius: '12px',
                            border: '2px solid #d1d1d1',
                            transition: 'border 0.3s ease',
                            '&:hover': {
                              border: '2px solid #0288d1',
                            },
                            '&:hover::before': {
                              content: '"เปลี่ยนเอกสาร"',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              padding: '10px 15px',
                              borderRadius: '8px',
                              fontSize: '14px',
                            },
                          }}
                        >
                          <img
                            src={updatedImages[app.field_name]?.base64 || appForm[app.field_name].base64 || ""}
                            alt={app.label}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </Box>
                        < Divider />
                      </Stack>
                    )
                  ))}

                  {/* <Button
                    variant="contained"
                    // color="success"
                    onClick={onSaveChanges}
                  // sx={{
                  //   mt: 3,
                  //   alignSelf: 'center', 
                  //   padding: '10px 20px', 
                  //   fontSize: '16px', 
                  //   borderRadius: '8px',
                  //   boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  //   transition: 'all 0.3s ease',
                  //   '&:hover': {
                  //     backgroundColor: '#45a049',
                  //     boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.2)',
                  //   }
                  // }}
                  >
                    {useLang("บันทึกการเปลี่ยนแปลง", "Save Changes")}
                  </Button> */}
                </Stack>
              ) : (
                <Stack spacing={3} sx={{ p: 2 }}>
                  <Box>
                    {/* แสดงหลักประกันปัจจุบัน */}
                    <Typography variant="body2" sx={{ color: 'gray', marginTop: '5px', marginBottom: '10px', fontWeight: 'bold' }}>
                      {guarantees.find(guarantee => guarantee.name === selectedGuarantee)?.type}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: '15px' }}>{selectedGuarantee}</Typography>
                    < Divider />

                    {/* แสดงรูปภาพปัจจุบัน */}
                    {appField.map((app, index) => (
                      appForm[app.field_name]?.base64 && app.type.toLowerCase() === "file" && (
                        <Stack key={index} spacing={1} sx={{ marginTop: '15px' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'gray' }}>{app.label}</Typography>
                          <img
                            src={appForm[app.field_name].base64}
                            alt={app.label}
                            style={{
                              width: '100%',
                              maxWidth: '500',
                              height: '200px',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              borderRadius: '12px',
                              border: '2px solid #d1d1d1',
                              marginBottom: '10px'
                            }}
                            onClick={() => handleImageClick(appForm[app.field_name].base64)}
                          />
                          < Divider />
                        </Stack>
                      )
                    ))}
                  </Box>
                </Stack>
              )}

              {/* ---------------- end ----------------  */}

              {!isEditing && String(data["status"]).toLowerCase() === "pending" && (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={onApprove}
                    disabled={isApproving}
                  >
                    {isApproving ? useLang("กำลังอนุมัติ...", "Approving...") : useLang("อนุมัติ", "Approve")}
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleDialogOpen} disabled={isApproving}>
                    {useLang("ปฏิเศษ", "Reject")}
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
      <Dialog
        open={showContractDialog}
        onClose={handleToggleContractDialog}
        fullWidth
        maxWidth="lg" // ขนาดของ Dialog สามารถปรับได้ตามความเหมาะสม
      >
        <DialogContent>
          {showContractDialog && <Contract loanData={data} />}
        </DialogContent>
      </Dialog>
      {/* <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printRef, #printRef * {
              visibility: visible;
            }
            #printRef {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm;
              height: 297mm;
            }
            @page {
              size: A4;
              margin: 0;
            }
            .page-break {
              page-break-after: always;
            }
          }
        `}
      </style> */}
    </Stack>
  );
}

export default LoanDetails;
