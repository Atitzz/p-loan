import TableRender from "@/component/TableRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Box, Button, Chip, Stack } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
function ViewKYC() {
  const { status ,ev,sv,kyc} = useParams();
  const { AddAlert, component,dataRoute ,useLang} = useContext(MainContext);
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

  useEffect(() => {
    setPage(1);
  }, [status,status,ev,sv,kyc]);

  useEffect(() => {
    if(status)
      fetchData('status',status);
    else if(ev)
      fetchData('ev',ev);
    else if(sv)
      fetchData('sv',sv);
    else if(kyc)
      fetchData('kyc',kyc);
    else
      fetchData('all','');
    
  }, [status,ev,sv,kyc, page,search,pageSize]);

  const fetchData = (path,params) =>{
    setIsLoading(true);
    Get(`customer/users/${path}/${params}?search=${search}&page=${page}&limit=${pageSize}`)
      .then((response) => {
        setData(response.data.data);
        setPages(response.data.pages);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }

  const viewDetails = (id) =>{
    const __route = dataRoute.find(x=>x.component == 'users_kyc')
    navigate(`${__route.link}/${id}`)
  }

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "firstname",
      headerName: useLang("ชื่อ","FirstName"),
      width: 150,
      hideable:false 
    },
    {
      field: "lastname",
      headerName: useLang("สกุล","LastName"),
      width: 150,
      hide:true 
    },
    {
      field: "citizen_id",
      headerName: useLang("เลขบัตรประชาชน","CitizenID"),
      width: 150,
      hide:true 
    },
    {
      field: "address",
      headerName: useLang("ที่อยู่","Address"),
      flex:1,
      hide:true 
    },
    {
      field: "subdistrict",
      headerName: useLang("แขวง","Sub District"),
      flex:1,
      hide:true 
    },
    {
      field: "district",
      headerName: useLang("เขต","District"),
      flex:1,
      hide:true 
    },
    {
      field: "province",
      headerName: useLang("จังหวัด","Province"),
      flex:1,
      hide:true 
    },
    {
      field: "zipcode",
      headerName: useLang("รหัสไปรษณี","Zipcode"),
      flex:1,
      hide:true 
    },
    {
      field: "mobile",
      headerName: useLang("เบอร์.มือถือ","Mobile"),
      width: 150,
      hideable:false 
    },
    {
      field: "country",
      headerName: useLang("ประเทศ","Country"),
      headerAlign: "center",
      align: "center",
      width: 100,
      hideable:false 
    },
    {
      field: "kyc",
      headerName: useLang("ยืนยันตัวตน","KYC"),
      headerAlign: "center",
      align: "center",
      flex: 1,
      hideable:false ,
      renderCell: (params) => (
        <Chip
          label={params.value === "verified" ? useLang("ยืนยันตัวตนแล้ว","Verified") : params.value === "pending" ? useLang("รอการตรวจสอบ","Pending") : useLang("รอการยืนยัน","Unverfied")}
          variant="outlined"
          icon={params.value === "verified" ? <Icons.Check/> : params.value === "pending" ?  <Icons.WorkHistory/> :  <Icons.Close/>}
          color={params.value === "verified" ? "success" : params.value === "pending" ?  "warning" : "error"}
        />
      ),
    },
    {
      field: "sv",
      headerName: useLang("ยืนยันเบอร์.มือถือ","Mobile Verify"),
      headerAlign: "center",
      align: "center",
      flex: 1,
      hideable:false ,
      renderCell: (params) => (
        <Chip
          label={params.value === "verified" ? "Verified" : "Unverfied" }
          variant="outlined"
          icon={params.value === "verified" ? <Icons.Check/> :  <Icons.Close/>}
          color={params.value === "verified" ? "success" : "error"}
        />
      ),
    },
    {
      field: "created_at",
      headerName: useLang("เป็นสมาชิก","Joined At"),
      headerAlign: "center",
      align:"center",
      flex:1,
      hideable:false ,
      valueFormatter:value => toDate(value)
    },
    {
      field: "status",
      headerName: useLang("สถานะ","Status"),
      width: 159,
      align: "center",
      headerAlign: "center",
      hideable:false ,
      renderCell: (params) => (
        <Chip
          label={params.value === "active" ? "Active" : "InActive"}
          variant="outlined"
          icon={params.value === "active" ? <Icons.Check/> :  <Icons.Close/>}
          color={params.value === "active" ? "success" : "error"}
        />
      ),
    },
    {
      field: "accept_privacy",
      headerName: useLang("ยอมรับเงื่อนไข","AcceptPrivacy"),
      width: 159,
      align: "center",
      headerAlign: "center",
      hide:true,
      renderCell: (params) => (
        <Chip
          label={params.value === "accept" ? "Accept" : "Decline"}
          variant="outlined"
          icon={params.value === "accept" ? <Icons.Check/> :  <Icons.Close/>}
          color={params.value === "accept" ? "success" : "error"}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      hideable:false ,
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => viewDetails(id)}
          >
            <Icons.Visibility />
            {useLang("รายละเอียด","Details")}
          </Button>
        ]
      },
    },
  ];

 
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
      />
    </Stack>
  );
}

export default ViewKYC;
