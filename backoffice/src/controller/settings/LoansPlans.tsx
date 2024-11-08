import TableRender from "@/component/TableRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Button, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import * as Icons from "@mui/icons-material";
function LoansPlans() {
  const { status } = useParams();
  const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toFloat, toTHB } = useContext(ToolsContext);
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

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    setIsLoading(true);
    Get(`plan/loan/${status || "all"}?search=${search}&page=${page}&limit=${pageSize}`)
      .then((response) => {
        const indexedData = response.data.data.map((item, index) => ({
          ...item,
          index: index + 1 + (page - 1) * pageSize,
        }));
        setData(indexedData);
        setPages(response.data.pages);
        setTimeout(()=>{
          setIsLoading(false);
        },250)
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [status, page, search, pageSize]);

  const viewDetails = (id) => {
    const __route = dataRoute.find((x) => x.component == "loans_details");
    navigate(`${__route.link}/${id}`);
  };

  const viewInstallment = (id) => {
    const __route = dataRoute.find((x) => x.component == "loans_installments");
    navigate(`${__route.link}/${id}`);
  };

  const onCreate = () => {
    const __route = dataRoute.find((x) => x.component == "form_plans");
    navigate(`${__route.link}`);
  };

  const onUpdate = (id) => {
    const __route = dataRoute.find((x) => x.component == "form_plans");
    navigate(`${__route.link}/${id}`);
  };

  const onDelete = (id) => {
    Delete(`plan/loan/delete/${id}`, {
    })
      .then((response) => {
        setData(data.filter(x=>x.id!==id));
        AddAlert(MessageResponse(response), "info");
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
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
      headerName: useLang("แผน","Plan"),
      flex: 1,
    //  editable:true
    },
    {
      field: "application_percent_charge",
      headerName: useLang("ค่าธรรมเนียม","Application Charge"),
      headerAlign: "center",
      align:'center',
      flex: 1,
      valueFormatter:value => `${value} %`
    },
    {
      field: "minimum_amount",
      headerName: useLang("กู้ขั้นต่ำ","Min"),
      headerAlign: "center",
      align:'center',
      flex: 1,
      valueFormatter:value => toTHB(value)
    },
    {
      field: "maximum_amount",
      headerName: useLang("กู้สูงสุด","Max"),
      headerAlign: "center",
      align:'center',
      flex: 1,
      valueFormatter:value => toTHB(value)
    },
    // {
    //   field: "status",
    //   headerName: useLang("สถานะ","Status"),
    //   width: 100,
    //   align:"center",
    //   headerAlign:"center",
    //   renderCell: (params) => (
    //     <Chip
    //       label={params.value}
    //       variant="outlined"
    //       icon={params.value === "Enable" ? <Icons.Check/> :  <Icons.Close/>}
    //       color={params.value === "Enable" ? "success" : "error"}
    //     />
    //   ),
    // },
    {
      field: "actions",
      type: "actions",
      headerName: useLang("ดำเนินการ","Actions"),
      width: 250,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => onUpdate(Number(id))}
            startIcon={<Icons.Edit />}
          >
            {useLang("แก้ไข","Edit")}
          </Button>,
          // <Button
          //   variant="outlined"
          //   startIcon={<Icons.Delete />}
          //   color="error"
          //   sx={{ gap: 2 }}
          //   onClick={() => onDelete(Number(id))}
          // >
          //   {useLang("ลบ","Delete")}
          // </Button>,
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

export default LoansPlans;
