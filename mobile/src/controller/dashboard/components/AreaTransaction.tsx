import { Box, Paper, Stack } from "@mui/material";
import ReactApexChart from "react-apexcharts";
function AreaTransaction({data,categories}) {
  return (
    <Stack component={Paper} sx={{ p: 4, flex: 1,minWidth:250 }}>
    <Box 
      component="span"
      sx={{ fontSize: 14, fontWeight: "bold", color: "#00000095" }}
    >
      Transactions Report
    </Box>
       <ReactApexChart
              options={{
                chart: {
                    height: 350,
                    type: 'area'
                  },
                  dataLabels: {
                    enabled: false
                  },
                  stroke: {
                    curve: 'smooth'
                  },
                  xaxis: {
                    type: 'datetime',
                    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
                  },
                  tooltip: {
                    x: {
                      format: 'dd/MM/yy HH:mm'
                    },
                  },
              }}
              series={data}
              type= 'area'
              height={350}
            />
    </Stack>
  )
}

export default AreaTransaction
