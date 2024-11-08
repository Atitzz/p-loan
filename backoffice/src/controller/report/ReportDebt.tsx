import TableRender from "@/component/TableRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Box, Button, Chip, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";
import SearchDate from "@/component/SearchDate";
import { CalendarIcon } from "@mui/x-date-pickers";
const startDate = new Date();
const endDate = new Date();
startDate.setMonth(startDate.getMonth() -1);
endDate.setDate(endDate.getDate() +1);
function ReportDebt() {
  const { status } = useParams();
  const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toTHB, toDate,toFloat } = useContext(ToolsContext);
  const navigate = useNavigate();
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
    delay_charge2: 0,
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
    setData([]);
  }, [status]);

  useEffect(() => {
    setIsLoading(true);
    Get(`report/transaction/dept?search=${search}&page=${page}&limit=${pageSize}&start=${searchDate.start}&end=${searchDate.end}`)
    .then((response) => {
      setData(response.data.data.data);
      setTotal(response.data.data.total);
      setPages(response.data.pages);
      setTimeout(() => {
        setIsLoading(false);
      }, 250);
    })
    .catch((err) =>{
        setTimeout(() => {
         setIsLoading(false);
         setData([]);
         AddAlert(ErrorResponse(err), "error")
       }, 250);
       });
  }, [status, page, search, pageSize,searchDate]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "start_date",
      headerName: `${useLang("วันที่","Date")}`,
      headerAlign: "center",
      align: "center",
      flex:1,
      valueFormatter:value => toDate(value,1)
    },
    {
      field: "loan_number",
      headerName: `${useLang("สัญญา#","Loan No")}`,
      flex:1.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstname",
      headerName: `${useLang("ชื่อ","Name")}`,
      flex:1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastname",
      headerName: `${useLang("สกุล","Last Name")}`,
      flex:1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "given_installment",
      headerName: `${useLang("งวดที่","Given Installment")}`,
      headerAlign: "center",
      align: "center",
      flex:1,
      valueFormatter:value => (value)
    },
    {
        field: "per_installment",
        headerName: `${useLang("ต้องชำระ","Paid")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => toTHB(value)
      },
    {
        field: "principle_installment",
        headerName: `${useLang("เงินต้น","Principle")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
       valueFormatter:value => toTHB(value)
      },
      {
        field: "interest_installment",
        headerName: `${useLang("ดอกเบี้ย","Interest")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => toTHB(value)
      },
      {
        field: "paid",
        headerName: `${useLang("ชำระแล้ว","Paid")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => toTHB(value)
      },
      {
        field: "principle_paid",
        headerName: `${useLang("เงินต้น","Principle")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
       valueFormatter:value => toTHB(value)
      },
      {
        field: "interest_paid",
        headerName: `${useLang("ดอกเบี้ย","Interest")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => toTHB(value)
      },
      {
        field: "overdue_balance",
        headerName: `${useLang("ค้างงวด","be behind in payment")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => toTHB(value)
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
    documentTitle: "รายงานภาระหนี้/จัดเก็บ",
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
            <Stack gap={2} sx={{mb:4}}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant="body2">
                <strong> บริษัท มันนี่ฟอร์ยู จำกัด</strong>
              </Typography>
              <Typography variant="body2">
                <strong>รายงาน ภาระหนี้/การจัดเก็บ</strong>
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
                    <TableCell align="center">งวดที่</TableCell>
                    <TableCell align="center">ต้องชำระ</TableCell>
                    <TableCell align="center">เงินต้น</TableCell>
                    <TableCell align="center">ดอกเบี้ย</TableCell>
                    <TableCell align="center">ชำระแล้ว</TableCell>
                    <TableCell align="center">เงินต้น</TableCell>
                    <TableCell align="center">ดอกเบี้ย</TableCell>
                    <TableCell align="center">ค้างชำระ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {toDate(value.given_at,1)}
                      </TableCell>
                      <TableCell align="center">{value.loan_number}</TableCell>
                      <TableCell align="center">
                        {value.firstname} - {value.lastname}
                      </TableCell>
                      <TableCell align="center">
                        {value.given_installment}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.per_installment)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.principle_installment)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.interest_installment)}
                      </TableCell>
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
                        {toFloat(value.overdue_balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="left">
                      ยอดรวมทั้งหมด
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.per_installment)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.principle_installment)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.interest_installment)}
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
                    <TableCell align="center">{toFloat(total.overdue_balance)}</TableCell>
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

export default ReportDebt
