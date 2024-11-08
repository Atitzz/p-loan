import { Button, colors, Stack } from "@mui/material";
import BoxTransaction from "../../component/BoxTransaction";
import BoxDeposits from "./components/BoxDeposits";
import BoxWithDraw from "./components/BoxWithDraw";
import BoxLoans from "../../component/BoxLoans";
import ColumnChart from "./components/ColumnChart";
import AreaTransaction from "./components/AreaTransaction";
import { useContext, useEffect, useState } from "react";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
const startDate = new Date();
const endDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
endDate.setDate(endDate.getDate() + 1);
function Dashboard() {
  const { useLang, dataRoute } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
    const {  toDate,toTHB  } = useContext(ToolsContext);
  const navigate = useNavigate();
  const [data, setData] = useState<any>();
  const [lasted, setLasted] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pages, setPages] = useState({
    page: 1,
    total: 0,
    limit: 20,
  });
  const [graph, setGraph] = useState<any>({
    total_paid: [],
    overdue_balance: [],
    categories: [],
  });
  const [searchDate, setSearchDate] = useState({
    start: startDate.toISOString().split("T")[0],
    end: endDate.toISOString().split("T")[0],
  });
  useEffect(() => {
    Get(`dashboard`).then((response) => {
      setData(response.data.data);
    });
  }, []);
  useEffect(() => {
    Get(`dashboard/graph?start=${searchDate.start}&end=${searchDate.end}`).then(
      (response) => {
        setGraph(response.data.data);
      }
    );
  }, [searchDate]);

  useEffect(() => {
    setIsLoading(true);
    Get(`dashboard/lastcustomer/`)
      .then((response) => {
        setLasted(response.data.data);
        setPages(response.data.pages);
        setTimeout(()=>{
          setIsLoading(false);
        },250)
      })
     
  }, []);

  const viewDetails = (id) => {
    const __route = dataRoute.find((x) => x.component == "users_details");
    navigate(`${__route.link}/${id}`);
  };

  const columns: GridColDef<(typeof lasted)[number]>[] = [
    {
      field: "created_at",
      headerName: useLang("วันที่", "Date"),
      width: 150,
      valueFormatter: (value) => toDate(value),
    },
    {
      field: "firstname",
      headerName: useLang("ชื่อ", "FirstName"),
      flex: 1,
    },
    {
      field: "lastname",
      headerName: useLang("สกุล", "LastName"),
      flex: 1,
    },
    {
      field: "birthdate",
      headerName: useLang("วันเกิด", "BirthDate"),
      flex: 1,
      valueFormatter: (value) => toDate(value,1),
    },
    {
      field: "job",
      headerName: useLang("อาชีพ", "Job"),
      flex: 1,
    
    },
    {
      field: "salary",
      headerName: useLang("รายได้/เดือน", "Salary"),
      flex: 1,
      valueFormatter: (value) => toTHB(value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      hideable: false,
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => viewDetails(id)}
          >
            <Visibility />
            {useLang("รายละเอียด", "Details")}
          </Button>,
        ];
      },
    },
  ];
  return (
    <Stack gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
      <BoxTransaction
        labels={[
          "ลูกค้าทั้งหมด",
          "สัญญาทั้งหมด",
          "รออนุมัติยืนยันตัวตน",
          "รอยืนยันเบอร์โทรศัพท์",
        ]}
        values={[
          data?.totalUser || 0,
          data?.allLoan || 0,
          data?.kycPending || 0,
          data?.mobileUnverify || 0,
        ]}
        colors={["#4634ff", "#28c76f", "#eb2222", "#ff9f43"]}
        icons={["Groups", "ThumbUp", "Email", "MobileOff"]}
        link={[
          "/users/all",
          "/loans/all",
          "/users/kyc/pending",
          "/users/sv/unverified",
        ]}
      />
      <BoxLoans
        labels={["สัญญาใหม่", "ถึงกำหนดชำระ", "หนี้สูญ", "ปิดสัญญา"]}
        values={[
          data?.pendingLoan || 0,
          data?.dueLoan || 0,
          data?.badLoan || 0,
          data?.paidLoan || 0,
        ]}
        colors={["#4634ff", "#ff9f43", "#eb2222", "#28c76f"]}
        icons={["RotateRight", "Sync", "Paid", "TaskAlt"]}
        link={["/loans/pending", "/loans/due", "/loans/paid", "/loans/paid"]}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ flex: 1, gap: 4, width: "100%" }}
      >
        <AreaTransaction
          data={[
            {
              name: "ยอดชำระ",
              data: graph.total_paid,
              color: "#28c76f",
            },
            {
              name: "ค้างชำระ",
              data: graph.overdue_balance,
              color: "#eb2222",
            },
          ]}
          categories={graph.categories}
          onChange={setSearchDate}
        />
      </Stack>
      <Stack flexWrap="wrap" sx={{ flex: 1, gap: 4, width: "100%" }}>
        <GridRender
          title="10 ผู้สมัครล่าสุด"
          isLoading={isLoading}
          columns={columns}
          rows={lasted}
          thisPage={setPage}
          // onSearchText={setSearch}
          pages={pages}
          pageSize={setPageSize}
        />
      </Stack>
    </Stack>
  );
}

export default Dashboard;
