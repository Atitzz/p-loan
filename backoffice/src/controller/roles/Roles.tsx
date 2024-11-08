import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Button, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import * as Icons from "@mui/icons-material";

function Roles() {
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
    Get(`system/roles?search=&page=${page}&limit=20`)
      .then((response) => {
        setData(response.data.data);
        setPages(response.data.pages);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [status, page, pageSize]);

  const onCreate = () => {
    const __route = dataRoute.find((x) => x.component == "roles_forms");
    navigate(`${__route.link}`);
  };

  const onUpdate = (id) => {
    const __route = dataRoute.find((x) => x.component == "roles_forms");
    navigate(`${__route.link}/${id}`);
  };

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "id",
      headerName: "#",
      width: 75,
      align: "center",
      headerAlign: "center",
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
export default Roles;
