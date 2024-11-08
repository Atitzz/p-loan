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
startDate.setMonth(startDate.getMonth() - 1);
endDate.setDate(endDate.getDate() + 1);
function ReportLoan3() {
  const { AddAlert, dataRoute, useLang } = useContext(MainContext);
  const { toDate, toFloat } = useContext(ToolsContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const [isLoading, setIsLoading] = useState(false);
  const __location = useLocation();
  const [HeadTitle, setHeadTitle] = useState("Title");

  const [guarantee, setGuarantee] = useState([]);

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

    Get(`report/bank-3?start=${searchDate.start}&end=${searchDate.end}`)
      .then((response) => {
        setGuarantee(response.data.data);
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
      margin: 10mm;
  }

`;
  const handlePrint = useReactToPrint({
    documentTitle: "รายงานการให้สินเชื่อรายย่อย 3-3",
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
    // <Stack gap={2}>
    //   <SearchDate
    //     open={openSearch}
    //     onClose={() => setOpenSearch(false)}
    //     onSubmit={onSearch}
    //   />
    //   <Stack
    //     direction="row"
    //     spacing={2}
    //     sx={{ alignItems: "center", justifyContent: "space-between" }}
    //   >
    //     <Box component="h3" sx={{ m: 1, textAlign: "center" }}>
    //       {HeadTitle}
    //     </Box>
    //     <Stack direction="row" gap={2}>
    //       <Button
    //         variant="outlined"
    //         startIcon={<CalendarIcon />}
    //         onClick={() => setOpenSearch(true)}
    //       >
    //         กำหนดช่วงวัน
    //       </Button>
    //       <Button
    //         variant="contained"
    //         startIcon={<Print />}
    //         onClick={() => handlePrint(null, () => contentToPrint.current)}
    //       >
    //         {useLang("พิมพ์", "Print")}
    //       </Button>
    //     </Stack>
    //   </Stack>
    //   <Stack component={Paper} sx={{ gap: 2, p: 4 }}>
    //     <Stack ref={contentToPrint}>
    //       {/* <Stack>
    //         <Typography variant="body2">
    //           ผู้ประกอบธุรกิจ <strong> บริษัท มันนี่ฟอร์ยู จำกัด</strong>
    //         </Typography>
    //         <Typography variant="body2">
    //           สำหรับรอบสิ้นสุดในเดือน <strong>{toDate(searchDate.end, 3)}</strong>
    //         </Typography>
    //       </Stack> */}
    //       <Stack sx={{ my: 3 }}>
    //         <Typography variant="body2">
    //           ตารางที่ 4 : ตารางบัญชีลูกหนี้
    //         </Typography>
    //       </Stack>
    //       <TableContainer sx={{ bgcolor: "#fff" }}>
    //         <Table
    //           sx={{
    //             minWidth: 650,
    //             "& .MuiTableCell-root": {
    //               border: "1px solid rgba(224, 224, 224, 1)",
    //               fontSize: 8,
    //               lineHeight: 1.5,
    //             },
    //           }}
    //           size="small"
    //           aria-label="a dense table"
    //         >
    //           <TableHead>
    //             <TableRow>
    //               <TableCell align="center" rowSpan={3} width={150}>
    //                 วงเงินสินเชื่อของลูกหนี้ (บาท)
    //               </TableCell>
    //               <TableCell align="center" rowSpan={2} colSpan={2}>
    //                 ข้อมูลสินเชื่ออนุมัติสะสม
    //               </TableCell>
    //               <TableCell align="center" rowSpan={2} colSpan={2}>
    //                 ข้อมูลสินเชื่อคงค้าง
    //               </TableCell>
    //               <TableCell align="center" rowSpan={2} colSpan={2}>
    //                 สินเชื่อใหม่ <sup>๑๔/</sup>
    //               </TableCell>
    //             </TableRow>
    //             <TableRow></TableRow>
    //             <TableRow>
    //               {/* <TableCell align="center">มีหลักประกัน</TableCell> */}
    //               <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
    //                 <div>จำนวนลูกหนี้ <sup>๑๐/</sup></div>
    //                 <div>(ราย)</div>
    //               </TableCell>
    //               <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
    //                 <div>สินเชื่ออนุมัติสะสม <sup>๑๑/</sup></div>
    //                 <div>(บาท)</div>
    //               </TableCell>
    //               <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
    //                 <div>จำนวนลูกหนี้ <sup>๑๒/</sup></div>
    //                 <div>(ราย)</div>
    //               </TableCell>
    //               <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
    //                 <div>สินเชื่อคงค้าง <sup>๑๓/</sup></div>
    //                 <div>(บาท)</div>
    //               </TableCell>
    //               <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
    //                 <div>จำนวนลูกหนี้</div>
    //                 <div>(ราย)</div>
    //               </TableCell>
    //               <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
    //                 <div>สินเชื่อใหม่</div>
    //                 <div>(บาท)</div>
    //               </TableCell>
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             {guarantee.map((value, index) => (
    //               <TableRow key={index}>
    //                 <TableCell align="center">{toThaiNumber(value.loan_range)}</TableCell>
    //                 <TableCell align="center">{toThaiNumber(value.loan_approve)}</TableCell>
    //                 <TableCell align="center">
    //                   {formatNumber(value.approve_total_amount)}
    //                 </TableCell>
    //                 <TableCell align="center">{toThaiNumber(value.loan_running)}</TableCell>
    //                 <TableCell align="center">
    //                   {formatNumber(value.running_total_amount)}
    //                 </TableCell>
    //                 <TableCell align="center">{toThaiNumber(value.loan_new)}</TableCell>
    //                 <TableCell align="center">
    //                   {formatNumber(value.new_total_amount)}
    //                 </TableCell>
    //               </TableRow>
    //             ))}
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //       <Stack direction="row" sx={{ justifyContent: "end", my: 4 }}>
    //         <Stack
    //           direction="row"
    //           sx={{ justifyContent: "space-between", gap: 4 }}
    //         >
    //           <Stack sx={{ textAlign: "center", gap: 2 }}>
    //             <Box>
    //               <Typography variant="body2">
    //                 ผู้รับรอง.....................................
    //               </Typography>
    //               <Typography variant="body2">
    //                 (................................................)
    //               </Typography>
    //             </Box>
    //             <Box>
    //               <Typography variant="body2">
    //                 ตำแหน่ง.....................................
    //               </Typography>
    //               <Typography variant="body2">
    //                 วันที่...........................................
    //               </Typography>
    //             </Box>
    //           </Stack>
    //           <Box>
    //             <Typography variant="body2">หน้า ๒/๓</Typography>
    //           </Box>
    //         </Stack>
    //       </Stack>
    //     </Stack>
    //   </Stack>
    // </Stack>

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

      <Stack component={Paper} sx={{ gap: 2, p: 10 }}>
        <Stack ref={contentToPrint}>
          <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>คำอธิบาย</Typography>

          <Stack spacing={1.5} sx={{ pl: 2 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๑/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับ หมายความว่า สินเชื่อรายย่อยระดับจังหวัดโดยมีวงเงินรวมสินเชื่อไม่เกินห้าหมื่นบาทต่อลูกหนี้แต่ละราย และมีระยะเวลาการให้สินเชื่อตามที่ผู้ประกอบธุรกิจได้ตกลงกัน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๒/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>จำนวนบัญชี หมายถึง จำนวนบัญชีลูกหนี้สินเชื่อรายย่อยระดับจังหวัดถายใต้การกำกับ เฉพาะที่มียอดสินเชื่อคงค้าง ณ สิ้นเดือนที่รายงาน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๓/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>สินเชื่อคงค้าง หมายถึง ยอดสินเชื่อคงค้าง (Outstanding Balance) เฉพาะต้นเงินของลูกหนี้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับ ทั้งสิ้น (หลังหักรายได้รอการตัดบัญชี) ณ วันสิ้นเดือนที่รายงาน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๔/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>สินเชื่อใหม่ หมายถึง สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับที่เพิ่มขึ้นใหม่ในเดือนที่รายงาน ไม่รวมสินเชื่อที่ลดลงจากการชำระคืน โดยรายงานเป็นจำนวนบัญชีและสินเชื่อใหม่</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๕/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>
                ลูกหนี้ผิดนัดชำระหนี้ หมายถึง ลูกหนี้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับที่ค้างชำระต้นเงินหรือดอกเบี้ยหรืออัตรากำไรจากการให้สินเชื่อเป็นระยะเวลา (๑) เกิน ๑ เดือน ถึง ๓ เดือน (๒) เกิน ๓ เดือน ถึง ๖ เดือน (๓) เกิน ๖ เดือนถึง ๑๒ เดือน (๔) เกิน ๑๒ เดือน นับตั้งแต่วันที่ถึงกำหนดชำระไม่ว่าจะเป็นไปตามเงื่อนไข หรือเงื่อนเวลาตามสัญญา หรือวันที่ทวงถามหรือเรียกให้ชำระเงินแล้วแต่วันใดจะถึงก่อน โดยให้รายงานแยกเป็นจำนวนบัญชี และยอดสินเชื่อคงค้างรายงานเฉพาะตัวเงิน (หลังหักรายได้รอการตัดบัญชี)
              </sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๖/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>จำนวนบัญชี หมายถึง จำนวนบัญชีลูกหนี้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับที่ผิดนัดชำระหนี้ตามระยะเวลาที่ระบุไว้ตามข้อ ๕ ณ วันสิ้นเดือนที่รายงาน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๗/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>สินเชื่อคงค้าง หมายถึง ยอดสินเชื่อคงค้างของลูกหนี้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับเฉพาะบัญชีที่มีการผิดนัดชำระหนี้ตามระยะเวลาที่ระบุไว้ ตามข้อ ๕ ณ วันสิ้นเดือนที่รายงาน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๘/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>การตัดหนี้สูญ หมายถึง สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับที่มีการตัดหนี้สูญในเดือนที่รายงาน โดยรายงานเป็นจำนวนบัญชีและสินเชื่อคงค้าง</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๙/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>ทรัพย์สินที่ใช้เป็นประกัน หมายถึง การที่เจ้าหนี้รับเอกสารสิทธิ์ในทรัพย์สินนั้นเป็นประกันการชำระหนี้ ทั้งนี้ ไม่รวมถึงการรับจำนำสิ่งของเป็นประกันหนี้เงินกู้เป็นปกติธุระตามพระราชบัญญัติโรงรับจำนำ พ.ศ. ๒๕๐๕</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๑๐/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>จำนวนลูกหนี้ หมายถึง จำนวนลูกหนี้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับทั้งหมดที่ได้รับอนุมัติสินเชื่อจากผู้ประกอบธุรกิจจนถึงสิ้นเดือนที่รายงาน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-2em', paddingLeft: '2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๑๑/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>สินเชื่ออนุมัติสะสม หมายถึง ยอดสินเชื่อที่ผู้ประกอบธุรกิจอนุมัติให้แก่ลูกหนี้แต่ละราย โดยนับรวมสินเชื่อทุกบัญชี เฉพาะส่วนของต้นเงินของลูกหนี้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับ (หลังหักรายได้รอการตัดบัญชี) ณ วันสิ้นเดือนที่รายงาน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-1.2em', paddingLeft: '1.2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๑๒/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>จำนวนลูกหนี้ หมายถึง จำนวนลูกหนี้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับเฉพาะรายที่มียอดสินเชื่อคงค้าง ณ สิ้นเดือนที่รายงาน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-2em', paddingLeft: '2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๑๓/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>สินเชื่อคงค้าง หมายถึง ยอดสินเชื่อคงค้าง (Outstanding Balance) ของลูกหนี้แต่ละรายโดยนับรวมสินเชื่อทุกบัญชี เฉพาะส่วนของต้นเงินของลูกหนี้สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับ (หลังหักรายได้รอการตัดบัญชี) ณ วันสิ้นเดือนที่รายงาน</sub>
            </Typography>

            <Typography variant="body2" sx={{lineHeight: 1.6, textIndent: '-2em', paddingLeft: '2em', textAlign: 'justify' }}>
              <sub style={{ fontSize: 10, position: 'relative', top: '-0.9em', display: 'inline' }}>๑๔/</sub>
              <sub style={{ fontSize: 14, paddingLeft: 5 }}>สินเชื่อใหม่ หมายถึง สินเชื่อรายย่อยระดับจังหวัดภายใต้การกำกับที่เพิ่มขึ้นใหม่ในเดือนที่รายงาน ไม่รวมสินเชื่อที่ตัดลดลงจากการชำระคืน สินเชื่ออนุมัติใหม่ในเดือนที่รายงานให้แก่ลูกหนี้เดิม โดยรายงานเป็นจำนวนลูกหนี้ใหม่และสินเชื่อใหม่</sub>
            </Typography>
          </Stack>

          <Box sx={{ textAlign: 'right', mt: 10 }}>
            <Typography variant="body2">หน้า ๓/๓</Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ReportLoan3;
