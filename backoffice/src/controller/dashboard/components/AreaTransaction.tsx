import SearchDate from "@/component/SearchDate";
import { MainContext, ToolsContext } from "@/context/Context";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";

import { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

const startDate = new Date();
const endDate = new Date();
startDate.setMonth(startDate.getMonth() -1);
endDate.setDate(endDate.getDate() +1);
function AreaTransaction({data,categories,onChange}) {
  const { dataRoute } = useContext(MainContext);
  const { toFloat,toDate } = useContext(ToolsContext);
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState(false);
  const [searchDate, setSearchDate] = useState({
    start: startDate.toISOString().split("T")[0],
    end: endDate.toISOString().split("T")[0],
  });

  const onSearch = (search) => {
    setSearchDate(search);
  };

  useEffect(()=>{
    onChange(searchDate)
  },[searchDate])

  const viewDetails = (id) => {
    const __route = dataRoute.find((x) => x.component == "report_transaction");
    navigate(`${__route.link}`);
  };
  return (
    <Stack component={Paper} sx={{ p: 4, flex: 1,minWidth:250 }}>
       <SearchDate
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSubmit={onSearch}
      />
      <Stack direction='row' sx={{alignItems:'center',justifyContent:'space-between',my:2}}>
    <Button onClick={viewDetails}>
      <Typography variant="h5">
      รายงานธุรกรรม
      </Typography>
    </Button>
    <Button
              variant="outlined"
              startIcon={<CalendarIcon />}
              onClick={() => setOpenSearch(true)}
            >
              กำหนดช่วงวัน
            </Button>
    </Stack>
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
                    type: 'category',
                    categories:  categories.map(x=>toDate(x,1))
                  },
                  yaxis: {
                    labels: {
                      formatter: (value) => toFloat(value), // ปรับฟอร์แมตให้เป็นทศนิยม 2 ตำแหน่งและเพิ่มหน่วย "บาท"
                    }
                  },
                  tooltip: {
                    x: {
                      format: 'dd MMMM yyyy'
                    },
                    y: {
                  
                      formatter: (val) => toFloat(val),
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
