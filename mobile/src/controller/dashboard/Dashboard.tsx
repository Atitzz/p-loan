import { colors, Stack } from "@mui/material";
import BoxTransaction from "../../component/BoxTransaction";
import BoxDeposits from "./components/BoxDeposits";
import BoxWithDraw from "./components/BoxWithDraw";
import BoxLoans from "../../component/BoxLoans";
import ColumnChart from "./components/ColumnChart";
import AreaTransaction from "./components/AreaTransaction";
function Dashboard() {
  const chart = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  };

  const donut = {
    options: {},
    series: [44, 55, 41, 17, 15],
    labels: ["A", "B", "C", "D", "E"],
  };
  return (
    <Stack gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
        <BoxTransaction labels={["Total Users","Active Users","Email Unverified Users","Mobile Unverified Users"]} values={[1307,730,577,0]} colors={["#4634ff","#28c76f","#eb2222","#ff9f43"]} icons={["Groups","ThumbUp","Email","MobileOff"]}/>
      <Stack
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ flex: 1, gap: 4, width: "100%" }}
      >
        <BoxDeposits/>
        <BoxWithDraw/>
      </Stack>
      <BoxLoans labels={["Running Loans","Pending Loans","Due Loans","Paid Loans"]} values={[1307,730,577,0]} colors={["#4634ff","#28c76f","#eb2222","#ff9f43"]} icons={["RotateRight","Sync","Paid","TaskAlt"]}/>
      <Stack
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ flex: 1, gap: 4, width: "100%" }}
      >
         <ColumnChart data={[
      {
        name: "Deposited",
        data: [30, 40, 45, 50, 49, 60, 70, 91,30, 40, 45,50],
        color:'#28c76f'
      },
      {
        name: "Withdrawn",
        data: [30, 40, 45, 50, 49, 60, 70, 91,30, 40, 45,50],
          color:'#eb2222'
      },
    ]} categories={["01", "02", "03", "04", "05", "06", "07", "08","09","10","11","12"]}/>
        <AreaTransaction data={[{
              name: 'Plus Transactions',
              data: [31, 40, 28, 51, 42, 109, 100],
              color:'#28c76f'
            }, {
              name: 'Minus Transactions',
              data: [11, 32, 45, 32, 34, 52, 41],
                 color:'#eb2222'
            }]} categories={["01", "02", "03", "04", "05", "06", "07", "08","09","10","11","12"]}/>
      </Stack>
      
    </Stack>
  );
}

export default Dashboard;
