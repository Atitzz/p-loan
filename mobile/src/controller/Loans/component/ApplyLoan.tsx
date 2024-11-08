import { HttpContext, MainContext } from "@/context/Context";
import { Box, Button, Divider, MenuItem, Stack, TextField, Typography } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";

function ApplyLoan({ appForm,onAccept,loanData, loanPlans }) {
  const [input, setInput] = useState<any>({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const [guarantees, setGuarantees] = useState([]);
  const [selectedGuarantee, setSelectedGuarantee] = useState("");
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
  useContext(HttpContext);
  const { useLang, AddAlert } = useContext(MainContext);

  const onChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const onClick = async () => {
    loanData(prev=>{
        return {...prev, appForm: input, guarantee: selectedGuarantee || null };
      });
      onAccept(true);
  };

  const handleGuaranteeChange = (event) => {
    setSelectedGuarantee(event.target.value);
  };

  useEffect(() => {
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
  }, []);

  const formRender = (prop,index) => {
    switch (String(prop.type).toLowerCase()) {
      case "select":
        return (
          <Stack key={index}>
            <Typography variant="body1">
              {prop.label}
              {prop.is_required == 'required' && <span style={{ color: "red" }}>*</span> }
            </Typography>
            <TextField
              select
              id="outlined-select"
              variant="outlined"
              type="text"
              className="input-custom-2"
              size="small"
              name={prop.field_name}
              value={input[prop.field_name]}
              onChange={onChange}
              sx={{ width: `${prop.width}%` }}
            >
              {prop.options.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );

        // ---------------------------------- ปิงเพิ่ม ---------------------------------- //
        case "file":
          return (
            <Stack key={index}>
              <Typography variant="body1">
                {prop.label}
                {prop.is_required == "required" && <span style={{ color: "red" }}>*</span>}
              </Typography>
              <input
                id={`file-upload-${index}`}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setInput((prev) => ({
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
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid var(--color1)",
                  '&:hover': {
                    backgroundColor: "var(--color1)",
                    color: "white",
                  },
                  boxShadow: "none", 
                  marginTop: "10px"
                }}
              >
                เลือกไฟล์
              </Button>
              {selectedFileName[prop.field_name] && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  ไฟล์ที่เลือก: {selectedFileName[prop.field_name]}
                </Typography>
              )}
            </Stack>
          );
          // ---------------------------------- end ---------------------------------- //

        
      default:
        return (
          <Stack key={index}>
            <Typography variant="body1">
              {prop.label}
              {prop.is_required == 'required' && <span style={{ color: "red" }}>*</span> }
            </Typography>
            <TextField
              id="outlined-text"
              variant="outlined"
              type="text"
              className="input-custom-2"
              size="small"
              name={prop.field_name}
              value={input[prop.field_name]}
              onChange={onChange}
              sx={{width:`${prop.width}%`}}
            />
          </Stack>
        );
    }
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
    >
      <Stack gap={2}>
        <Box sx={{ background: "var(--color1)", py: "25px", px: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
            ข้อมูลเพิ่มเติม
          </Typography>
        </Box>
        
        <Stack gap={2} sx={{p:4}}>
        {loanPlans.is_guarantee === 'is_guarantee' && (
            <>
              <Typography variant="body1">
                {useLang("เลือกหลักประกัน", "Select Guarantee")}
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={selectedGuarantee}
                onChange={handleGuaranteeChange}
              >
                {guarantees.map((guarantee, index) => (
                  <MenuItem key={index} value={guarantee.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{guarantee.name}</span>
                      <Typography variant="body1">
                        {guarantee.type}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

        {appForm.map((form, index) => (
          formRender(form, index)
        ))}

        <Stack sx={{my:2,gap:2}}>
        <Divider/>
        <Button className='btn-1' onClick={onClick}>สมัครสินเชื่อ</Button>
        </Stack>
        
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ApplyLoan;
