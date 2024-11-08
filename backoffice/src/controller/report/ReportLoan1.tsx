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
startDate.setMonth(startDate.getMonth() -1);
endDate.setDate(endDate.getDate() +1);
function ReportLoan1() {
  const { AddAlert, dataRoute, useLang } = useContext(MainContext);
  const { toDate, toFloat } = useContext(ToolsContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const [isLoading, setIsLoading] = useState(false);
  const __location = useLocation();
  const [HeadTitle, setHeadTitle] = useState("Title");

  const [guarantee, setGuarantee] = useState([]);
  const [guaSum, setGuaSum] = useState({
    "total_interest": 0,
    "interest_rate": ""
},);
  const [nonguarantee, setNonGuarantee] = useState([]);
  const [noguaSum, setNoGuaSum] = useState({
    "total_interest": 0,
    "interest_rate": ""
},);

const [totalAll, setTotalAll] = useState({
  "loan_range": "",
  "loan_running": 0,
  "running_total_principle": 0,
  "loan_pending": 0,
  "pending_total_amount": 0,
  "overdue_1_3_months": 0,
  "overdue_1_3_months_total": 0,
  "overdue_3_6_months": 0,
  "overdue_3_6_months_total": 0,
  "overdue_6_12_months": 0,
  "overdue_6_12_months_total": 0,
  "overdue_12_months_plus": 0,
  "overdue_12_months_plus_total": 0,
  "bad_count": 0,
  "bad_total": 0
});

  const [openSearch, setOpenSearch] = useState(false);
  const [searchDate, setSearchDate] = useState({
    start: startDate.toISOString().split("T")[0],
    end: endDate.toISOString().split("T")[0],
  });

  const onSearch = (search) => {
    setSearchDate(search);
  };


  useEffect(() => {
    const __route = dataRoute.find((x) => x.link == __location.pathname);
    setHeadTitle(!__route ? "title" : useLang(__route.name_th, __route.name));

    Get(`report/bank-1?start=${searchDate.start}&end=${searchDate.end}`)
      .then((response) => {
        setGuarantee(response.data.data.guaranteeReport);
        setGuaSum(response.data.data.guaranteeSummary)
        setNonGuarantee(response.data.data.notGuaranteeReport);
        setNoGuaSum(response.data.data.notGuaranteeSummary)
        setTotalAll(response.data.data.totalAll); 
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
    
`;
  const handlePrint = useReactToPrint({
    documentTitle: "รายงานการให้สินเชื่อรายย่อย 1-3",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });

  const toThaiNumber = (number) => {
    if (number === null || number === undefined) return '';
    
    const thaiNumbers = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
    return number.toString().replace(/\d/g, (digit) => thaiNumbers[digit]);
  };

  // ปรับฟังก์ชัน toFloat ให้แปลงเป็นเลขไทยด้วย
  const formatNumber = (number) => {
    if (number === null || number === undefined) return '';
    const formattedNumber = toFloat(number); // ใช้ฟังก์ชัน toFloat ที่มีอยู่เดิม
    return toThaiNumber(formattedNumber); // แปลงเป็นเลขไทย
  };


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
        <Box component="h3" sx={{ m: 1, textAlign: "center" }}>
          {HeadTitle}
        </Box>
        <Stack direction="row" gap={2}>
        <Button
              variant="outlined"
              startIcon={<CalendarIcon/>}
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

          {/* เพิ่มหัวข้อรายงานใหม่ */}
          <Box sx={{ 
            border: '2px solid black', 
            mt: 3,
            p: 1,
            mb: 2,
            textAlign: 'center',
            bgcolor: '#E6E6FA', // สีพื้นหลังขาว
            width: '100%'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              แบบรายงานการให้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับ (พิโกพลัส) <sup>๑/</sup>
            </Typography>
          </Box>

        <Stack>
            <Typography variant="body2">
              ชื่อผู้ประกอบธุรกิจ <strong> บริษัท มันนี่ฟอร์ยู จำกัด</strong>
            </Typography>
            <Typography variant="body2">
              สำหรับรอบสิ้นสุดในเดือน <strong>{toDate(searchDate.end, 3)}</strong>
            </Typography>
          </Stack>
          <Stack sx={{ my: 3 }}>
            <Typography variant="body2">
              ตารางที่ ๑ : ตารางบัญชีสินเชื่อ (สินเชื่อที่มีหลักประกัน) 
              <br />
              <span style={{ marginLeft: '60px' }}>
              {/* อัตราดอกเบี้ยหรืออัตรากำไรจากการให้สินเชื่อที่เรียกเก็บจากลูกหนี้ ทั้งหมด {guaSum.total_interest} อัตรา */}
              อัตราดอกเบี้ยหรืออัตรากำไรจากการให้สินเชื่อที่เรียกเก็บจากลูกหนี้ ทั้งหมด ๙ อัตรา
              {/* ได้แก่ {guaSum.interest_rate} */}
              ได้แก่ ๑๕, ๑๘, ๒๐, ๒๒, ๒๔, ๒๖, ๒๘, ๓๐, ๓๓
              </span>
            </Typography>
          </Stack>
          <TableContainer sx={{ bgcolor: "#fff" }}>
            <Table
              sx={{
                minWidth: 650,
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
                <TableCell align="center" rowSpan={3} width={100}>
                  วงเงินสินเชื่อของลูกหนี้ <br /> (บาท)
                </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    ข้อมูลสินเชื่อรวม
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
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
                  {/* <TableCell align="center">มีหลักประกัน</TableCell> */}
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
                {guarantee.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{toThaiNumber(value.loan_range)}</TableCell>
                    <TableCell align="center">{toThaiNumber(value.loan_running)}</TableCell>
                    <TableCell align="center">
                      {formatNumber(value.running_total_principle)}
                    </TableCell>
                    <TableCell align="center">{toThaiNumber(value.loan_pending)}</TableCell>
                    <TableCell align="center">
                      {formatNumber(value.pending_total_amount)}
                    </TableCell>
                    <TableCell align="center">
                      {toThaiNumber(value.overdue_1_3_months)}
                    </TableCell>
                    <TableCell align="center">
                      {formatNumber(value.overdue_1_3_months_total)}
                    </TableCell>
                    <TableCell align="center">
                      {toThaiNumber(value.overdue_3_6_months)}
                    </TableCell>
                    <TableCell align="center">
                      {formatNumber(value.overdue_3_6_months_total)}
                    </TableCell>
                    <TableCell align="center">
                      {toThaiNumber(value.overdue_6_12_months)}
                    </TableCell>
                    <TableCell align="center">
                      {formatNumber(value.overdue_6_12_months_total)}
                    </TableCell>
                    <TableCell align="center">
                      {toThaiNumber(value.overdue_12_months_plus)}
                    </TableCell>
                    <TableCell align="center">
                      {formatNumber(value.overdue_12_months_plus_total)}
                    </TableCell>
                    <TableCell align="center">{toThaiNumber(value.bad_count)}</TableCell>
                    <TableCell align="center">{formatNumber(value.bad_total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack sx={{ my: 3 }}>
            <Typography variant="body2">
              ตารางที่ ๒ : ตารางบัญชีสินเชื่อ (สินเชื่อที่ไม่มีหลักประกัน)
              <br />
              <span style={{ marginLeft: '60px' }}>
                {/* อัตราดอกเบี้ยหรืออัตรากำไรจากการให้สินเชื่อที่เรียกเก็บจากลูกหนี้ ทั้งหมด {noguaSum.total_interest} อัตรา  */}
                อัตราดอกเบี้ยหรืออัตรากำไรจากการให้สินเชื่อที่เรียกเก็บจากลูกหนี้ ทั้งหมด ๑๐ อัตรา 
                {/* ได้แก่ {noguaSum.interest_rate} */}
                ได้แก่ ๑๕, ๑๘, ๒๐, ๒๒, ๒๔, ๒๖, ๒๘, ๓๐, ๓๓, ๓๖
              </span>
            </Typography>
          </Stack>
          <TableContainer sx={{ bgcolor: "#fff" }}>
            <Table
              sx={{
                minWidth: 650,
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
                  <TableCell align="center" rowSpan={3} width={100}>
                    วงเงินสินเชื่อของลูกหนี้<br /> (บาท)
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
                    ข้อมูลสินเชื่อรวม
                  </TableCell>
                  <TableCell align="center" rowSpan={2} colSpan={2}>
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
                  {/* <TableCell align="center">ไม่มีหลักประกัน</TableCell> */}
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
                {nonguarantee.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{toThaiNumber(value.loan_range)}</TableCell>
                    <TableCell align="center">{toThaiNumber(value.loan_running)}</TableCell>
                    <TableCell align="center">
                      {formatNumber(value.running_total_principle)}
                    </TableCell>
                    <TableCell align="center">{toThaiNumber(value.loan_pending)}</TableCell>
                    <TableCell align="center">
                      {formatNumber(value.pending_total_amount)}
                    </TableCell>
                    <TableCell align="center">
                      {toThaiNumber(value.overdue_1_3_months)}
                    </TableCell>
                    <TableCell align="center">
                      {formatNumber(value.overdue_1_3_months_total)}
                    </TableCell>
                    <TableCell align="center">
                      {toThaiNumber(value.overdue_3_6_months)}
                    </TableCell>
                    <TableCell align="center">
                      {formatNumber(value.overdue_3_6_months_total)}
                    </TableCell>
                    <TableCell align="center">
                      {toThaiNumber(value.overdue_6_12_months)}
                    </TableCell>
                    <TableCell align="center">
                      {formatNumber(value.overdue_6_12_months_total)}
                    </TableCell>
                    <TableCell align="center">
                      {toThaiNumber(value.overdue_12_months_plus)}
                    </TableCell>
                    <TableCell align="center">
                      {formatNumber(value.overdue_12_months_plus_total)}
                    </TableCell>
                    <TableCell align="center">{toThaiNumber(value.bad_count)}</TableCell>
                    <TableCell align="center">{formatNumber(value.bad_total)}</TableCell>
                  </TableRow>
                ))}
                
                {/* <TableRow>
                  <TableCell align="center">{totalAll.loan_range}</TableCell>
                  <TableCell align="center">{totalAll.loan_running}</TableCell>
                  <TableCell align="center">
                    {toFloat(totalAll.running_total_principle)}
                  </TableCell>
                  <TableCell align="center">{totalAll.loan_pending}</TableCell>
                  <TableCell align="center">
                    {toFloat(totalAll.pending_total_amount)}
                  </TableCell>
                  <TableCell align="center">
                    {totalAll.overdue_1_3_months}
                  </TableCell>
                  <TableCell align="center">
                    {toFloat(totalAll.overdue_1_3_months_total)}
                  </TableCell>
                  <TableCell align="center">
                    {totalAll.overdue_3_6_months}
                  </TableCell>
                  <TableCell align="center">
                    {toFloat(totalAll.overdue_3_6_months_total)}
                  </TableCell>
                  <TableCell align="center">
                    {totalAll.overdue_6_12_months}
                  </TableCell>
                  <TableCell align="center">
                    {toFloat(totalAll.overdue_6_12_months_total)}
                  </TableCell>
                  <TableCell align="center">
                    {totalAll.overdue_12_months_plus}
                  </TableCell>
                  <TableCell align="center">
                    {toFloat(totalAll.overdue_12_months_plus_total)}
                  </TableCell>
                  <TableCell align="center">{totalAll.bad_count}</TableCell>
                  <TableCell align="center">{totalAll.bad_total}</TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" sx={{ justifyContent: "end", my: 4 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", gap: 4 }}
            >
              {/* <Stack sx={{ textAlign: "center",gap:2 }}>
                <Box>
                  <Typography variant="body2">
                    ผู้รับรอง.....................................
                  </Typography>
                  <Typography variant="body2">
                    (................................................)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2">
                    ตำแหน่ง.....................................
                  </Typography>
                  <Typography variant="body2">
                    วันที่...........................................
                  </Typography>
                </Box>
              </Stack> */}
              <Box>
                <Typography variant="body2" sx={{ fontSize: 10 }}>หน้า ๑/๓</Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ReportLoan1;
