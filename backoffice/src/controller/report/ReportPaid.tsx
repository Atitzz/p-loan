
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Button,
  MenuItem,
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
import  { useContext, useEffect, useRef, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
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
function ReportPaid() {
  const { status } = useParams();
  const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toFloat, toDate } = useContext(ToolsContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    total_loan: 0,
    amount: 0,
    remaining: 0,
    overdue_balance: 0,
    total_remaining: 0,
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
    Get(`loan/paid?search=${search}&page=${page}&limit=${pageSize}&start=${searchDate.start}&end=${searchDate.end}`)
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
      field: "closed_at",
      headerName: `${useLang("วันที่","Date")}`,
      headerAlign: "center",
      align: "center",
      flex:1,
      valueFormatter:value => toDate(value)
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
        field: "amount",
        headerName: `${useLang("เงินกู้","Amount")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => toFloat(value)
      },
      {
        field: "interest_rate",
        headerName: `${useLang("ดอกเบี้ย(%)","Interest")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => `${toFloat(value)} %`
      },
      {
        field: "total_installment",
        headerName: `${useLang("จำนวนเดือน","Month")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => (value)
      },
      {
        field: "remaining",
        headerName: `${useLang("คงเหลือ","Remaining")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => toFloat(value)
      },
      {
        field: "status",
        headerName: `${useLang("ประเภท","Status")}`,
        headerAlign: "center",
        align: "center",
        flex:1,
        valueFormatter:value => StatusFilter(value)
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
    documentTitle: "รายงานการให้สินเชื่อรายย่อย 1-3",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });

  const StatusFilter = (value) =>{
    switch (value) {
      case "Pending":  
        return "รออนุมัติ";
        case "Running":
        return "ลูกหนี้คงเหลือ";
        case "Rejected":
          return "ปฏิเศษสินเชื่อ";
          case "Paid":
            return "ชำระหมดแล้ว";
            case "Bad":
              return "หนี้สูญ";
              case "Due":
                return "ถึงกำหนดชำระ";
      default:
        return value;
    }
  }
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
                <strong>รายงาน ปิดสัญญา</strong>
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
                    <TableCell align="center">ยอดเงิน</TableCell>
                    <TableCell align="center">ดอกเบี้ย</TableCell>
                    <TableCell align="center">งวด</TableCell>
                    <TableCell align="center">คงเหลือ</TableCell>
                    <TableCell align="center">ประเภท</TableCell>
                    <TableCell align="center">วันปิด</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {toDate(value.closed_at)}
                      </TableCell>
                      <TableCell align="center">{value.loan_number}</TableCell>
                      <TableCell align="center">
                        {value.firstname} - {value.lastname}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.amount)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.interest_rate)} %
                      </TableCell>
                      <TableCell align="center">
                        {(value.total_installment)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.receivable)}
                      </TableCell>
                      <TableCell align="center">
                        {StatusFilter(value.status)}
                      </TableCell>
                      <TableCell align="center">
                        {toDate(value.closed_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} align="left">
                      ยอดรวมทั้งหมด รวม {(total.total_loan)} สัญญา
                    </TableCell>
                    <TableCell colSpan={3} align="left">
                      {toFloat(total.amount)}
                    </TableCell>
                    <TableCell colSpan={3} align="left">
                      {toFloat(total.remaining)}
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

export default ReportPaid
