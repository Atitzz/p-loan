import { Box, Stack } from '@mui/material'

import img from "@/assets/img/logo2.png";
function MobileBody({children}) {
  return (
    <Stack
    sx={{
      height: "100vh",
      width: "100vw",
      justifyContent: "space-between"
    }}
  >
    <Box sx={{ background: "var(--color1)", py: "20px" }}>
      <img src={img} alt={img} width={100} height={"100%"} />
    </Box>
    <Stack sx={{flex:1}}>
    {children}
    </Stack>
    <Box sx={{ background: "var(--color1)", py: "30px" }}></Box>
    </Stack>
  )
}

export default MobileBody
