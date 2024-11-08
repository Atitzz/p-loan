import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Button,
  Stack
} from '@mui/material';
import * as Icons from "@mui/icons-material";
import { ToolsContext, MainContext, HttpContext } from "@/context/Context";
import { useReactToPrint } from "react-to-print";

const Installment = ({ open, onClose, props }) => {
  const { toDate, toFloat } = useContext(ToolsContext);
  const { useLang } = useContext(MainContext);
  const [data, setData] = useState<any>();
  const { Get } = useContext(HttpContext);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    setData(props);
  }, [props]);

  useEffect(() => {
    if (data?.user_id) {
      Get(`customer/users/details/${data.user_id}`)
        .then((response) => {
          const { ...user } = response.data.data;
          setUserData(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [data?.user_id]);

  const contentToPrint = useRef(null);
  const pageStyle = `
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .MuiPaper-root {
        box-shadow: none !important;
      }
      .print-background {
        background-color: #000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .print-border {
        border: 1px solid #000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "ใบแจ้งยอดการใช้จ่ายสินเชื่อ / ใบเสร็จรับเงิน",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });

  const nextInstallmentData = data?.isCalculated ? data : data;
  const isPaid = data?.paid !== null && data?.paid !== 0;
  const typeFlatrate = data?.type_interest == 'flatrate'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ width: '210mm', minHeight: '300mm', padding: '10mm', backgroundColor: '#fff', mt: 1 }}>
        <Button
          variant="contained"
          startIcon={<Icons.Print />}
          onClick={handlePrint}
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          {useLang("พิมพ์", "Print")}
        </Button>
        <Box ref={contentToPrint} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* หัวกระดาษ */}
          <Grid container alignItems="flex-start" spacing={1}>
            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src="/favicon.ico" alt="Logo" style={{ width: '100%', maxWidth: '80px' }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ mb: 2, mt: 5, fontWeight: 'bold' }}>บริษัท มันนี่ ฟอร์ ยู จำกัด</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>2/58-59 ซอยสุขุมวิท 42</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" align="right" sx={{ fontWeight: 'bold', mb: 2 }}>ใบแจ้งยอดการใช้จ่ายสินเชื่อ / ใบเสร็จรับเงิน</Typography>
              <Typography variant="body2" align="right">
                เลขที่
                <span style={{
                  display: 'inline-block',
                  width: '150px',
                  borderBottom: '1px dotted black',
                  textAlign: 'left',
                  position: 'relative',
                  lineHeight: '0.7'
                }}>
                  <span style={{
                    position: 'relative',
                    top: '-2px',
                    marginLeft: '5px',
                    display: 'inline-block',
                  }}>
                    {data?.receipt_number}
                  </span>
                </span>
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mb: 2 }}>แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>เลขที่ 0105546052278 โทร.................................</Typography>


          <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
            <Grid item xs={6}>
              <Link href="http://www.moneyforyou.co.th" target="_blank" rel="noopener noreferrer">
                www.moneyforyou.co.th
              </Link>
              <Box sx={{ border: '0px solid #000', p: 2, mb: 2 }}>
              </Box>
              <Box sx={{ border: '1px solid #000', p: 2, mb: 2, ml: 2 }}>
                <Typography variant="body2">
                  ชื่อ / ที่อยู่ลูกค้า
                  <span style={{
                    display: 'inline-block',
                    width: 'calc(100% - 150px)',
                    textAlign: 'left',
                    whiteSpace: 'nowrap'
                  }}>................................................................................
                    <span style={{
                      position: 'relative',
                      left: '-200px',
                      top: '-3px',
                      display: 'inline-block',
                    }}>
                      {userData?.firstname} {userData?.lastname}
                    </span>
                  </span>
                </Typography>
                <Typography variant="body2">
                  <span style={{
                    display: 'inline-block',
                    width: 'calc(100% - 150px)',
                    textAlign: 'left',
                    whiteSpace: 'nowrap'
                  }}>........................................................................................................
                    <span style={{
                      position: 'relative',
                      left: '-300px',
                      top: '-3px',
                      display: 'inline-block',
                    }}>
                      {userData?.houseno} หมู่ {userData?.villageno} ถนน {userData?.lane}
                    </span>
                  </span>
                </Typography>
                <Typography variant="body2">
                  <span style={{
                    display: 'inline-block',
                    width: 'calc(100% - 150px)',
                    textAlign: 'left',
                    whiteSpace: 'nowrap'
                  }}>........................................................................................................
                    <span style={{
                      position: 'relative',
                      left: '-300px',
                      top: '-3px',
                      display: 'inline-block',
                    }}>
                      แขวง {userData?.subdistrict} เขต {userData?.district} จังหวัด {userData?.province}
                    </span>
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 'calc(100% - 150px)',
                    textAlign: 'left',
                    whiteSpace: 'nowrap'
                  }}>........................................................................................................
                    <span style={{
                      position: 'relative',
                      left: '-300px',
                      top: '-3px',
                      display: 'inline-block',
                    }}>
                      รหัสไปรษณีย์ {userData?.zipcode}
                    </span>
                  </span>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ p: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={5}>
                    <Typography variant="body2" sx={{ mr: 5, textAlign: 'right' }}>ประเภทสินเชื่อ</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Box sx={{ bgcolor: '#f0f0f0', p: 0.5, minHeight: '1.5em', fontSize: '13px' }}>{data?.plan || ''}</Box>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2" sx={{ mr: 5, textAlign: 'right' }}>เลขที่สัญญา</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Box sx={{ bgcolor: '#f0f0f0', p: 0.5, minHeight: '1.5em' }}>{data?.loan_number || ''}</Box>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2" sx={{ mr: 5, textAlign: 'right' }}>วันที่สรุปยอดบัญชี</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Box sx={{ bgcolor: '#f0f0f0', p: 0.5, minHeight: '1.5em' }}>{toDate(data?.given_at, 1) || ''}</Box>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2" sx={{ mr: 5, textAlign: 'right' }}>กำหนดชำระเงิน</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Box sx={{ bgcolor: '#f0f0f0', p: 0.5, minHeight: '1.5em' }}>{toDate(data?.installment_date, 1) || ''}</Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {/* ตารางชำระ */}
          <TableContainer sx={{ border: '0px solid #000', mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #000', fontWeight: 'bold' }}>สรุปยอดคงเหลือหลังชำระ</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #000', fontWeight: 'bold' }}>จำนวนเงิน</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #000', fontWeight: 'bold' }}>รายละเอียดการชำระเงินกู้</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #000', fontWeight: 'bold' }}>จำนวนเงิน</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ border: '1px solid #000' }}>จำนวนเงินต้น</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #000' }}>{toFloat(data?.principle)}</TableCell>
                  <TableCell sx={{ border: '1px solid #000' }}>จำนวนเงินต้น</TableCell>
                  <TableCell sx={{ textAlign: 'right', border: '1px solid #000' }}>{toFloat(data?.principle_paid)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: '1px solid #000' }}>ดอกเบี้ย</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #000' }}>{toFloat(Math.max(0, data?.total_interest))}</TableCell>
                  <TableCell sx={{ border: '1px solid #000' }}>ดอกเบี้ย</TableCell>
                  {/* <TableCell sx={{ textAlign: 'right', border: '1px solid #000' }}>{toFloat(Math.max(0, Number(data?.interest_paid) - (Math.max(0, Number(data?.interest_installment) - Number(data?.interest_due)))))}</TableCell> */}
                  <TableCell sx={{ textAlign: 'right', border: '1px solid #000' }}>
                    {typeFlatrate 
                      ? toFloat(Math.max(0, Number(data?.interest_paid)))
                      : toFloat(Math.max(0, Number(data?.interest_paid) - (Math.max(0, Number(data?.interest_installment) - Number(data?.interest_due)))))
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: '1px solid #000' }}>ดอกเบี้ยผิดนัด</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #000' }}>0.00</TableCell>
                  <TableCell sx={{ border: '1px solid #000' }}>ดอกเบี้ยผิดนัด</TableCell>
                  {/* <TableCell sx={{ textAlign: 'right', border: '1px solid #000' }}>{toFloat(Math.max(0, Number(data?.interest_installment) - Number(data?.interest_due)))}</TableCell> */}
                  <TableCell sx={{ textAlign: 'right', border: '1px solid #000' }}>
                    {typeFlatrate 
                      ? toFloat(0)
                      : toFloat(Math.max(0, Number(data?.interest_installment) - Number(data?.interest_due)))
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: '1px solid #000' }}>ค่าธรรมเนียม / เบี้ยปรับ</TableCell>
                  <TableCell sx={{ textAlign: 'center', border: '1px solid #000' }}>0.00</TableCell>
                  <TableCell sx={{ border: '1px solid #000' }}>ค่าธรรมเนียม / เบี้ยปรับ</TableCell>
                  <TableCell sx={{ textAlign: 'right', border: '1px solid #000' }}>{toFloat(data?.delay_charge_paid)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} sx={{ border: 'none' }}></TableCell>
                  <TableCell sx={{ border: '1px solid #000' }}>รวมจำนวนเงินที่ชำระ</TableCell>
                  <TableCell sx={{ textAlign: 'right', border: '1px solid #000' }}>{toFloat(data?.paid)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* ใบแจ้งหนี้งวดต่อไป */}
          <TableContainer>
            <Box sx={{ bgcolor: '#000', color: '#fff', p: 1, mt: 4, }}>
              <Typography variant="body2">ใบแจ้งหนี้งวดต่อไป</Typography>
            </Box>
            <Table size="small">
              <TableBody>
                {[
                  { label: 'วงเงินกู้', value: toFloat(data?.amount) },
                  { label: 'เงินต้น', value: toFloat(nextInstallmentData?.principle_next_due) },
                  { 
                    label: (
                      <span style={{ whiteSpace: 'nowrap' }}>
                        ดอกเบี้ย (คำนวณสิ้นสุดวันที่
                        <span style={{
                          display: 'inline-block',
                          position: 'relative',
                          width: '100px',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            right: '0',
                            top: '-1px',
                            fontSize: '0.9em'
                          }}>
                            {toDate(data?.installment_next_due,1)}
                          </span>
                          .................................
                        </span>
                        ตามวันที่แจ้งหนี้ 
                        <span style={{
                          display: 'inline-block',
                          position: 'relative',
                          width: '100px',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            right: '0',
                            top: '-1px',
                            fontSize: '0.9em'
                          }}>
                            {toDate(data?.installment_next_due,1)}
                          </span>
                          .................................)
                        </span>
                        
                      </span>
                    ), 
                    value: toFloat(nextInstallmentData?.interest_next_due)
                  },
                  { label: 'ดอกเบี้ยผิดนัดชำระ (คำนวณสิ้นสุดวันที่ ....ตามวันที่แจ้งหนี้....)', value: "0.00" },
                  { label: 'ค่าธรรมเนียม / ค่าปรับ', value: toFloat('0.00') },
                  { label: 'รวมเงินที่ต้องชำระ', value: toFloat(nextInstallmentData?.total_amount_next_due) },
                ].map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: '1px solid #000' }}>{row.label}</TableCell>
                    <TableCell sx={{ textAlign: 'right', border: '1px solid #000' }}>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ข้อควรระวัง */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', textDecoration: 'underline' }}>ข้อควรระวัง</Typography>
            <Typography variant="body2" sx={{ ml: 2, mt: 1 }}>• กรุณาตรวจสอบความถูกต้อง หากมีข้อสงสัยใดๆ โปรดติดต่อกลับภายใน 7 วันก่อนครบกำหนดชำระเงิน</Typography>
            <Typography variant="body2" sx={{ ml: 2, mt: 1 }}>• เพื่อรักษาสิทธิประโยชน์ของท่านสูงสุด</Typography>
            <Typography variant="body2" sx={{ ml: 2, mt: 1 }}>• ดอกเบี้ยและค่าธรรมเนียมการใช้วงเงิน คิดตั้งแต่วันที่ได้รับเงินกู้ โดยหากผิดนัดชำระจะถูกคิดดอกเบี้ยและค่าติดตามทวงถามเพิ่ม</Typography>
            <Typography variant="body2" sx={{ ml: 2, mt: 1 }}>• ลูกค้าสามารถชำระเงินสดและเงินโอน ได้ที่สำนักงานใหญ่หรือสาขาของบริษัทฯ หรือ ........... 02 ... .........</Typography>
            <Box sx={{ bgcolor: '#f0f0f0', p: 2, mt: 1, mb: 1, textAlign: 'center', mx: 5, }}>
              <Typography variant="body2">หากท่านประสงค์จะชำระบัญชีสินเชื่อเพื่อปิดบัญชีก่อนกำหนดตามสัญญา ขอให้ท่านติดต่อ ................... พนักงานก่อน ไม่น้อยกว่า 15 วัน</Typography>
            </Box>
          </Box>

          {/* แบบฟอร์มชำระ */}
          {/* <Typography variant="body2" sx={{ mt: 1, mb: 1, fontSize: '1rem', fontWeight: 'bold' }}>แบบฟอร์มการชำระเงิน</Typography>
          <Box sx={{ display: 'flex', height: 'auto' }}>
            <Box sx={{ width: '80px', bgcolor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', whiteSpace: 'nowrap', pr: 4 }}>
                ชำระผ่าน
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', whiteSpace: 'nowrap', pl: 4 }}>
                Mobile
              </Typography>
            </Box>
            <Box sx={{ width: '25%', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 5, ml: 1 }}>
            {data?.qrcode ? <img src={`${import.meta.env.VITE_BASE}/file/${data?.qrcode}`} width={150} height={150} alt='qrcode'/> : <Typography sx={{ fontSize: '2.5rem' }}>QR Code</Typography>}
            </Box>
            <Box sx={{ width: '80px', bgcolor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', whiteSpace: 'nowrap', pr: 4 }}>
                ชำระผ่าน
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', whiteSpace: 'nowrap', pl: 4 }}>
              <Typography sx={{ fontSize: '1rem' }}>บาร์โค้ด</Typography>
              </Typography>
              {data?.qrcode ?
              <Stack sx={{pl:4}}>
               <img src={`${import.meta.env.VITE_BASE}/file/${data?.barcode}`} width={380} height={45} alt='qrcode'/>
               </Stack>
                : 
                null
              //   <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', whiteSpace: 'nowrap', pl: 4 }}>
              // <Typography sx={{ fontSize: '1rem' }}>บาร์โค้ด</Typography>
              // </Typography>
              }
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', pb: 1, pr: 1, pl: 1, ml: 1, border: '1px solid black' }}>
              <Box sx={{ bgcolor: '#f0f0f0', p: 2, ml: 5, mr: 5, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: '0.7rem', textAlign: 'center' }}>
                  สแกนชำระได้ง่ายผ่านแอปธนาคาร และจุดบริการต่างๆ
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 3, fontSize: '1rem', textAlign: 'left' }}>
            (โปรดเก็บค่าธรรมเนียมจากผู้ชำระเงิน)
          </Typography> */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Installment;
