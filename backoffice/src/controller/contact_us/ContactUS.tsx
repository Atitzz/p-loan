import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
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
function ContactUS() {
  const { AddAlert, component, dataRoute, useLang, setBadge } =
    useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toTHB, toDate, toFloat } = useContext(ToolsContext);
  const [data, setData] = useState([]);

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
    setBadge((prev) => {
      return {
        ...prev,
        contact_us: 0,
      };
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Get(
      `contactus?search=${search}&page=${page}&limit=${pageSize}&start=${searchDate.start}&end=${searchDate.end}`
    )
      .then((response) => {
        setData(response.data.data);
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
      field: "created_at",
      headerName: "วันที่",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueFormatter: (value) => toDate(value),
    },
    {
      field: "name",
      headerName: "ชื่อ - สกุล",
      flex: 1,
    },

    {
      field: "email",
      headerName: "อีเมล",
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "เบอร์.โทร",
      flex: 1,
    },

    {
      field: "subject",
      headerName: "เรื่อง",
      width: 200,
    },
    {
      field: "message",
      headerName: `ข้อความ`,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "ดำเนินการ",
      width: 250,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            startIcon={<Icons.Visibility />}
            color="success"
            sx={{ gap: 2 }}
            onClick={() => onRead(Number(id))}
          >
            เปิดอ่าน
          </Button>,
        ];
      },
    },
  ];

  const contentToPrint = useRef(null);
  const showToPrint = useRef(null);
  const pageStyle = `
  @page {
    size: A4 landscape;
      margin: 3mm;
  }

`;
  const handlePrint = useReactToPrint({
    documentTitle: "ติดต่อจากลูกค้า",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });

  const [show, setShow] = useState({
    id: -1,
    created_at: null,
    updated_at: null,
    deleted_at: null,
    name: null,
    email: null,
    mobile: null,
    subject: null,
    message:null,
  });
  const [read, setRead] = useState(false);
  const onRead = (id) => {
    const _show = data.find((x) => x.id === id);
    if (_show) {
      setRead(true);
      setShow(_show);
    }
  };

  const onReaded = () => {
    Put(`contactus`, { id: show.id })
      .then((response) => {
        setData((prev) => prev.filter((x) => x.id != show.id));
        AddAlert(MessageResponse(response));
        setRead(false);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  };

  return (
    <Stack spacing={1}>
      <Dialog
        fullWidth
        maxWidth="md"
        open={read}
        onClose={() => setRead(false)}
      >
        <DialogContent>
          <Stack ref={showToPrint} sx={{ gap: 2 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h5">
                <strong>ข้อมูลผู้กู้</strong>
              </Typography>
              <span>
                <strong>เวลา : </strong>
                {toDate(show.created_at)}
              </span>
            </Stack>

            <Divider />
            <Stack
              direction="row"
              sx={{ gap: 2, justifyContent: "space-between" }}
            >
              <span>
                <strong>ผู้ยืนเรื่อง : </strong>
                {show.name}
              </span>
              <span>
                <strong>อีเมล : </strong>
                {show.email}
              </span>
              <span>
                <strong>เบอร์.โทร : </strong>
                {show.mobile}
              </span>
            </Stack>
            <Divider/>
            <Stack
              direction="row"
              sx={{ gap: 2, justifyContent: "space-between" }}
            >
              <span>
                <strong>เรื่อง : </strong>
                {show.subject}
              </span>
            </Stack>
            <Stack
              direction="row"
              sx={{ gap: 2, justifyContent: "space-between" }}
            >
              <span>
                <strong>ข้อความ : </strong>
                {show.message}
              </span>
            </Stack>
            
          </Stack>
          <Stack
            direction="row"
            sx={{ gap: 2, justifyContent: "space-between", my: 5 }}
          >
            <Button
              fullWidth
              variant="contained"
              color="warning"
              onClick={() => handlePrint(null, () => showToPrint.current)}
              startIcon={<Icons.Print />}
            >
              พิมพ์
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={() => setRead(false)}
              startIcon={<Icons.VisibilityOff />}
            >
              ปิดหน้าต่าง
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={onReaded}
              startIcon={<Icons.Visibility />}
            >
              อ่านแล้ว
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
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
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">
                  <strong> บริษัท มันนี่ฟอร์ยู จำกัด</strong>
                </Typography>
                <Typography variant="body2">
                  <strong>ติดต่อจากลูกค้า</strong>
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
                    <TableCell align="center">ชื่อ - สกุล</TableCell>
                    <TableCell align="center">อีเมล</TableCell>
                    <TableCell align="center">เบอร์.โทร</TableCell>
                    <TableCell align="center">เรื่อง</TableCell>
                    <TableCell align="center">ข้อความ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((value, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {toDate(value.created_at)}
                      </TableCell>
                      <TableCell align="center">{value.name}</TableCell>
                      <TableCell align="center">{value.email}</TableCell>
                      <TableCell align="center">{value.mobile}</TableCell>
                      <TableCell align="center">{value.subject}</TableCell>
                      <TableCell align="center">{value.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
export default ContactUS;
