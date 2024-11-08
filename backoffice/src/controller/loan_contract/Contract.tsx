import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Box, Divider, Stack, Typography, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import LoadScreen from "@/component/LoadScreen";
import * as Icons from "@mui/icons-material";

function Contract({ loanData }) {

  const { loan_number } = useParams();
  const { auth, AddAlert } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const { toTHB, toDate, toFloat, calcurateAge, NumberToThaiWords } =
    useContext(ToolsContext);
  const [load, setLoad] = useState(false);
  const [loan, setLoan] = useState<any>();

  const [page1, setPage1] = useState("");
  const [page2, setPage2] = useState("");
  const [page3, setPage3] = useState("");

  const toPage1 = useRef(null);
  const toPage2 = useRef(null);
  const toPage3 = useRef(null);
  const printRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (loan_number) {
      Get(`loan/list/all?search=${loan_number}`)
        .then((response) => {
          setLoan(response.data.data[0]);
          setLoad(true);
        })
        .catch((error) => {
          // AddAlert("ไม่พบข้อมูลสินเชื่อ", "error");
          setLoan(null);
          setLoad(true);
        });
    } else {
      setLoad(true);
    }
  }, [loan_number]);

  useEffect(() => {
    if (load) {
      generatePages();
    }
  }, [load]);

  const generatePages = async () => {
    try {
      await capturePage(toPage1.current, setPage1);
      await capturePage(toPage2.current, setPage2);
      await capturePage(toPage3.current, setPage3);
    } catch (error) {
      // AddAlert(error);
    }
  };

  const capturePage = async (element, setPage) => {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png", 1.0);
    setPage(imgData);
  };


  // const addPrintStyles = () => {
  //   const style = document.createElement("style");
  //   style.innerHTML = `
  //     @media print {
  //       * {
  //         overflow: visible !important;
  //       }
  //       html, body {
  //         height: auto;
  //       }
  //       .MuiDialog-root {
  //         overflow: visible !important;
  //       }
  //       .print-button {
  //         display: none !important;
  //       }
  //     }
  //   `;
  //   document.head.appendChild(style);
  // };

  const handlePrint = () => {
    if (printRef.current) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            ${printRef.current.innerHTML}
          </body>
        </html>
      `);
      doc.close();

      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // ลบ iframe หลังจากพิมพ์เสร็จ
      iframe.onload = () => {
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
      };
    }
  };


  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
        }}
      >
        {!page1 ? (
          <LoadScreen />
        ) : (
          <Box
            ref={printRef}
            sx={{
              "& > img": {
                display: "block",
                width: "100%",
              },
            }}
          >
            <img src={page1} alt="Contract Page 1" />
            <img src={page2} alt="Contract Page 2" />
            <img src={page3} alt="Contract Page 3" />
          </Box>
        )}
      </Box>
      {/* Print Button Section */}
      <Box
        sx={{
          position: "fixed",
          top: 40,
          right: 235,
          zIndex: 1000
        }}
        className="print-button"
      >
        <Button
          variant="contained"
          onClick={handlePrint}
          startIcon={<Icons.Print />}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          พิมพ์เอกสาร
        </Button>
      </Box>

      {/* Hidden Content for Capturing */}
      <Box
        // sx={{
        //   position: "fixed",
        //   top: "-10000px",
        //   left: "-10000px",
        // }}
      >
        <Stack
          ref={toPage1}
          sx={{
            bgcolor: "#fff",
            width: "210mm",
            height: "297mm",
            color: "#000",
            textAlign: "start",
          }}
        >
          <Stack gap={1} sx={{ m: 5, color: "#000" }}>
            <Box sx={{ textAlign: "center", bgcolor: "rgba(219,174,91,1)", p: 2 }}>
              <Typography variant="h5" >สัญญากู้ยืมเงิน</Typography>
            </Box>
            <Stack direction="row" gap={4}>
              <Stack direction="row" sx={{ flex: 2, gap: 1, mt: 3 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>เลขที่สัญญา</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.loan_number || ""}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 2, gap: 1, mt: 3 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ทำที่ </Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  บริษัท มันนี่ ฟอร์ยู จำกัด
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={4}>
              <Stack direction="row" sx={{ flex: 2, gap: 1 }}></Stack>

              <Stack direction="row" sx={{ flex: 2, gap: 1, mt: 3 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>วันที่ </Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.created_at ? toDate(loanData.created_at).slice(0, 13) : ""}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2} sx={{ mt: 2 }}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8, pl: 15 }}>
                  ข้าพเจ้า
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.titlename || ""} {loanData?.firstname || ""} {loanData?.lastname || ""}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  ถือบัตรประจำตัวประชาชนเลขที่{" "}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.citizen_id || ""}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>อายุ </Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.birthdate ? calcurateAge(loanData?.birthdate).slice(0, 5) : ""}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  ที่อยู่ตามทะเบียนบ้านเลขที่
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.houseno || ""}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>หมู่ที่</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.villageno || ""}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ตรอก/ซอย</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.lane || ""}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ถนน</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.road || ""}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ตำบล/แขวง</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.subdistrict || ""}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>อำเภอ/เขต</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.district || ""}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>จังหวัด</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.province || ""}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  สถานที่ทำงานปัจจุบัน บริษัท
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.job_company_name || ""}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>เลขที่</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.job_houseno || ""}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>หมู่ที่</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.job_villageno || ""}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ตรอก/ซอย</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.job_lane || ""}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ถนน</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.job_road || ""}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ตำบล/แขวง</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.job_subdistrict || ""}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>อำเภอ/เขต</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.job_district}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>จังหวัด</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {loanData?.job_province}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  ในฐานะ "ผู้กู้" ฝ่ายหนึ่ง กับบริษัท
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  บริษัท มันนี่ ฟอร์ยู จำกัด
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2}>
              <Stack direction="row" sx={{ flex: 1, gap: 1, mt: 2 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>มีสถานประกอบการอยู่ที่</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  2/69 ซ.สุขุมวิท 42 แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร 10110
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  ในฐานะ "ผู้ให้กู้" อีกฝ่ายหนึ่ง
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2} sx={{ mt: 5 }}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  คู่ตกลงทั้งสองฝ่ายตกลงทำสัญญา
                  โดยผู้กู้ตกลงยินยอมผูกพันตามข้อกำหนดและเงื่อนไขสัญญาสินเชื่อตามรายละเอียดดังต่อไปนี้
                </Typography>
              </Stack>
            </Stack>
            <ol style={{ margin: 0, listStyle: "none", paddingLeft: "2em" }}>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      <strong>1. จำนวนเงินที่กู้ </strong>
                      ผู้กู้ตกลงขอสินเชื่อจากผู้ให้กู้ในรูปแบบของเงินกู้ยืม
                      ตามรายละเอียดที่ระบุไว้ในใบสมัครสินเชื่อ
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      มันนี่ ฟอร์ยูและสัญญานี้
                      โดยผู้กู้ได้กู้ยืมเงินจากผู้ให้กู้ เป็นจำนวนเงิน
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ borderBottom: "1px solid #000000", minWidth: "100px" }}
                    >
                      {loanData?.amount ? `${toFloat(loanData?.amount)} บาท` : ""}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ borderBottom: "1px solid #000000", minWidth: "100px" }}
                    >
                      {loanData?.amount ? NumberToThaiWords(loanData?.amount) : ""}
                    </Typography>
                  </Stack>
                </Stack>
              </li>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      <strong>2. การเบิกใช้สินเชื่อ </strong>
                      ผู้ให้กู้จะมอบเงินกู้ให้แก่ผู้กู้ทั้งจำนวนเพียงครั้งเดียวในวันที่ผู้ให้กู้กำหนด
                      โดยผู้ให้กู้จะนำเงินเข้าบัญชีธนาคารของผู้กู้ตามที่ระบุไว้ในใบสมัคร
                      และ/หรือ ส่งมอบเงินกู้
                      โดยวิธีการอื่นใดตามที่ทั้งสองฝ่ายตกลงกัน ทั้งนี้ ภายใต้
                      รูปแบบ วิธีการ และเงื่อนไขที่ผู้ให้กู้กำหนด
                      และเมื่อผู้ให้กู้ได้โอนเงินไปยังบัญชีของผู้กู้
                      หรือดำเนินการอื่นใดอันเป็นการส่งมอบเงินกู้ตามวิธีการอื่นใดที่ได้ตกลงกันแล้ว
                      ให้ถือว่าผู้กู้ได้รับเงินกู้จากผู้ให้กู้ครบถ้วนถูกต้องแล้วทั้งจำนวนที่ได้รับอนุมัติ
                      แม้ว่าผู้กู้จะยังไม่ได้เบิกถอน หรือนำไปใช้จ่าย
                      และ/หรือดำเนินการใดๆก็ตาม
                    </Typography>
                  </Stack>
                </Stack>
              </li>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      <strong>3. ดอกเบี้ย </strong>
                      อัตรากำไรจากการให้สินเชื่อ ดอกเบี้ยผิดนัดชำระ ค่าปรับ
                      ค่าบริการ หรือค่าธรรมเนียมอื่นใด ผู้กู้ตกลงยินยอมให้
                      ผู้ให้กู้ คิดดอกเบี้ยจากจำนวนเงินที่กู้ดังกล่าวใน ข้อ 1
                      ในอัตราดอกเบี้ยไม่เกินร้อยละ 36 ต่อปี แบบ{loanData?.type_interest === "flatrate" ? "คงที่" : "ลดต้นลดดอก"}
                      นับตั้งแต่วันที่ทำสัญญาฉบับนี้เป็นต้นไป
                      จนกว่าจะชำระเงินกู้เสร็จสิ้น
                      และในกรณีผู้กู้ตกเป็นผู้ผิดนัด ยินยอมให้คิดดอกเบี้ย
                      ระหว่างผิดนัดชำระหนี้ ในอัตราไม่เกินร้อยละ 36 ต่อปี
                      รวมทั้งผู้กู้รับทราบและตกลงว่า อัตราดอกเบี้ย
                      อัตรากำไรจากการให้สินเชื่อ ดอกเบี้ยผิดนัดชำระ ค่าปรับ
                      ค่าบริการ หรือค่าธรรมเนียมอื่นใด อาจมีการเปลี่ยนแปลงได้
                      โดยเมื่อมีการเปลี่ยนแปลง
                      ผู้ให้กู้จะแจ้งให้ทราบโดยปิดประกาศ ณ
                      สถานที่ประกอบธุรกิจของผู้กู้ และ
                      แจ้งเป็นหนังสือไปยังผู้กู้ล่วงหน้าอย่างน้อย 30 (สามสิบ)วัน
                      ก่อนการเปลี่ยนแปลงจะมีผลบังคับใช้
                    </Typography>
                  </Stack>
                </Stack>
              </li>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      <strong>4. การชำระเงินต้นและดอกเบี้ย </strong>
                      ผู้กู้ตกลงจะชำระเงินต้นและดอกเบี้ยให้แก่ผู้ให้กู้
                      โดยผ่อนชำระเป็นงวด แบบลดต้นลดดอก
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      โดยกำหนดผ่อนชำระทุกเดือน เดือนละไม่น้อยกว่า
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ borderBottom: "1px solid #000000", minWidth: "100px" }}
                    >
                      {loanData?.per_installment ? `${toFloat(loanData?.per_installment)} บาท` : ""}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ borderBottom: "1px solid #000000", minWidth: "100px" }}
                    >
                      {loanData?.per_installment ? NumberToThaiWords(loanData?.per_installment) : ""}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>เป็นระยะเวลา</Typography>
                    <Typography
                      variant="body1"
                      sx={{ borderBottom: "1px solid #000000", minWidth: "100px" }}
                    >
                      {loanData?.total_installment ? `${loanData?.total_installment} งวดเดือน` : ""}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>นับตั้งแต่งวดวันที่</Typography>
                    <Typography
                      variant="body1"
                      sx={{ borderBottom: "1px solid #000000", minWidth: "100px" }}
                    >
                      {loanData?.startDate ? toDate(loanData?.startDate, 1) : ""}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      เป็นต้นไป และจะชำระหนี้เงินกู้ให้เสร็จสิ้น
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ภายในวันที่</Typography>
                    <Typography
                      variant="body1"
                      sx={{ borderBottom: "1px solid #000000", minWidth: "100px" }}
                    >
                      {loanData?.endDate ? toDate(loanData?.endDate, 1) : ""}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      ผู้กู้ตกลงให้บริษัทเรียกเก็บเงินผ่อนชำระ
                      โดยวิธีการหักเงินจากบัญชีธนาคารของผู้กู้
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      ผู้กู้ยินยอมรับผิดชอบค่าใช้จ่ายที่ธนาคารเรียกเก็บเป็นค่าธรรมเนียมการหักบัญชีนั้น
                      ทั้งนี้
                      ผู้กู้ตกลงและยอมรับว่าในการชำระเงินต้นคืนและดอกเบี้ยงวดสุดท้าย
                      ผู้กู้จะต้องชำระเงินส่วนที่เหลือทั้งหมดพร้อมดอกเบี้ยและค่าใช้จ่ายอื่นๆ
                      ทั้งหมด(หากมี)ให้แก่ผู้ให้กู้จนครบถ้วน ผู้กู้ตกลงว่า
                      จำนวนเงินใดๆ ที่ถึงกำหนดชำระแก่ผู้ให้กู้ตามสัญญานี้
                      ผู้กู้ต้องชำระโดยไม่มีการหักจำนวนเงินใดๆ หรือ หักภาษี ณ
                      ที่จ่าย หรือหักกลบลบหนี้ หรือค่าธรรมเนียม
                      หรือค่าใช้จ่ายทุกชนิด
                    </Typography>
                  </Stack>
                </Stack>
              </li>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      <strong>5. ค่าธรรมเนียมและค่าใช้จ่ายอื่นๆ </strong>
                      ผู้กู้ตกลงและยินยอมชำระค่าใช้จ่ายในการติดตามและทวงถามหนี้
                      ในอัตราไม่เกิน 50 บาท ต่อเดือน
                      ทั้งนี้ยังไม่รวมถึงค่าทนายความ ค่าใช้จ่ายในชั้นบังคับคดี
                      และค่าใช้จ่ายทุกประการที่ผู้ให้กู้ต้องเสียไปในการฟ้องร้องบังคับให้ชำระหนี้ตามกฎหมาย
                      ซึ่งผู้กู้ต้องรับผิดชอบ
                    </Typography>
                  </Stack>
                </Stack>
              </li>
            </ol>

            <Box sx={{ width: "100%", height: "150px" }}></Box>
          </Stack>
        </Stack>
      </Box>
      <Box
        // sx={{
        //   position: "fixed",
        //   top: 0,
        //   left: 0,
        //   width: "100vw",
        //   height: "100vh",
        //   zIndex: -2,
        // }}
      >
        <Stack
          ref={toPage2}
          sx={{
            bgcolor: "#fff",
            width: "210mm",
            height: "297mm",
            color: "#000",
            textAlign: "start",
          }}
        >
          <Stack gap={1} sx={{ m: 5, color: "#000" }}>
            <Box sx={{ textAlign: "center", bgcolor: "rgba(219,174,91,1)", p: 2 }}>
              <Typography variant="h5">สัญญากู้ยืมเงิน (ต่อ)</Typography>
            </Box>
            <ol style={{ margin: 0, listStyle: "none", paddingLeft: "2em" }}>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      <strong>6. หลักประกัน </strong>
                      เพื่อเป็นหลักประกันในการกู้ยืมเงินครั้งนี้ผู้กู้ได้มอบ
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                    >
                      {loanData?.guarantee || ''}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      ซึ่งเป็นกรรมสิทธิ์ของผู้กู้เพียงลำพังให้แก่ผู้ให้กู้ไว้เพื่อเป็นหลักประกันการชำระหนี้เงินกู้จำนวนดังกล่าวด้วย
                      และผู้กู้ขอรับรองว่าหลักประกันที่ได้นำมามอบเป็นหลักประกันไว้นี้เป็นหลักประกันของผู้กู้เอง
                      และมิได้นำไปประกันหรือมีภาระติดพันในหนี้สินรายอื่นเลย และ
                      ขอรับรองว่าในระหว่างที่เอาหลักประกันดังกล่าวมามอบให้ยึดเป็นประกันเงินกู้รายนี้แล้ว
                      ผู้กู้จะไม่จำหน่ายจ่ายโอน
                      หรือก่อให้มีภาระผูกพันแก่หลักประกันที่ประกันเงินกู้รายนี้
                    </Typography>
                  </Stack>
                </Stack>
              </li>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      <strong>7. เหตุผิดนัด </strong>
                      หากปรากฎข้อเท็จจริงหรือมีพฤติการณ์อย่างหนึ่งอย่างใดดังต่อไปนี้
                      ซึ่งเรียกว่า "เหตุผิดนัด" ให้หนี้ทั้งหมด
                      ตามสัญญานี้ถึงกำหนดชำระโดยพลัน และผู้กู้จะต้องชำระเงินต้น
                      ดอกเบี้ย ค่าธรรมเนียมและค่าใช้จ่ายใดๆ
                      ตามสัญญานี้แก่ผู้ให้กู้โดยทันที
                    </Typography>
                  </Stack>
                </Stack>
              </li>
              {/* <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (1) ผู้กู้ผิดนัดไม่ชำระหนี้ตามสัญญาฉบับนี้เมื่อถึงกำหนดชำระ
                  ไม่ว่างวดหนึ่งงวดใดหรือหลายงวด หรือเมื่อสิ้นสุดการต่ออายุสัญญา
                  หรือไม่ปฎิบัติตามข้อกำหนดของสัญญานี้
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (2) ข้อมูลที่ปรากฎในใบสมัครสินเชื่อ คำร้อง คำยืนยัน
                  หรือข้อมูลอื่นใด
                  ที่ผู้กู้ได้ให้ไว้เกี่ยวกับการขอเงินสินเชื่อจากผู้ให้กู้ไม่ถูกต้อง
                  หรือเป็นเท็จ หรือทำให้ผู้ให้กู้เข้าใจผิดในสาระสำคัญ
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (3) เมื่อปรากฎว่าเอกสาร หลักฐาน หนังสือ คำรับรอง
                  ที่ผู้กู้มอบให้แก่ผู้ให้กู้อันเกี่ยวกับสินเชื่อมีข้อความเป็นเท็จ
                  หรือ เป็นเอกสารปลอม หรือไม่มีผลบังคับตามกฎหมาย
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (4) มีการดำเนินกระบวนการพิจารณาของศาลหรือมีการฟ้องร้องผู้กู้
                  หรือต่อทรัพย์สินของผู้กู้
                  หรือมีการแต่งตั้งเจ้าพนักงานพิทักษ์ทรัพย์
                  หรือเจ้าหน้าที่อื่นที่คล้ายคลึงกันในส่วนที่เกี่ยวกับทรัพย์สินของผู้กู้
                  หรือมีคำสั่งศาล
                  เพื่อการบังคับคดีตามคำพิพากษาต่อทรัพย์สินเช่นว่านั้น
                  ไม่ว่าทั้งหมดหรือบางส่วน
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (5) ผู้กู้ถูกฟ้องหรือตกเป็นบุคคลล้มละลาย
                  หรือตกเป็นบุคคลไร้ความสามารถ หรือบุคคลเสมือนไร้ความสามารถ
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (6)
                  ผู้ให้กู้ได้พิจารณาว่ามีการเปลี่ยนแปลงซึ่งมีผลกระทบอย่างร้ายแรงต่อสถานะทางการเงินของผู้กู้
                  หากมีกรณีดังกล่าวเกิดขึ้น
                  ให้ถือว่าผู้กู้ตกเป็นผู้ผิดนัดชำระหนี้
                  โดยผู้กู้ตกลงยินยอมให้ผู้ให้กู้คิดค่าธรรมเนียมผิดนัดชำระหนี้
                  และ/หรือ ค่าใช้จ่ายในการติดตามทวงถามหนี้ ทั้งนี้
                  นับตั้งแต่วันผิดนัดเป็นต้นไป
                  จนกว่าจะชำระหนี้คืนให้แก้ผู้ให้กู้เสร็จสิ้น แต่ทั้งนี้
                  ไม่ตัดสิทธิผู้ให้กู้ที่จะบอกเลิกสัญญาและเรียกร้องให้ผู้กู้
                  ชำระหนี้ต้นเงินกู้ ดอกเบี้ยที่ค้างชำระ ค่าธรรมเนียมต่างๆ
                  และค่าใช้จ่ายใดๆ ที่ผู้กู้มีหน้าที่ต้องชำระให้แก่ผู้ให้กู้
                  รวมทั้งหนี้ทุกชนิดทุกจำนวน
                  ที่ผู้กู้มีต่อผู้ให้กู้ตามสัญญาฉบับนี้คืนทันที และ
                  ผู้กู้ตกลงยินยอมรับผิดชดใช้ค่าเสียหายที่ผู้ให้กู้ได้รับ
                  เช่นค่าใช้จ่ายในการบอกกล่าวเตือน การเรียกร้องทวงถาม
                  การดำเนินคดี และบังคับคดีให้แก่ผู้ให้กู้
                  ทั้งนี้ผู้ให้กู้จะมีหนังสือแจ้งโดยไปรษณีย์ลงทะเบียนตอบรับให้ผู้กู้ทราบล่วงหน้าไม่น้อยกว่า
                  20 วัน
                </Typography>
              </li> */}
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (1)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    ผู้กู้ผิดนัดไม่ชำระหนี้ตามสัญญาฉบับนี้เมื่อถึงกำหนดชำระ
                    ไม่ว่างวดหนึ่งงวดใดหรือหลายงวด หรือเมื่อสิ้นสุดการต่ออายุสัญญา
                    หรือไม่ปฎิบัติตามข้อกำหนดของสัญญานี้
                  </Typography>
                </Stack>
              </li>
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (2)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    ข้อมูลที่ปรากฎในใบสมัครสินเชื่อ คำร้อง คำยืนยัน หรือข้อมูลอื่นใด
                    ที่ผู้กู้ได้ให้ไว้เกี่ยวกับการขอเงินสินเชื่อจากผู้ให้กู้ไม่ถูกต้อง
                    หรือเป็นเท็จ หรือทำให้ผู้ให้กู้เข้าใจผิดในสาระสำคัญ
                  </Typography>
                </Stack>
              </li>
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (3)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    เมื่อปรากฎว่าเอกสาร หลักฐาน หนังสือ คำรับรอง
                    ที่ผู้กู้มอบให้แก่ผู้ให้กู้อันเกี่ยวกับสินเชื่อมีข้อความเป็นเท็จ
                    หรือ เป็นเอกสารปลอม หรือไม่มีผลบังคับตามกฎหมาย
                  </Typography>
                </Stack>
              </li>
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (4)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    มีการดำเนินกระบวนการพิจารณาของศาลหรือมีการฟ้องร้องผู้กู้
                    หรือต่อทรัพย์สินของผู้กู้ หรือมีการแต่งตั้งเจ้าพนักงานพิทักษ์ทรัพย์
                    หรือเจ้าหน้าที่อื่นที่คล้ายคลึงกันในส่วนที่เกี่ยวกับทรัพย์สินของผู้กู้
                    หรือมีคำสั่งศาล เพื่อการบังคับคดีตามคำพิพากษาต่อทรัพย์สินเช่นว่านั้น
                    ไม่ว่าทั้งหมดหรือบางส่วน
                  </Typography>
                </Stack>
              </li>
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (5)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    ผู้กู้ถูกฟ้องหรือตกเป็นบุคคลล้มละลาย
                    หรือตกเป็นบุคคลไร้ความสามารถ หรือบุคคลเสมือนไร้ความสามารถ
                  </Typography>
                </Stack>
              </li>
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (6)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    ผู้ให้กู้ได้พิจารณาว่ามีการเปลี่ยนแปลงซึ่งมีผลกระทบอย่างร้ายแรงต่อสถานะทางการเงินของผู้กู้
                    หากมีกรณีดังกล่าวเกิดขึ้น ให้ถือว่าผู้กู้ตกเป็นผู้ผิดนัดชำระหนี้
                    โดยผู้กู้ตกลงยินยอมให้ผู้ให้กู้คิดค่าธรรมเนียมผิดนัดชำระหนี้
                    และ/หรือ ค่าใช้จ่ายในการติดตามทวงถามหนี้ ทั้งนี้
                    นับตั้งแต่วันผิดนัดเป็นต้นไป จนกว่าจะชำระหนี้คืนให้แก่ผู้ให้กู้เสร็จสิ้น
                    แต่ทั้งนี้ ไม่ตัดสิทธิผู้ให้กู้ที่จะบอกเลิกสัญญาและเรียกร้องให้ผู้กู้
                    ชำระหนี้ต้นเงินกู้ ดอกเบี้ยที่ค้างชำระ ค่าธรรมเนียมต่างๆ
                    และค่าใช้จ่ายใดๆ ที่ผู้กู้มีหน้าที่ต้องชำระให้แก่ผู้ให้กู้
                    รวมทั้งหนี้ทุกชนิดทุกจำนวน ที่ผู้กู้มีต่อผู้ให้กู้ตามสัญญาฉบับนี้คืนทันที
                    และผู้กู้ตกลงยินยอมรับผิดชดใช้ค่าเสียหายที่ผู้ให้กู้ได้รับ
                    เช่นค่าใช้จ่ายในการบอกกล่าวเตือน การเรียกร้องทวงถาม
                    การดำเนินคดี และบังคับคดีให้แก่ผู้ให้กู้
                    ทั้งนี้ผู้ให้กู้จะมีหนังสือแจ้งโดยไปรษณีย์ลงทะเบียนตอบรับให้ผู้กู้ทราบล่วงหน้าไม่น้อยกว่า 20 วัน
                  </Typography>
                </Stack>
              </li>
            </ol>
            <ol style={{ margin: 0, listStyle: "none", paddingLeft: "2em" }}>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      <strong>8. การติดตามทวงถามหนี้ </strong>
                      ผู้ให้กู้จะติดตามทวงถามหนี้จากผู้กู้ หรือ
                      ผู้ค้ำประกัน(ถ้ามี) ตามพระราชบัญญัติการทวงถามหนี้ พ.ศ.2558
                      โดยวิธีการดังต่อไปนี้
                    </Typography>
                  </Stack>
                </Stack>
                <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      (1) ติดตามทวงถามหนี้ทางโทรศัพท์ ข้อความสั้นๆ (SMS)
                      ข้อความเสียง หรือข้อความทางแอปพลิเคชั่นไลน์
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      (2)
                      ส่งหนังสือบอกกล่าวทวงถามให้แก่ผู้กู้หรือผู้คำประกัน(ถ้ามี)
                      โดยไปรษณีย์ลงทะเบียนหรือไม่ลงทะเบียน
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      (3) ลงพื้นที่ติดตามทวงถามหนี้
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      (4) ฟ้องร้องดำเนินคดีตามกฎหมายจนถึงที่สุด
                    </Typography>
                  </li>
                </ol>
              </li>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      <strong>9. การโอนสิทธิเรียกร้อง </strong>
                      ในกรณีที่ผู้ให้กู้จะจำหน่าย หรือโอนหนี้
                      หรือโอนสิทธิเรียกร้องในสัญญาฉบับนี้
                      หรือสิทธิในหลักประกันอื่นใดที่มีอยู่เกี่ยวพันกับหนี้
                      หรือสิทธิเรียกร้องดังกล่าวของผู้ให้กู้ไม่ว่าทั้งหมดหรือแต่บางส่วนให้แก่บุคคลหรือนิติบุคคลอื่นก็ตาม
                      ผู้ให้กู้และผู้รับโอนสิทธิจะแจ้งเป็นหนังสือไปยังผู้กู้ให้ทราบล่วงหน้าไม่น้อยกว่าหนึ่งงวดของการชำระเงินกู้
                      หรือดอกเบี้ย หรือ งวดของการคิดดอกเบี้ย
                      หรือได้รับความยินยอมจากผู้กู้ก่อน
                      ยกเว้นในกรณีที่มีกฎหมายกำหนดไว้โดยเฉพาะว่าไม่ต้องทำการบอกกล่าวหรือแจ้งผู้กู้ทราบล่วงหน้า
                      หรือขอความยินยอมจากผู้กู้
                    </Typography>
                  </Stack>
                </Stack>
              </li>
              <li>
                <Stack direction="row" gap={2}>
                  <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      <strong>10. เบ็ดเตล็ด </strong>
                    </Typography>
                  </Stack>
                </Stack>
                <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {/* <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      (1)
                      หากข้อกำหนดหรือเงื่อนไขส่วนใดส่วนหนึ่งของสัญญาฉบับนี้ไม่มีผลใช้บังคับ
                      หรือเป็นโมฆะ หรือไม่สมบูรณ์ หรือไม่ชอบด้วยกฎหมาย
                      ให้ถือว่าข้อกำหนดหรือเงื่อนไขดังกล่าวไม่มีผลใช้บังคับหรือเป็นโมฆะเฉพาะส่วน
                      และให้ถือว่าข้อกำหนดและเงื่อนไขส่วนอื่นๆ
                      ยังคงมีความสมบูรณ์และยังคงมีผลใช้บังคับอยู่
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      (2) ข้อกำหนดและเงื่อนไขต่างๆ
                      เกี่ยวกับการกู้ยืมเงินระหว่างผู้ให้กู้ และผู้กู้ที่ระบุในสัญญานี้
                      ให้บังคับและตีความตามกฎหมายของประเทศไทย
                    </Typography>
                  </li> */}
                  <li>
                    <Stack direction="row" alignItems="flex-start">
                      <Typography variant="body1" sx={{ minWidth: '20px' }}>
                        (1)
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                      >
                        หากข้อกำหนดหรือเงื่อนไขส่วนใดส่วนหนึ่งของสัญญาฉบับนี้ไม่มีผลใช้บังคับ
                        หรือเป็นโมฆะ หรือไม่สมบูรณ์ หรือไม่ชอบด้วยกฎหมาย
                        ให้ถือว่าข้อกำหนดหรือเงื่อนไขดังกล่าวไม่มีผลใช้บังคับหรือเป็นโมฆะเฉพาะส่วน
                        และให้ถือว่าข้อกำหนดและเงื่อนไขส่วนอื่นๆ ยังคงมีความสมบูรณ์และยังคงมีผลใช้บังคับอยู่
                      </Typography>
                    </Stack>
                  </li>
                  <li>
                    <Stack direction="row" alignItems="flex-start">
                      <Typography variant="body1" sx={{ minWidth: '20px' }}>
                        (2)
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                      >
                        ข้อกำหนดและเงื่อนไขต่างๆ เกี่ยวกับการกู้ยืมเงินระหว่างผู้ให้กู้
                        และผู้กู้ที่ระบุในสัญญานี้ ให้บังคับและตีความตามกฎหมายของประเทศไทย
                      </Typography>
                    </Stack>
                  </li>
                </ol>
              </li>
            </ol>
          </Stack>
        </Stack>
      </Box>
      <Box
        // sx={{
        //   position: "fixed",
        //   top: 0,
        //   left: 0,
        //   width: "100vw",
        //   height: "100%",
        //   zIndex: -2,
        // }}
      >
        <Stack
          ref={toPage3}
          sx={{
            bgcolor: "#fff",
            width: "210mm",
            height: "297mm",
            color: "#000",
            textAlign: "start",
          }}
        >
          <Stack gap={1} sx={{ m: 5, color: "#000" }}>
            <Box sx={{ textAlign: "center", bgcolor: "rgba(219,174,91,1)", p: 2 }}>
              <Typography variant="h5">สัญญากู้ยืมเงิน (ต่อ)</Typography>
            </Box>
            <ol style={{ margin: 0, listStyle: "none", paddingLeft: "2em" }}>
              {/* <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (3) ในการติดตามทวงถามกับผู้กู้
                  ผู้ให้กู้อาจมอบหมายให้บุคคลอื่นเรียกเก็บหนี้แทนผู้ให้กู้
                  โดยจะประกาศชื่อผู้ดำเนินการแทนผู้ให้กู้ไว้ที่สำนักงานใหญ่
                  โดยวิธีการและขั้นตอนการทวงถามหนี้จะปฏิบัติให้เป็นไปตามกฎหมายว่าด้วยการทวงถามหนี้หรือกฎหมายอื่นๆ
                  ในการติดตามทวงหนี้
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (4) ผู้กู้ยินยอมให้ผู้ให้กู้ทำการเปิดเผย สอบถาม ตรวจสอบ
                  บันทึกเปลี่ยนแปลง
                  และแก้ไขเพิ่มเติมของข้อมูลเครดิตต่อบริษัทข้อมูลเครดิตแห่งชาติ
                  จำกัด และบริษัทผู้ประกอบธุรกิจข้อมูลเครดิตอื่นใดที่อาจจัดตั้งขึ้นในอนาคตตามกฎหมายเกี่ยวกับข้อมูลเครดิต
                  และ/หรือข้อมูลอื่นใดของผู้กู้ซึ่งมีอยู่กับบริษัทข้อมูลเครดิตดังกล่าวได้ตลอดอายุของสัญญาฉบับนี้
                  ทั้งนี้การดำเนินการเกี่ยวกับข้อมูลเครดิตดังกล่าวจะต้องเป็นไปตามวัตถุประสงค์ของการใช้ข้อมูลเพื่อประโยชน์ในการวิเคราะห์สินเชื่อของผู้กู้ที่ให้ไว้กับผู้ให้กู้
                  รวมทั้งเพื่อประโยชน์ในการทบทวนสินเชื่อ ต่ออายุสัญญาสินเชื่อ
                  บริหารและป้องกันความเสี่ยง
                  และ/หรือเพื่อวัตถุประสงค์อื่นใดตามที่กฎหมายกำหนด ในกรณีนี้
                  ผู้กู้ยินยอมให้บริษัทข้อมูลเครดิตแห่งชาติ จำกัด
                  และบริษัทผู้ประกอบธุรกิจข้อมูลเครดิตอื่นใดที่อาจจัดตั้งขึ้นในอนาคตตามกฎหมายเปิดเผยข้อมูลเครดิตและข้อมูลอื่นใดของผู้กู้ให้แก่ผู้ให้กู้เพื่อวัตถุประสงค์ดังกล่าวข้างต้น
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (5)
                  ผู้ให้กู้สงวนสิทธิ์ในการแก้ไขเปลี่ยนแปลงเงื่อนไขของสัญญา
                  อัตราดอกเบี้ย เงื่อนไขในการคำนวณอัตราดอกเบี้ย
                  อัตราค่าธรรมเนียมผิดนัดชำระหนี้
                  อัตราค่าใช้จ่ายในการติดตามทวงถามหนี้
                  อัตราค่าธรรมเนียมและอัตราค่าบริการต่างๆ
                  ทั้งนี้ผู้ให้กู้จะมีหนังสือแจ้งโดยไปรษณีย์ลงทะเบียนตอบรับให้ผู้กู้ทราบล่วงหน้าไม่น้อยกว่า
                  30 วัน
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  (6) บรรดาหนังสือติดต่อ บอกกล่าว ทวงถาม
                  หรือหนังสืออื่นใดที่จะส่งให้แก่ผู้กู้โดยทางไปรษณีย์ลงทะเบียนตอบรับ
                  หากได้ส่งไปยังที่อยู่ที่ผู้กู้ให้ไว้กับผู้ให้กู้ในใบสมัครสินเชื่อซึ่งถือเป็นส่วนหนึ่งของสัญญาฉบับนี้
                  หรือเอกสารประกอบการสมัครสินเชื่อ
                  หรือตามที่อยู่ที่ผู้กู้ได้แจ้งเปลี่ยนแปลงเป็นหนังสือครั้งหลังสุด
                  ให้ถือว่าได้ส่งให้แก่ผู้กู้แล้วโดยชอบ ทั้งนี้
                  โดยไม่ต้องคำนึงถึงว่าจะมีผู้รับไว้หรือไม่
                  และแม้หากว่าส่งให้ไม่ได้เพราะผู้กู้ย้ายที่อยู่
                  หรือที่อยู่ที่กล่าวนี้เปลี่ยนแปลงไป หรือถูกรื้อถอนไป
                  โดยผู้กู้ไม่ได้แจ้งการย้าย หรือการเปลี่ยนแปลง หรือการรื้อถอนนั้นเป็นหนังสือ
                  ต่อผู้ให้กู้
                  หรือส่งให้ไม่ได้เพราะหาไม่พบสถานที่ที่ระบุไว้ข้างต้นก็ดี
                  ให้ถือว่าผู้กู้ได้รับทราบข้อความตามหนังสือติดต่อ บอกกล่าว
                  ทวงถามนั้นแล้วโดยชอบ
                </Typography>
              </li> */}
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (3)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    ในการติดตามทวงถามกับผู้กู้ ผู้ให้กู้อาจมอบหมายให้บุคคลอื่นเรียกเก็บหนี้แทนผู้ให้กู้
                    โดยจะประกาศชื่อผู้ดำเนินการแทนผู้ให้กู้ไว้ที่สำนักงานใหญ่
                    โดยวิธีการและขั้นตอนการทวงถามหนี้จะปฏิบัติให้เป็นไปตามกฎหมายว่าด้วยการทวงถามหนี้หรือกฎหมายอื่นๆ
                    ในการติดตามทวงหนี้
                  </Typography>
                </Stack>
              </li>
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (4)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    ผู้กู้ยินยอมให้ผู้ให้กู้ทำการเปิดเผย สอบถาม ตรวจสอบ บันทึกเปลี่ยนแปลง
                    และแก้ไขเพิ่มเติมของข้อมูลเครดิตต่อบริษัทข้อมูลเครดิตแห่งชาติ จำกัด
                    และบริษัทผู้ประกอบธุรกิจข้อมูลเครดิตอื่นใดที่อาจจัดตั้งขึ้นในอนาคตตามกฎหมายเกี่ยวกับข้อมูลเครดิต
                    และ/หรือข้อมูลอื่นใดของผู้กู้ซึ่งมีอยู่กับบริษัทข้อมูลเครดิตดังกล่าวได้ตลอดอายุของสัญญาฉบับนี้
                    ทั้งนี้การดำเนินการเกี่ยวกับข้อมูลเครดิตดังกล่าวจะต้องเป็นไปตามวัตถุประสงค์ของการใช้ข้อมูลเพื่อประโยชน์ในการวิเคราะห์สินเชื่อของผู้กู้ที่ให้ไว้กับผู้ให้กู้
                    รวมทั้งเพื่อประโยชน์ในการทบทวนสินเชื่อ ต่ออายุสัญญาสินเชื่อ บริหารและป้องกันความเสี่ยง
                    และ/หรือเพื่อวัตถุประสงค์อื่นใดตามที่กฎหมายกำหนด ในกรณีนี้
                    ผู้กู้ยินยอมให้บริษัทข้อมูลเครดิตแห่งชาติ จำกัด
                    และบริษัทผู้ประกอบธุรกิจข้อมูลเครดิตอื่นใดที่อาจจัดตั้งขึ้นในอนาคตตามกฎหมายเปิดเผยข้อมูลเครดิตและข้อมูลอื่นใดของผู้กู้ให้แก่ผู้ให้กู้เพื่อวัตถุประสงค์ดังกล่าวข้างต้น
                  </Typography>
                </Stack>
              </li>
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (5)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    ผู้ให้กู้สงวนสิทธิ์ในการแก้ไขเปลี่ยนแปลงเงื่อนไขของสัญญา อัตราดอกเบี้ย
                    เงื่อนไขในการคำนวณอัตราดอกเบี้ย อัตราค่าธรรมเนียมผิดนัดชำระหนี้
                    อัตราค่าใช้จ่ายในการติดตามทวงถามหนี้ อัตราค่าธรรมเนียมและอัตราค่าบริการต่างๆ
                    ทั้งนี้ผู้ให้กู้จะมีหนังสือแจ้งโดยไปรษณีย์ลงทะเบียนตอบรับให้ผู้กู้ทราบล่วงหน้าไม่น้อยกว่า 30 วัน
                  </Typography>
                </Stack>
              </li>
              <li>
                <Stack direction="row" alignItems="flex-start">
                  <Typography variant="body1" sx={{ minWidth: '20px' }}>
                    (6)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, textAlign: 'justify', flex: 1 }}
                  >
                    บรรดาหนังสือติดต่อ บอกกล่าว ทวงถาม หรือหนังสืออื่นใดที่จะส่งให้แก่ผู้กู้โดยทางไปรษณีย์ลงทะเบียนตอบรับ
                    หากได้ส่งไปยังที่อยู่ที่ผู้กู้ให้ไว้กับผู้ให้กู้ในใบสมัครสินเชื่อซึ่งถือเป็นส่วนหนึ่งของสัญญาฉบับนี้
                    หรือเอกสารประกอบการสมัครสินเชื่อ หรือตามที่อยู่ที่ผู้กู้ได้แจ้งเปลี่ยนแปลงเป็นหนังสือครั้งหลังสุด
                    ให้ถือว่าได้ส่งให้แก่ผู้กู้แล้วโดยชอบ ทั้งนี้ โดยไม่ต้องคำนึงถึงว่าจะมีผู้รับไว้หรือไม่
                    และแม้หากว่าส่งให้ไม่ได้เพราะผู้กู้ย้ายที่อยู่ หรือที่อยู่ที่กล่าวนี้เปลี่ยนแปลงไป หรือถูกรื้อถอนไป
                    โดยผู้กู้ไม่ได้แจ้งการย้าย หรือการเปลี่ยนแปลง หรือการรื้อถอนนั้นเป็นหนังสือ ต่อผู้ให้กู้
                    หรือส่งให้ไม่ได้เพราะหาไม่พบสถานที่ที่ระบุไว้ข้างต้นก็ดี
                    ให้ถือว่าผู้กู้ได้รับทราบข้อความตามหนังสือติดต่อ บอกกล่าว ทวงถามนั้นแล้วโดยชอบ
                  </Typography>
                </Stack>
              </li>
            </ol>
            <Stack direction="row" gap={2} sx={{ pl: "2em", my: 5 }}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  คู่สัญญาได้อ่านและทำความเข้าใจเงื่อนไขของสัญญาโดยตลอดแล้ว
                  เห็นว่าถูกต้องตรงตามเจตนารมย์ของตนทุกประการ
                  <br />
                  จึงได้ลงลายมือชื่อ พร้อมทั้งตราประทับ (หากมี) ไว้ต่อหน้าพยาน
                  ต่างฝ่ายต่างยึดถือไว้ฝ่ายละหนึ่งฉบับ
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={2} sx={{ pl: "2em", mt: 20 }}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ลงชื่อ</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {/* {loanData?.admin_approve || ""} */}
                  {""}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ผู้ให้กู้</Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ลงชื่อ</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                >
                  {/* {loanData?.titlename || ""} {loanData?.firstname || ""} {loanData?.lastname || ""} */}
                  {""}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ผู้กู้</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={2} sx={{ pl: "2em", mt: 2 }}>
              <Stack direction="row" sx={{ flex: 1, gap: 0 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8, ml: 7 }}>(</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1, textAlign: "center" }}
                >
                  {loanData?.admin_approve || ""}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mr: 7 }}>)</Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 1, gap: 0 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8,  ml: 7 }}>(</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1, mx: 0, textAlign: "center" }}
                >
                  {loanData?.titlename || ""} {loanData?.firstname || ""} {loanData?.lastname || ""}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8,  mr: 4 }}>)</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={2} sx={{ pl: "2em", mt: 6 }}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ลงชื่อ</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                ></Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>(พยาน)</Typography>
              </Stack>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>ลงชื่อ</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1 }}
                ></Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>(พยาน)</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={2} sx={{ pl: "2em", mt: 2 }}>
              <Stack direction="row" sx={{ flex: 1, gap: 0 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8, ml: 7 }}>(</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1, textAlign: "center" }}
                >
                  {""}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mr: 7 }}>)</Typography>
              </Stack>

              <Stack direction="row" sx={{ flex: 1, gap: 0 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.8,  ml: 7 }}>(</Typography>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #000000", flex: 1, mx: 0, textAlign: "center" }}
                >
                  {""}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8,  mr: 4 }}>)</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Box>
        <style>
          {`
            @media print {
              * {
                overflow: visible !important;
              }
              html, body {
                height: auto;
              }
              .MuiDialog-root {
                overflow: visible !important;
              }
            }
          `}
        </style>
      </Box>
    </>
  );
}

export default Contract;
