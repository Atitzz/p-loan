import {
  Box,
  Button,
  Dialog,
  DialogContentText,
  Divider,
  IconButton,
  InputLabel,
  LinearProgress,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import HelpIcon from "@mui/icons-material/Help";
import { useTheme } from "@emotion/react";
import * as xlsx from "xlsx";
import { ErrorResponse, parseExcelToObject } from "@/utils";
import { icon } from "@/_layout/json/icon";
import { MainContext } from "@/context/Context";
import { Download_Report } from "./ExportExcel";
function ImportExcel({ open, onClose,onUpload, example }: any) {
  const { AddAlert }: any = useContext(MainContext);
  const theme: any = useTheme();
  const [file, setFile] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [uploaded, setUpload] = useState(false);
  const [progress,setProgress] = useState(0);
  const [error,setError] = useState<any[]>([]);
  const handleOnSubmit = () => {
    const size = data.length;
    const batchSize = 750;
    const numBatches = Math.ceil(size / batchSize);
    setProgress(0);
    setUpload(true);
    (async () => {
      for (let i = 0; i < numBatches; i++) {
        const startIndex = i * batchSize;
        const endIndex = Math.min((i + 1) * batchSize, size);
        const batch = data.slice(startIndex, endIndex);

        // ทำส่งข้อมูล batch นี้ไปยัง function หรือ endpoint ที่ต้องการ
        try{
          const response = await onUpload({ data:batch})
          setError(prev => [...prev,...response.data.data])
        }catch(err:any){
         AddAlert(ErrorResponse(err),'error') 
        }
        const batchProgress = 100 / numBatches; // คำนวณ progress ของแต่ละ batch
        setProgress((prev) => prev + batchProgress); // ตั้งค่า progress ทั้งหมด
      }
    })()
  };

  useEffect(() => {
    if (progress == 100) {
      setUpload(false);
      AddAlert("อัพโหลดสำเร็จ");
      setData([])
      setFile("");
      setProgress(0);
      const fields = Object.keys(example)
      const toArray = error.map(x=>{
        return fields.map(field=>
        {
          return x[field]
        });
      })
      Download_Report(`รายงานข้อผิดพลาด`,fields, toArray);
    }
  }, [progress]);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setFile(file.name);
      const jsonfile = await parseExcelToObject(file);
      setData(jsonfile);
    } catch (err) {
      console.log(err);
    }
  };

  const download_example = async () => {
    const dataList = [Object.keys(example), Object.values(example)];
    const fileName = `ตัวอย่างการนำเข้าข้อมูล.xlsx`;
    const ws = xlsx.utils.json_to_sheet(dataList);
    const wb = xlsx.utils.book_new();
    const columnWidths = dataList[0].map((value) => ({
      wch: value.toString().length + 20,
    }));
    ws["!cols"] = columnWidths;
    xlsx.utils.sheet_add_aoa(ws, dataList, { origin: "A1" });
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    xlsx.writeFile(wb, fileName);
  };

  const Preview = (e) => {
    return (
      <React.Fragment>
        <InputLabel sx={{ textAlign: "center" }}>{file}</InputLabel>
        <Divider sx={{my:1}} />
        <Stack direction="row" spacing={2}>
          {Object.keys(data[0]).map((value: any, i) => (
            <Box key={`key-${i}`} sx={{ flex: 1 }}>
              {value}
            </Box>
          ))}
        </Stack>

        {e.slice(0, 10).map((data, i) => (
          <Stack key={`data-${i}`} direction="row" spacing={2}>
            {Object.values(data).map((value: string, j) => (
              <Box key={`data-${j}`} sx={{ flex: 1 }}>
                {value}
              </Box>
            ))}
          </Stack>
        ))}
        <hr />
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
        <Box bgcolor={theme.palette.primary.main}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ my: "auto", ml: 2 }}>
              <DialogContentText>อัพโหลดเอกสาร</DialogContentText>
            </Box>
            <Tooltip title="ดาวโหลดตัวอย่างเอกสาร">
              <IconButton onClick={download_example}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", mb: 2 }}>
            <Button fullWidth variant="outlined" component="label">
              {icon["NoteAddIcon"]}
              อัพโหลดเอกสาร
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                hidden
                onChange={handleUpload}
              />
            </Button>
          </Box>
          <Stack spacing={2} direction="row">
            <Button
              variant="outlined"
              fullWidth
              onClick={handleOnSubmit}
              disabled={uploaded}
            >
              อัพโหลด
            </Button>
            <Button
              variant="contained"
              fullWidth
              color="error"
              onClick={onClose}
            >
              ยกเลิก
            </Button>
          </Stack>
          {data.length > 0 && (
            <React.Fragment>
              <Box sx={{ my: 2 }}>
                <LinearProgress variant="buffer" value={0} valueBuffer={0} />
              </Box>
              <Box sx={{ mt: 2 }}>{Preview(data)}</Box>
            </React.Fragment>
          )}
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

export default ImportExcel;
