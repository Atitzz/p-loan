import TableRender from "@/component/TableRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Box, Button, Chip, Stack, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import Contract from "../loan_contract/Contract"; 
function ViewLoans() {
  const { status } = useParams();
  const { AddAlert, component, dataRoute, useLang, setBadge } =
    useContext(MainContext);
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
  const [openDialog, setOpenDialog] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    setPage(1);
    setData([]);
    if (status === "pending")
      setBadge((prev) => {
        return {
          ...prev,
          loans: 0,
          loan_new: 0,
        };
      });

    if (status === "due")
      setBadge((prev) => {
        return {
          ...prev,
          loans: 0,
          loan_due: 0,
        };
      });
  }, [status]);

  useEffect(() => {
    setIsLoading(true);
    Get(`loan/${status}?search=${search}&page=${page}&limit=${pageSize}`)
      .then((response) => {
        const indexedData = response.data.data.data.map((item, index) => ({
          ...item,
          index: index + 1 + (page - 1) * pageSize,
        }));
        setData(indexedData);
        setPages(response.data.pages);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => {
        setTimeout(() => {
          setIsLoading(false);
          AddAlert(ErrorResponse(err), "error");
        }, 250);
      });
  }, [status, page, search, pageSize]);

  const viewDetails = (id) => {
    const __route = dataRoute.find((x) => x.component == "loans_details");
    navigate(`${__route.link}/${id}`);
  };

  const viewInstallment = (id) => {
    const __route = dataRoute.find((x) => x.component == "loans_installments");
    navigate(`${__route.link}/${id}`);
  };

  const addContract = () => {
    const __route = dataRoute.find((x) => x.component == "loans_addcontract");
    navigate(`${__route.link}`);
  };

  const userLink = (id) => {
    const __route = dataRoute.find((x) => x.component == "users_details");
    navigate(`${__route.link}/${id}`);
  };

  const viewBlankContract = () => {
    setOpenDialog(true);
    setShowContract(true); // แสดงสัญญาเมื่อเปิด Dialog
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowContract(false); // ซ่อนสัญญาเมื่อปิด Dialog
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  const statusCheck = (value) => {
    const __value = value.toString().toLowerCase();

    switch (__value) {
      case "pending":
        return (
          <Chip
            label={StatusFilter("Pending")}
            variant="outlined"
            size="small"
          />
        );
      case "running":
        return (
          <Chip
            label={StatusFilter("Running")}
            variant="outlined"
            color="secondary"
            size="small"
          />
        );
      case "paid":
        return (
          <Chip
            label={StatusFilter("Paid")}
            variant="outlined"
            color="success"
            size="small"
          />
        );
      case "due":
        return (
          <Chip
            label={StatusFilter("Due")}
            variant="outlined"
            color="warning"
            size="small"
          />
        );
      case "rejected":
        return (
          <Chip
            label={StatusFilter("Rejected")}
            color="error"
            variant="outlined"
            size="small"
          />
        );
      default:
        return (
          <Chip
            label={StatusFilter(value)}
            color="default"
            variant="outlined"
            size="small"
          />
        );
    }
  };

  const columns: GridColDef<(typeof data)[number]>[] = [
    // {
    //   field: "id",
    //   headerName: "#",
    //   headerAlign: "center",
    //   align: "center",
    //   width: 50,
    // },
    {
      field: "index",
      headerName: "#",
      width: 50,
    },
    {
      field: "loan_number",
      headerName: useLang("เลขที่สัญญา", "Loan NO"),
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstname",
      headerName: useLang("ชื่อ", "Name"),
      width: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastname",
      headerName: useLang("สกุล", "LastName"),
      width: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "principle",
      headerName: useLang("เงินต้น", "principle"),
      headerAlign: "center",
      align: "center",
      width: 100,
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "per_installment",
      headerName: useLang("ผ่อนชำระ", "Installment Amount"),
      width: 100,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "given_installment",
      headerName: useLang("งวด", "Given Installment"),
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (value) => `${Number(value)-1}`,
    },
    {
      field: "total_installment",
      headerName: useLang("จำนวนงวด", "Total Installment"),
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "next_installment",
      headerName: useLang("กำหนดชำระ", "Due Date"),
      headerAlign: "center",
      align: "center",
      width: 130,
      valueFormatter: (value) => toDate(value, 1),
    },
    {
      field: "status",
      headerName: useLang("สถานะ", "Status"),
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => statusCheck(params.value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: useLang("ดำเนินการ", "Actions"),
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
            {useLang("รายละเอียด", "Details")}
          </Button>,
          <Button
            variant="outlined"
            color="success"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => viewInstallment(id)}
          >
            <Icons.Visibility />
            {useLang("ผ่อนชำระ", "Installments")}
          </Button>,
        ];
      },
    },
  ];
  const StatusFilter = (value) => {
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
  };

  return (
    <Stack spacing={1}>
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
          <Button variant="outlined" startIcon={<Icons.Description />} onClick={viewBlankContract}>
              {useLang("เอกสารสัญญา", "View Contract")}
            </Button>
          <Button
            variant="contained"
            startIcon={<Icons.Add />}
            onClick={addContract}
          >
            {useLang("เพิ่มใหม่", "Add New")}
          </Button>
          </>
        }
      />
       {/* Dialog สำหรับแสดงสัญญา */}
       <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            width: '80vw',
            height: '230mm',
            maxHeight: '91%',
          },
        }}
      >
        {/* <DialogTitle>{useLang("สัญญากู้ยืมเงิน", "Loan Contract")}
          <Button
            onClick={handlePrint}
            startIcon={<Icons.Print />}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            {useLang("พิมพ์เอกสาร", "Print Document")}
          </Button>
        </DialogTitle> */}
        <DialogContent>
          {/* <Box 
            ref={printRef}
            sx={{ 
              bgcolor: "#fff", 
              width: "100%", 
              height: "100%", 
              color: "#000", 
              margin: "auto", 
              textAlign: "start",
              overflow: "auto"
            }}
          > */}
            {showContract && <Contract loanPlan={{}} />}
          {/* </Box> */}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseDialog}>
            {useLang("ปิด", "Close")}
          </Button>
          <Button onClick={handlePrint} startIcon={<Icons.Print />}>
            {useLang("พิมพ์", "Print")}
          </Button>
        </DialogActions> */}
      </Dialog>
    </Stack>
  );
}

export default ViewLoans;
