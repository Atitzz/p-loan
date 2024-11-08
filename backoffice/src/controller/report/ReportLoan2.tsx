import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  Tab,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Print } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import SearchDate from "@/component/SearchDate";
import { CalendarIcon } from "@mui/x-date-pickers";

const startDate = new Date();
const endDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
endDate.setDate(endDate.getDate() + 1);

function ReportLoan2() {
  const { AddAlert, dataRoute, useLang } = useContext(MainContext);
  const { toDate, toFloat } = useContext(ToolsContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const [isLoading, setIsLoading] = useState(false);
  const __location = useLocation();
  const [HeadTitle, setHeadTitle] = useState("Title");

  const [report2Data, setReport2Data] = useState({});
  const [report3Data, setReport3Data] = useState([]);

  const [openSearch, setOpenSearch] = useState(false);
  const [searchDate, setSearchDate] = useState({
    start: startDate.toISOString().split("T")[0],
    end: endDate.toISOString().split("T")[0],
  });

  const onSearch = (search) => {
    setSearchDate(search);
  };

  const toThaiNumber = (number) => {
    if (number === null || number === undefined) return '';
    const thaiNumbers = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
    return number.toString().replace(/\d/g, (digit) => thaiNumbers[digit]);
  };

  const formatNumber = (number) => {
    if (number === null || number === undefined) return '';
    const formattedNumber = toFloat(number);
    return toThaiNumber(formattedNumber);
  };

  useEffect(() => {
    const __route = dataRoute.find((x) => x.link == __location.pathname);
    setHeadTitle(!__route ? "title" : useLang(__route.name_th, __route.name));
    setIsLoading(true);

    Promise.all([
      Get(`report/bank-2?start=${searchDate.start}&end=${searchDate.end}`),
      Get(`report/bank-3?start=${searchDate.start}&end=${searchDate.end}`)
    ])
      .then(([response2, response3]) => {
        setReport2Data(response2.data.data);
        setReport3Data(response3.data.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => {
        setTimeout(() => {
          setIsLoading(false);
          AddAlert(ErrorResponse(err), "error");
        }, 250);
      });
  }, [searchDate]);

  const contentToPrint = useRef(null);
  const pageStyle = `
    @page {
      size: A4 landscape;
      margin: 3mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      th, td {
        border: 1px solid black !important;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    documentTitle: "รายงานการให้สินเชื่อรายย่อย 2-3",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });
  return (
    <Stack gap={2}>
      <SearchDate
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSubmit={onSearch}
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Box component="h3" sx={{ m: 0, textAlign: "center" }}>
          {HeadTitle}
        </Box>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={() => setOpenSearch(true)}
          >
            กำหนดช่วงวัน
          </Button>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={() => handlePrint(null, () => contentToPrint.current)}
          >
            {useLang("พิมพ์", "Print")}
          </Button>
        </Stack>
      </Stack>

      <Stack component={Paper} sx={{ gap: 2, p: 4 }}>
        <Stack ref={contentToPrint}>
          <Stack sx={{ mb: 1 }}>
            <Typography variant="body2">
              ตารางที่ ๓ : ตารางบัญชีสินเชื่อจำแนกตามประเภทของหลักประกันหรือทรัพย์สินที่ใช้เป็นประกัน
            </Typography>
          </Stack>

          <TableContainer sx={{ bgcolor: "#fff", mb: 0 }}>
            <Table
              sx={{
                minWidth: 665,
                "& .MuiTableCell-root": {
                  border: "1px solid rgba(224, 224, 224, 1)",
                  fontSize: 8.5,
                  lineHeight: 1.5,
                  padding: '4px 6px'
                },
              }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" rowSpan={3} sx={{ width: '125px'}}>
                    หลักประกัน/<br />ทรัพย์สินที่ใช้เป็นประกัน
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2} sx={{ width: '180px'}}>
                    ข้อมูลสินเชื่อรวม
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2} sx={{ width: '170px'}}>
                    สินเชื่อใหม่ <sup>๔/</sup>
                  </TableCell>
                  <TableCell align="center" colSpan={8}>
                    ลูกหนี้ผิดชำระหนี้ <sup>๕/</sup>
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    การตัดหนี้สูญ <sup>๘/</sup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    เกิน ๑ เดือน ถึง ๓ เดือน
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    เกิน ๓ เดือน ถึง ๖ เดือน
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    เกิน ๖ เดือน ถึง ๑๒ เดือน
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    เกิน ๑๒ เดือน
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนบัญชี <sup>๒/</sup></div>
                    <div>(บัญชี)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อคงค้าง <sup>๓/</sup></div>
                    <div>(บาท)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนบัญชี</div>
                    <div>(บัญชี)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อใหม่</div>
                    <div>(บาท)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนบัญชี <sup>๖/</sup></div>
                    <div>(บัญชี)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อคงค้าง <sup>๗/</sup></div>
                    <div>(บาท)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนบัญชี <sup>๖/</sup></div>
                    <div>(บัญชี)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อคงค้าง <sup>๗/</sup></div>
                    <div>(บาท)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนบัญชี <sup>๖/</sup></div>
                    <div>(บัญชี)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อคงค้าง <sup>๗/</sup></div>
                    <div>(บาท)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนบัญชี <sup>๖/</sup></div>
                    <div>(บัญชี)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อคงค้าง <sup>๗/</sup></div>
                    <div>(บาท)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนบัญชี <sup>๖/</sup></div>
                    <div>(บัญชี)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อคงค้าง <sup>๗/</sup></div>
                    <div>(บาท)</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(report2Data).map((propertyType, idx) => (
                  <>
                    <TableRow key={`header-${idx}`}>
                      <TableCell align="left" colSpan={15} sx={{ fontWeight: 'bold' }}>
                        {`${toThaiNumber(idx + 1)}. ${propertyType}`}
                      </TableCell>
                    </TableRow>
                    {report2Data[propertyType].map((value, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          {/* <Box sx={{ paddingLeft: '10px' }}> */}
                          <Box sx={{ paddingLeft: '10px', width: '109.5px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            {toThaiNumber(value.set)}
                          </Box>
                        </TableCell>
                        <TableCell align="center">{toThaiNumber(value.loan_running)}</TableCell>
                        <TableCell align="center">{formatNumber(value.running_total_principle)}</TableCell>
                        <TableCell align="center">{toThaiNumber(value.loan_pending)}</TableCell>
                        <TableCell align="center">{formatNumber(value.pending_total_amount)}</TableCell>
                        <TableCell align="center">{toThaiNumber(value.overdue_1_3_months)}</TableCell>
                        <TableCell align="center">{formatNumber(value.overdue_1_3_months_total)}</TableCell>
                        <TableCell align="center">{toThaiNumber(value.overdue_3_6_months)}</TableCell>
                        <TableCell align="center">{formatNumber(value.overdue_3_6_months_total)}</TableCell>
                        <TableCell align="center">{toThaiNumber(value.overdue_6_12_months)}</TableCell>
                        <TableCell align="center">{formatNumber(value.overdue_6_12_months_total)}</TableCell>
                        <TableCell align="center">{toThaiNumber(value.overdue_12_months_plus)}</TableCell>
                        <TableCell align="center">{formatNumber(value.overdue_12_months_plus_total)}</TableCell>
                        <TableCell align="center">{toThaiNumber(value.bad_count)}</TableCell>
                        <TableCell align="center">{formatNumber(value.bad_total)}</TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack sx={{ my: 2 }}>
            <Typography variant="body2">
              ตารางที่ ๔ : ตารางบัญชีลูกหนี้
            </Typography>
          </Stack>

          <TableContainer sx={{ bgcolor: "#fff", width: '100%' }}>
            <Table
              sx={{
                width: 665,
                "& .MuiTableCell-root": {
                  border: "1px solid rgba(224, 224, 224, 1)",
                  fontSize: 8.5,
                  lineHeight: 1.5,
                  padding: '4px 6px'
                },
              }}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" rowSpan={3} sx={{ width: '125px'}}>
                    วงเงินสินเชื่อของลูกหนี้<br /> <br /> (บาท)
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2} sx={{ width: '90px'}}>
                    ข้อมูลสินเชื่ออนุมัติสะสม
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2} sx={{ width: '145px'}}>
                    ข้อมูลสินเชื่อคงค้าง
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2} sx={{ width: '100px'}}>
                    สินเชื่อใหม่ <sup>๑๔/</sup>
                  </TableCell>
                </TableRow>
                <TableRow></TableRow>
                <TableRow>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนลูกหนี้ <sup>๑๐/</sup></div>
                    <div>(ราย)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่ออนุมัติสะสม <sup>๑๑/</sup></div>
                    <div>(บาท)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนลูกหนี้ <sup>๑๒/</sup></div>
                    <div>(ราย)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อคงค้าง <sup>๑๓/</sup></div>
                    <div>(บาท)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>จำนวนลูกหนี้</div>
                    <div>(ราย)</div>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <div>สินเชื่อใหม่</div>
                    <div>(บาท)</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report3Data.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{toThaiNumber(value.loan_range)}</TableCell>
                    <TableCell align="center">{toThaiNumber(value.loan_approve)}</TableCell>
                    <TableCell align="center">{formatNumber(value.approve_total_amount)}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: value.loan_range === 'มากกว่า 100,000' ? 'black' : 'transparent',
                        color: value.loan_range === 'มากกว่า 100,000' ? 'black' : 'inherit',
                      }}
                    >
                      {toThaiNumber(value.loan_running)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: value.loan_range === 'มากกว่า 100,000' ? 'black' : 'transparent',
                        color: value.loan_range === 'มากกว่า 100,000' ? 'black' : 'inherit',
                      }}
                    >
                      {formatNumber(value.running_total_amount)}
                    </TableCell>
                    <TableCell align="center">{toThaiNumber(value.loan_new)}</TableCell>
                    <TableCell align="center">{formatNumber(value.new_total_amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" sx={{ justifyContent: "end", mt: -3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
              <Stack sx={{ textAlign: 'left', gap: 1, mr: 8 }}>
                <Typography variant="body2" sx={{ ml: -9, fontSize: 10 }}>
                  ผู้รับรอง .................................................
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 10 }}>
                  (................................................)
                </Typography>
                <Typography variant="body2" sx={{ ml: -9, fontSize: 10 }}>
                  ตำแหน่ง .................................................
                </Typography>
                <Typography variant="body2" sx={{ ml: -5, fontSize: 10 }}>
                  วันที่ ..................................................
                </Typography>
              </Stack>

              {/* ส่วนของ หน้า ๒/๓ */}
              <Typography variant="body2" sx={{ textAlign: 'right', mr: 2 }}>
                หน้า ๒/๓
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ReportLoan2;