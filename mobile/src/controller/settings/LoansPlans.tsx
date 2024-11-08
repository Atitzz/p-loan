import TableRender from "@/component/TableRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Box, Button, Chip, Stack } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
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
    Get(`plan/loan/${status || "all"}?search=&page=${page}&limit=20`)
      .then((response) => {
        setData(response.data.data);
        setPages(response.data.pages);
        setTimeout(()=>{
          setIsLoading(false);
        },250)
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [status, page, pageSize]);

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
    AddAlert("Soon", "warning");
  };
  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "id",
      headerName: "S.N.",
      width: 75,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Plan",
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
            <Box component="span">{params.row.name}</Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              For{" "}
              {params.row.total_installment * params.row.installment_interval}{" "}
              Days
            </Box>
          </Box>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "application_fixed_charge",
      headerName: "Application Charge",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Box component="span">
              Fixed:{toFloat(params.row.application_fixed_charge)}
            </Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              Percent:{toFloat(params.row.application_percent_charge)}%
            </Box>
          </Box>
        );
      },
    },
    {
      field: "maximum_amount",
      headerName: "Limit",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Box component="span">Min:{toTHB(params.row.minimum_amount)}</Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              Max:{toTHB(params.row.maximum_amount)}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "installment_interval",
      headerName: "Installment",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Box component="span">
              {params.row.interest_rate} every {params.row.installment_interval}{" "}
              Days
            </Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              for {params.row.total_installment} times
            </Box>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      align:"center",
      headerAlign:"center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          variant="outlined"
          icon={params.value === "Enable" ? <Icons.Check/> :  <Icons.Close/>}
          color={params.value === "Enable" ? "success" : "error"}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
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
            Edit
          </Button>,
          <Button
            variant="outlined"
            startIcon={<Icons.VisibilityOff />}
            color="error"
            sx={{ gap: 2 }}
            onClick={() => onDelete(Number(id))}
          >
            Delete
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

export default LoansPlans;
