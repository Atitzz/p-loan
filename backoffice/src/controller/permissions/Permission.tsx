import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Button, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import * as Icons from "@mui/icons-material";

function Permission() {
  const { status } = useParams();
  const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  //   const { toFloat, toTHB } = useContext(ToolsContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [_, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pages, setPages] = useState({
    page: 1,
    total: 0,
    limit: 20,
  });

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    setIsLoading(true);
    Get(`system/permission?search=&page=${page}&limit=20`)
      .then((response) => {
        const indexedData = response.data.data.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
        setData(indexedData);
        setPages(response.data.pages);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [status, page, pageSize]);

  const onCreate = () => {
    const __route = dataRoute.find((x) => x.component == "permissions_forms");
    navigate(`${__route.link}`);
  };

  const onUpdate = (id) => {
    const __route = dataRoute.find((x) => x.component == "permissions_forms");
    navigate(`${__route.link}/${id}`);
  };

  const columns: GridColDef<(typeof data)[number]>[] = [
    // {
    //   field: "id",
    //   headerName: "#",
    //   width: 75,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "index",
      headerName: "#",
      width: 50,
    },
    {
      field: "name",
      headerName: "ชื่อ",
      flex: 1,
    },
    {
      field: "key",
      headerName: "คีย์",
      flex: 1,
    },
    {
      field: "approve",
      headerName: "อนุมัติ",
      flex: 1,
    },
    {
      field: "reject",
      headerName: "ปฏิเศษ",
      flex: 1,
    },
    {
      field: "show",
      headerName: "แสดง",
      flex: 1,
    },
    {
      field: "list",
      headerName: "รายการ",
      flex: 1,
    },
    {
      field: "store",
      headerName: "บันทึก",
      flex: 1,
    },
    {
      field: "update",
      headerName: "แก้ไข",
      flex: 1,
    },
    {
      field: "remove",
      headerName: "ลบ",
      flex: 1,
    },
    {
      field: "manage_users",
      headerName: "จัดการผู้ใช้",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: useLang("ดำเนินการ", "Actions"),
      width: 250,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => onUpdate(Number(id))}
            startIcon={<Icons.Visibility />}
          >
            {useLang("เรียกดู")}
          </Button>,
        ];
      },
    },
  ];

  return (
    <Stack spacing={1}>
      <GridRender
        isLoading={isLoading}
        title={useLang("เส้นทาง", "Route")}
        columns={columns}
        rows={data}
        insertEnd={
          <Button
            variant="contained"
            startIcon={<Icons.Add />}
            onClick={onCreate}
          >
            {useLang("เพิ่มใหม่", "Add New")}
          </Button>
        }
        thisPage={setPage}
        onSearchText={setSearch}
        pages={pages}
        pageSize={setPageSize}
      />
    </Stack>
  );
}
export default Permission;
