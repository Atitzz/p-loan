import MenuListItem from '@/component/MenuListItem';
import { Container, Box, Typography } from '@mui/material';
const menu1 = [
  { title: "ใบแจ้งยอดชำระ", path: null },
  { title: "ดูใบเสร็จรับเงิน", path: null },
];

const menu2 = [
  { title: "สัญญาสินเชื่อ", path: null },
  { title: "หนังสือยินยันวงเงินสินเชื่อ", path: null }
];

function History() {
    return (
        <Container>
          <Box pt={10} textAlign={'start'}>
            <Typography variant="body1" fontWeight={600} mb={3}>ประวัติการจ่ายเงิน</Typography>
            <MenuListItem data={menu1} />
            <Typography variant="body1" fontWeight={600} my={3}>เอกสารที่เกี่ยวกับสัญญา</Typography>
            <MenuListItem data={menu2} />
          </Box>
        </Container >
      )
}

export default History
