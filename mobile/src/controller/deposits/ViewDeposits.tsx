import BoxTransaction from "@/component/BoxTransaction";
import TableRender from "@/component/TableRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Box, Button, Chip, Stack } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
function ViewDeposits() {
  const { status } = useParams();
  const { AddAlert, component, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toDate, toTHB } = useContext(ToolsContext);

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
    setData([]);
    setIsLoading(true);
    Get(`deposit/${status}?search=${search}&page=${page}&limit=${pageSize}`)
      .then((response) => {
        setData(response.data.data.deposits);
        setPages(response.data.pages);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [search, status, page, pageSize]);

  const statusCheck = (value) => {
    const __value = value.toString().toLowerCase();
    switch (__value) {
      case "pending":
        return <Chip label="Pending" variant="outlined" color="info" size="small" />;
      case "Approved":
        return (
          <Chip
            label="Approved"
            variant="outlined"
            color="secondary"
            size="small"
          />
        );
      case "Successful":
        return (
          <Chip
            label="Successful"
            variant="outlined"
            color="success"
            size="small"
          />
        );
      case "Rejected":
        return (
          <Chip
            label="Rejected"
            color="error"
            variant="outlined"
            size="small"
          />
        );
      default:
        return (
          <Chip label={value} color="default" variant="outlined" size="small" />
        );
    }
  };

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "id",
      headerName: "S.N.",
      headerAlign: "center",
      align: "center",
      width: 75,
    },
    { field: "gateway_name", headerName: "Gateway | Transaction", width: 150 },
    {
      field: "created_at",
      headerName: "Initiated",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueFormatter: (value) => toDate(value),
    },
    {
      field: "username",
      headerName: "Users",
      width: 150,
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
            <Box component="span">
              {params.row.firstname} {params.row.lastname}
            </Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              @{params.row.username}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      width: 200,
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
              width: "100%",
              alignItems:'center',
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box component="span">
              {toTHB(params.row.amount)} +{" "}
              <Box component="span" color="red">
                {toTHB(params.row.charge)}
              </Box>
            </Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              {toTHB(params.row.afterConversion)}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "rate",
      headerName: "Conversion",
      headerAlign: "center",
      align: "center",
      width: 200,
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
              width: "100%",
              alignItems:'center',
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box component="span">
              {toTHB(1)} ={" "}
              <Box component="strong">{toTHB(params.row.rate)}</Box> THB
            </Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              {toTHB(params.row.afterConversion)}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => statusCheck(params.value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width:150,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => AddAlert("Soon!", "warning")}
          >
            <Icons.Visibility />
            Details
          </Button>,
        ];
      },
    },
  ];
  // const headers = [
  //   {
  //     title: "Gateway | Transaction",
  //     key: "gateway_name",
  //     width: "200px",
  //     align: "center",
  //   },
  //   {
  //     title: "Initiated",
  //     key: "created_at",
  //     width: "150px",
  //     type: "date",
  //   },
  //   {
  //     title: "User",
  //     key: "username",
  //     subText: "@? ",
  //     key2: "firstname",
  //     align: "center",
  //     width: "150px",
  //   },
  //   {
  //     title: "Amount",
  //     align: "center",
  //     key: "amount",
  //     key2: "final_amount",
  //     type: "float",
  //     type2: "float",
  //     subText2: "? Receivable",
  //   },
  //   {
  //     title: "Conversion",
  //     key: "final_amount",
  //     key2: "final_amount",
  //     align: "center",
  //     type: "float",
  //     type2: "float",
  //   },
  //   {
  //     title: "STATUS",
  //     width: "100px",
  //     key: "status",
  //     type: "status",
  //     is_status: [
  //       {
  //         text: "Pending",
  //         value: "Pending",
  //         color: "#1976d2",
  //       },
  //       {
  //         text: "Paid",
  //         value: "Paid",
  //         color: "#00ff00",
  //       },
  //       {
  //         text: "Rejected",
  //         value: "Rejected",
  //         color: "#ff0000",
  //       },
  //       {
  //         text: "Due",
  //         value: "Due",
  //         color: "#0000ff",
  //       },
  //     ],
  //     align: "center",
  //   },
  //   {
  //     title: "Action",
  //     key: "id",
  //     width: "200px",
  //     type: "action",
  //     align: "center",
  //     action: [
  //       { func: () => AddAlert("Soon!", "warning"), name: "Details" },
  //       {
  //         func: () => AddAlert("Soon!", "warning"),
  //         name: "Installments",
  //       },
  //     ],
  //   },
  // ];

  return (
    <Stack spacing={4}>
      <GridRender
        isLoading={isLoading}
        columns={columns}
        rows={data}
        insertUnderTools={
          <BoxTransaction
            variant="outlined"
            labels={[
              "Successful Deposits",
              "Pending Deposits",
              "Reject Deposits",
              "Initiated Deposits",
            ]}
            values={[
              data["balance"],
              data["deposits"],
              data["withdrawals"],
              data["transactions"],
            ]}
            colors={["#4634ff", "#28c76f", "#eb2222", "#ff9f43"]}
            icons={["Paid", "AccountBalanceWallet", "AccountBalance", "Sync"]}
          />
        }
        thisPage={setPage}
        onSearchText={setSearch}
        pages={pages}
        pageSize={setPageSize}
      />
    </Stack>
  );
}

export default ViewDeposits;
