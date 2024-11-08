import { Box, Paper, Stack } from "@mui/material";
import ReactApexChart from "react-apexcharts";
function ColumnChart({data,categories}) {
  return (
    <Stack component={Paper} sx={{ p: 4, flex: 1,minWidth:300 }}>
    <Box 
      component="span"
      sx={{ fontSize: 14, fontWeight: "bold", color: "#00000095" }}
    >
      Deposit & Withdraw Report
    </Box>
       <ReactApexChart
              options={{
                  plotOptions: {
                    bar: {
                      columnWidth: '50%',
                    }
                  },
                  dataLabels: {
                    enabled: false
                  },
                  stroke: {
                    width: 0
                  },
                  grid: {
                    borderColor:'transparent',
                    row: {
                      colors: ['#fff', '#f2f2f2']
                    }
                  },
                  xaxis: {
                    labels: {
                      rotate: -45
                    },
                    categories: categories,
                    tickPlacement: 'on'
                  }
                  
                  
                //   yaxis: {
                //     title: {
                //       text: 'Servings',
                //     },
                //   },
                 
              }}
              series={data}
              type= 'bar'
              height={350}
            />
    </Stack>
  )
}

export default ColumnChart
