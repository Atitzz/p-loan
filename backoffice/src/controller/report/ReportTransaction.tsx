import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";
import SearchDate from "@/component/SearchDate";
import { CalendarIcon } from "@mui/x-date-pickers";
const startDate = new Date();
const endDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
endDate.setDate(endDate.getDate() + 1);
function ReportTransaction() {
  const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toTHB, toDate, toFloat } = useContext(ToolsContext);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    per_installment: 0,
    principle_installment: 0,
    interest_installment: 0,
    paid: 0,
    principle_paid: 0,
    interest_paid: 0,
    delay_charge: 0,
    application_charge: 0,
    delay_charge_paid: 0,
    delay_charge_paid2: 0,
    cash: 0,
    transfer_payment: 0,
    overdue_balance: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pages, setPages] = useState({
    page: 1,
    total: 0,
    limit: 20,
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
    setPage(1);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Get(
      `report/transaction?search=${search}&page=${page}&limit=${pageSize}&start=${searchDate.start}&end=${searchDate.end}`
    )
      .then((response) => {
        setData(response.data.data.data);
        setTotal(response.data.data.total);
        setPages(response.data.pages);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => {
        setTimeout(() => {
          setIsLoading(false);
          setData([]);
          AddAlert(ErrorResponse(err), "error");
        }, 250);
      });
  }, [page, search, pageSize, searchDate]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "given_at",
      headerName: "วันที่",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueFormatter: (value) => toDate(value),
    },
    {
      field: "loan_number",
      headerName: "สัญญา#",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstname",
      headerName: "ชื่อ",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastname",
      headerName: "สกุล",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receipt_number",
      headerName: "ใบเสร็จ#",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueFormatter: (value) => (value),
    },
    {
      field: "principle_paid",
      headerName: `${useLang("เงินต้น", "Principle")}`,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "interest_paid",
      headerName: `${useLang("ดอกเบี้ย", "Interest")}`,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "delay_charge_paid2",
      headerName: `${useLang("ค่าปรับ", "Delay Charge")}`,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "application_charge",
      headerName: `${useLang("ค่าธรรมเนียม", "Service Charge")}`,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "delay_charge_paid",
      headerName: `${useLang("่ค่าทวงถาม", "Delay Charge")}`,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "paid",
      headerName: `${useLang("รวมชำระ", "Total Paid")}`,
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "type",
      headerName: "ประเภท",
      flex: 1,
    },
  ];

  const contentToPrint = useRef(null);
  const pageStyle = `
  @page {
    size: A4 landscape;
      margin: 3mm;
  }

`;
  const handlePrint = useReactToPrint({
    documentTitle: "การรับชำระค่างวด",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });

  return (
    <Stack spacing={1}>
      <SearchDate
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSubmit={onSearch}
      />
      <GridRender
        onSearchText={setSearch}
        isLoading={isLoading}
        columns={columns}
        rows={data}
        thisPage={setPage}
        pages={pages}
        pageSize={setPageSize}
        insertEnd={
          <>
            <Button
              variant="outlined"
              startIcon={<CalendarIcon />}
              onClick={() => setOpenSearch(true)}
            >
              กำหนดช่วงวัน
            </Button>
            <Button
              variant="contained"
              startIcon={<Icons.Print />}
              onClick={() => handlePrint(null, () => contentToPrint.current)}
            >
              {useLang("พิมพ์", "Print")}
            </Button>
          </>
        }
      />

      <Stack sx={{ display: "none" }}>
        <Stack>
          <Stack ref={contentToPrint}>
            <Stack gap={2} sx={{ mb: 4 }}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant="body2">
                <strong> บริษัท มันนี่ฟอร์ยู จำกัด</strong>
              </Typography>
              <Typography variant="body2">
                <strong>รายงาน การรับชำระค่างวด</strong>
              </Typography>
              </Stack>
              <Typography variant="body2">
                เงื่อนไขการพิมพ์ ระหว่างวันที่{" "}
                <strong>{toDate(searchDate.start, 2)}</strong> ถึง วันที่{" "}
                <strong>{toDate(searchDate.end, 2)}</strong>
              </Typography>
            </Stack>
            <TableContainer sx={{ bgcolor: "#fff" }}>
              <Table
                sx={{
                  minWidth: 650,
                  "& .MuiTableCell-root": {
                    border: "1px solid rgba(224, 224, 224, 1)",
                    fontSize: 8,
                    lineHeight: 1.5,
                  },
                }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center" width={100}>
                      วันที่
                    </TableCell>
                    <TableCell align="center">สัญญาเลขที่</TableCell>
                    <TableCell align="center">ชื่อ - สกุล</TableCell>
                    <TableCell align="center">ใบเสร็จ</TableCell>
                    <TableCell align="center">วัน</TableCell>
                    <TableCell align="center">จำนวนเงิน</TableCell>
                    <TableCell align="center">เงินต้น</TableCell>
                    <TableCell align="center">ดอกเบี้ย</TableCell>
                    <TableCell align="center">ค่าปรับ</TableCell>
                    <TableCell align="center">ธรรมเนียม</TableCell>
                    <TableCell align="center">ทวงถาม</TableCell>
                    <TableCell align="center">เงินสด</TableCell>
                    <TableCell align="center">เงินโอน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {toDate(value.given_at)}
                      </TableCell>
                      <TableCell align="center">{value.loan_number}</TableCell>
                      <TableCell align="center">
                        {value.firstname} - {value.lastname}
                      </TableCell>
                      <TableCell align="center">
                        {value.receipt_number}
                      </TableCell>
                      <TableCell align="center">{value.days}</TableCell>
                      <TableCell align="center">
                        {toFloat(value.paid)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.principle_paid)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.interest_paid)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.delay_charge_paid2)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.application_charge)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.delay_charge_paid)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.cash)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.transfer_payment)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="left">
                      ยอดรวมทั้งหมด
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.paid)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.principle_paid)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.interest_paid)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.delay_charge_paid2)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.application_charge)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.delay_charge_paid)}
                    </TableCell>
                    <TableCell align="center">{toFloat(total.cash)}</TableCell>
                    <TableCell align="center">
                      {toFloat(total.transfer_payment)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
export default ReportTransaction;
