import { MainContext } from "@/context/Context";
import {
  Badge,
  Box,
  Button,
  Card,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useContext } from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CircleIcon from "@mui/icons-material/Circle";
function Settings() {
  const { AddAlert, logo, setLogo, config, setConfig,setThemePrimary }: any =
    useContext(MainContext);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const img = {
        preview: URL.createObjectURL(file),
        data: file,
        name: file.name,
      };
      setLogo(img);
    } else {
      console.log("ไม่มีไฟล์ถูกเลือก");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setConfig((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <React.Fragment>
      <InputLabel>Default</InputLabel>
      <Stack direction="row" spacing={2}>
        <Card sx={{ flex: 5 }}>
          <Stack direction="row" sx={{ m: 2, textAlign: "start" }} spacing={2}>
            <Box>
              <InputLabel>Banner Logo</InputLabel>
              <Button
                sx={{ width: 230, height: 230 }}
                variant="outlined"
                component="label"
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUpload}
                />
                {logo.preview !== "" ? (
                  <img src={logo.preview} width={210} height={75} />
                ) : (
                  <DriveFolderUploadIcon />
                )}
              </Button>
            </Box>
            <Stack spacing={2} flex={1}>
              <Stack direction="row" spacing={2}>
                <Box component="form" textAlign="start" flex={1}>
                  <InputLabel>Site Name</InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={config?.company || ""}
                    onChange={handleChange}
                    name="company"
                  />
                </Box>
                <Box component="form">
                  <InputLabel>Tel.</InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={config?.phonenumber || ""}
                    onChange={handleChange}
                    name="phonenumber"
                  />
                </Box>
              </Stack>
              <Box sx={{ display: "flex" }}>
                <Box component="form" textAlign="start" flex={1}>
                  <InputLabel>Tax-ID</InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={config?.taxId || ""}
                    onChange={handleChange}
                    name="taxId"
                  />
                </Box>
              </Box>
              <Box component="form">
                <InputLabel>Address</InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                  value={config?.address || ""}
                  onChange={handleChange}
                  name="address"
                />
              </Box>
            </Stack>
          </Stack>
          <Stack sx={{ m: 2 }}>
            <InputLabel>Theme</InputLabel>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary">
                <CircleIcon />
              </IconButton>
              <IconButton sx={{color:"#1976d2"}}  onClick={()=>setThemePrimary("#1976d2")}>
                <CircleIcon />
              </IconButton>
              <IconButton sx={{color:"#9c27b0"}}  onClick={()=>setThemePrimary("#9c27b0")}>
                <CircleIcon />
              </IconButton>
              <IconButton sx={{color:"#0288d1"}}  onClick={()=>setThemePrimary("#0288d1")}>
                <CircleIcon />
              </IconButton>
              <IconButton sx={{color:"#2e7d32"}}  onClick={()=>setThemePrimary("#2e7d32")}>
                <CircleIcon />
              </IconButton>
              <IconButton sx={{color:"#ed6c02"}}  onClick={()=>setThemePrimary("#ed6c02")}>
                <CircleIcon />
              </IconButton>
              <IconButton sx={{color:"#d32f2f"}}  onClick={()=>setThemePrimary("#d32f2f")}>
                <CircleIcon />
              </IconButton>
              <IconButton sx={{color:"#111"}}  onClick={()=>setThemePrimary("#111")}>
                <CircleIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </React.Fragment>
  );
}

export default Settings;
