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
endDate.setDate(endDate.getDate() +1);
function ReportStamp() {
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
    document: 0,
    stamp: 0,
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
    Get(
      `report/stamp?search=${search}&page=${page}&limit=${pageSize}&start=${searchDate.start}&end=${searchDate.end}`
    )
      .then((response) => {
        const indexedData = response.data.data.data.map((item, index) => ({
          ...item,
          index: index + 1 + (page - 1) * pageSize,
          id: item.loan_id
        }));
        setData(indexedData);
        setPages(response.data.pages);
        setTotal(response.data.data.total);
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
  }, [status, page, search, pageSize, searchDate]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    // {
    //     field: "id",
    //     headerName: `S.N.`,
    //     headerAlign: "center",
    //     align: "center",
    //     width:50
    //   },
      {
        field: "index",
        headerName: `S.N.`,
        headerAlign: "center",
        align: "center",
        width: 50,
      },
    {
      field: "created_at",
      headerName: `${useLang("วันที่", "Date")}`,
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (value) => toDate(value),
    },
    {
      field: "loan_number",
      headerName: `${useLang("สัญญา#", "Loan No")}`,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstname",
      headerName: `${useLang("ชื่อ", "Name")}`,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastname",
      headerName: `${useLang("สกุล", "Last Name")}`,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "citizen_id",
      headerName: `${useLang("เลขประจำตัว", "Citizen ID")}`,
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (value) => (value),
    },
    {
      field: "amount",
      headerName: `${useLang("เงินกู้", "Amount")}`,
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (value) => toFloat(value),
    },
    {
      field: "stamp",
      headerName: `${useLang("อากรแสตมป์", "Stamp")}`,
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (value) => toFloat(value),
    },
    {
      field: "document",
      headerName: `${useLang("คู่ฉบับ/คู่ฉีก", "Document")}`,
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (value) => toFloat(value),
    }
  ];

  const contentToPrint = useRef(null);
  const pageStyle = `
  @page {
    size: A4 landscape;
      margin: 3mm;
  }

`;
  const handlePrint = useReactToPrint({
    documentTitle: "รายงานอากรแสตมป์",
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
                <strong>รายงาน รายงานอากรแสตมป์</strong>
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
                    <TableCell align="center">สัญญา#</TableCell>
                    <TableCell align="center">เลขอ้างอิง</TableCell>
                    <TableCell align="center">บัตรประชาชน</TableCell>
                    <TableCell align="center">ชื่อ - สกุล</TableCell>
                    <TableCell align="center">มูลค่าตราสาร</TableCell>
                    <TableCell align="center">อากรแสตมป์</TableCell>
                    <TableCell align="center">คู่ฉบับ/คู่ฉีก</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {toDate(value.created_at)}
                      </TableCell>
                      <TableCell align="center">{value.loan_number}</TableCell>
                      
                      <TableCell align="center">{value.reference}</TableCell>
                      <TableCell align="center">{value.citizen_id}</TableCell>
                      <TableCell align="center">
                        {value.firstname} - {value.lastname}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.amount)}
                      </TableCell>

                      <TableCell align="center">
                        {toFloat(value.stamp)}
                      </TableCell>
                      <TableCell align="center">
                        {toFloat(value.document)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="left">
                      ยอดรวมทั้งหมด รวม {(total.total_loan)} สัญญา
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.amount)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.stamp)}
                    </TableCell>
                    <TableCell align="center">
                      {toFloat(total.document)}
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

export default ReportStamp
