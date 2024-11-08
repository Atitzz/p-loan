import TableRender from "@/component/TableRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import SearchDate from "@/component/SearchDate";
import { CalendarIcon } from "@mui/x-date-pickers";
const startDate = new Date();
const endDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
endDate.setDate(endDate.getDate() +1);
function ReportLogs() {
  const __location = useLocation();
  const [HeadTitle, setHeadTitle] = useState("Title");
  const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toTHB, toDate } = useContext(ToolsContext);
  const navigate = useNavigate();
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
  }, []);

  const [logs, setLogs] = useState<any>({});
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const __route = dataRoute.find((x) => x.link == __location.pathname);
    setHeadTitle(!__route ? "title" : useLang(__route.name_th, __route.name));
    setIsLoading(true);
    Get(`report/logs?search=${search}&page=${page}&limit=${pageSize}&start=${searchDate.start}&end=${searchDate.end}`)
      .then((response) => {
        setData(response.data.data);
        setPages(response.data.pages);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [status, page, search, pageSize,searchDate]);

  const viewDetails = (id) => {
    const __details = data.find((x) => x.id === id);
    if (__details) {
      setLogs(JSON.parse(__details.changes));
      setOpen(true);
    } else {
      AddAlert("ไม่พบรายการดังกล่าว!", "error");
    }
  };

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "id",
      headerName: "S.N.",
      headerAlign: "center",
      align: "center",
      width: 50,
    },
    {
      field: "table",
      headerName: "Table | Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              textAlign: "start",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box component="span">{params.row.table}</Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              {params.row.action}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "method",
      headerName: "Method | Path",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              textAlign: "start",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box component="span">{params.row.method}</Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              {params.row.path}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "username",
      headerName: "User | At Time",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              textAlign: "start",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box component="span">{toDate(params.row.created_at)}</Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              @{params.row.username}
            </Box>
          </Box>
        );
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 280,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => viewDetails(id)}
          >
            <Icons.Visibility />
            Details
          </Button>,
        ];
      },
    },
  ];

  return (
    <Stack spacing={1}>
       <SearchDate
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSubmit={onSearch}
      />
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <Stack sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute",right:0 }}>
            <IconButton onClick={() => setOpen(false)}>
              <Icons.Cancel />
            </IconButton>
          </Box>
          <DialogTitle>{useLang("รายละเอียดการเปลี่ยนแปลง", "Change Details")}</DialogTitle>
          <DialogContent>
            <Stack gap={2}>
            {Object.entries(logs).map(([key, value], index) => (
              <Stack key={index}>
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: "#5b6e88" }}
                  children={`VALUE: ${value}`}
                />
                <Box
                  component="span"
                  sx={{ color: "#5b6e88" }}
                  children={`KEY: ${key}`}
                />
              </Stack>
            ))}
            </Stack>
          </DialogContent>
        </Stack>
      </Dialog>
      
      <GridRender
        isLoading={isLoading}
        columns={columns}
        rows={data}
        thisPage={setPage}
        onSearchText={setSearch}
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
          </>
        }
      />
    </Stack>
  );
}
export default ReportLogs;
