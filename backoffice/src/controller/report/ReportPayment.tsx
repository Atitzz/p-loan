import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
    Button,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Chip,
    Modal,
    Box,
    IconButton
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";
import SearchDate from "@/component/SearchDate";
import { CalendarIcon } from "@mui/x-date-pickers";
const startDate = new Date();
const endDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
endDate.setDate(endDate.getDate() + 1);
function ReportPayment() {
    const { status } = useParams();
    const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
    const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
        useContext(HttpContext);
    const { toFloat, toDate } = useContext(ToolsContext);
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

    const [openSearch, setOpenSearch] = useState(false);
    const [searchDate, setSearchDate] = useState({
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
    });

    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState({ url: '', type: '' });

    const handleOpenModal = (url, type) => {
        setSelectedImage({ url, type });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const onSearch = (search) => {
        setSearchDate(search);
    };

    useEffect(() => {
        setPage(1);
        setData([]);
    }, [status]);

    useEffect(() => {
        setIsLoading(true);
        Get(
            `report/payment?search=${search}&page=${page}&limit=${pageSize}&start=${searchDate.start}&end=${searchDate.end}`
        )
            .then((response) => {
                setData(response.data.data);
                setPages(response.data.pages);
                setTimeout(() => {
                    setIsLoading(false);
                }, 250);
            })
            .catch((err) => {
                setTimeout(() => {
                    setIsLoading(false);
                    setData([]);
                    AddAlert(ErrorResponse(err), "error");
                }, 250);
            });
    }, [status, page, search, pageSize, searchDate]);

    const StatusFilter = (value) => {
        switch (value) {
            case "pending":
                return "รอดำเนินการ";
            case "success":
                return "สำเร็จ";
            case "error":
                return "ไม่สำเร็จ";
            default:
                return value;
        }
    };

    const CallbackFilter = (value) => {
        switch (value) {
            case "pending":
                return "รอดำเนินการ";
            case "completed":
                return "สำเร็จ";
            default:
                return value;
        }
    };


    const statusCheck = (value) => {
        const __value = value.toString().toLowerCase();

        switch (__value) {
            case "pending":
                return (
                    <Chip
                        label={StatusFilter("pending")}
                        variant="outlined"
                        size="small"
                    />
                );
            case "success":
                return (
                    <Chip
                        label={StatusFilter("success")}
                        variant="outlined"
                        color="success"
                        size="small"
                    />
                );
            case "error":
                return (
                    <Chip
                        label={StatusFilter("error")}
                        color="error"
                        variant="outlined"
                        size="small"
                    />
                );
            default:
                return (
                    <Chip
                        label={StatusFilter(value)}
                        color="default"
                        variant="outlined"
                        size="small"
                    />
                );
        }
    };


    const callbackCheck = (value) => {
        const __value = value.toString().toLowerCase();

        switch (__value) {
            case "pending":
                return (
                    <Chip
                        label={CallbackFilter("pending")}
                        variant="outlined"
                        size="small"
                    />
                );
            case "completed":
                return (
                    <Chip
                        label={CallbackFilter("completed")}
                        variant="outlined"
                        color="success"
                        size="small"
                    />
                );
            default:
                return (
                    <Chip
                        label={CallbackFilter(value)}
                        color="default"
                        variant="outlined"
                        size="small"
                    />
                );
        }
    };


    const columns: GridColDef<(typeof data)[number]>[] = [
        {
            field: "created_at",
            headerName: `${useLang("วันที่", "Date")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
            valueFormatter: (value) => toDate(value),
        },
        {
            field: "loan_number",
            headerName: `${useLang("หมายเลขสัญญา", "Loan No")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
        },
        {
            field: "referenceNo",
            headerName: `${useLang("หมายเลขอ้างอิง", "Reference No")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
        },
        {
            field: "total",
            headerName: `${useLang("ยอดที่ต้องชำระ", "Received")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
            valueFormatter: (value) => toFloat(value),
        },
        {
            field: "received",
            headerName: `${useLang("ยอดชำระ", "Amount")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
            valueFormatter: (value) => toFloat(value),
        },
        {
            field: "orderdatetime",
            headerName: `${useLang("เริ่มเวลา", "start time")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
            valueFormatter: (value) => toDate(value),
        },
        {
            field: "expiredate",
            headerName: `${useLang("สิ้นสุดเวลา", "end time")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
            valueFormatter: (value) => toDate(value),
        },
        {
            field: "merchantid",
            headerName: `${useLang("หมายเลขร้านค้า", "Merchant No")}`,
            headerAlign: "center",
            align: "center",
            width: 130,
        },
        {
            field: "cardtype",
            headerName: `${useLang("ประเภท", "type")}`,
            headerAlign: "center",
            align: "center",
            width: 130,
        },
        {
            field: "orderNo",
            headerName: `${useLang("หมายเลขออเดอร์", "Order")}`,
            headerAlign: "center",
            align: "center",
            width: 120,
        },
        {
            field: "callback",
            headerName: `${useLang("สถานะตอบกลับ", "Status Callback")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
            renderCell: (params) => callbackCheck(params.value),
        },
        {
            field: "update_installment",
            headerName: `${useLang("สถานะการอัพเดท", "Status Update")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
            renderCell: (params) => statusCheck(params.value),
        },
        {
            field: "message",
            headerName: `${useLang("ข้อความ", "message")}`,
            headerAlign: "center",
            align: "center",
            width: 140,
            renderCell: (params) => (params.value),
        },
        {
            field: "image",
            headerName: `${useLang("คิวอาร์โค้ด", "QR Code")}`,
            headerAlign: "center",
            align: "center",
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Icons.QrCode />}
                    onClick={() => handleOpenModal(
                        `${import.meta.env.VITE_BASE}/file/${params.row.image}`,
                        'qr'
                    )}
                >
                    {useLang("QR Code", "QR Code")}
                </Button>
            ),
        },
        {
            field: "barcode",
            headerName: `${useLang("บาร์โค้ด", "Barcode")}`,
            headerAlign: "center",
            align: "center",
            width: 130,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Icons.ViewWeek />}
                    onClick={() => handleOpenModal(
                        `${import.meta.env.VITE_BASE}/file/${params.row.barcode}`,
                        'barcode'
                    )}
                >
                    {useLang("Barcode", "Barcode")}
                </Button>
            ),
        },
    ];

    const contentToPrint = useRef(null);
    const pageStyle = `
  @page {
    size: A4 landscape;
      margin: 3mm;
  }

`;
    const handlePrint = useReactToPrint({
        documentTitle: "รายงานการชำระเงิน",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
        pageStyle: pageStyle,
        content: () => contentToPrint.current,
    });
    return (
        <Stack spacing={1}>
            <SearchDate
                open={openSearch}
                onClose={() => setOpenSearch(false)}
                onSubmit={onSearch}
            />
            <GridRender
                onSearchText={setSearch}
                isLoading={isLoading}
                columns={columns}
                rows={data}
                thisPage={setPage}
                pages={pages}
                pageSize={setPageSize}
                insertEnd={
                    <>
                        <Button
                            variant="outlined"
                            startIcon={<CalendarIcon />}
                            onClick={() => setOpenSearch(true)}
                        >
                            กำหนดช่วงวัน
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Icons.Print />}
                            onClick={() => handlePrint(null, () => contentToPrint.current)}
                        >
                            {useLang("พิมพ์", "Print")}
                        </Button>
                    </>
                }
            />
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="image-modal-title"
                aria-describedby="image-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    // minHeight: selectedImage.type === 'barcode' ? '250px' : 'auto',
                    minHeight: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Icons.Close />
                    </IconButton>
                    <Typography id="image-modal-title" variant="h6" component="h2" gutterBottom>
                        {/* {selectedImage.type === 'qr' 
                            ? useLang("คิวอาร์โค้ด", "QR Code") 
                            : useLang("บาร์โค้ด", "Barcode")} */}
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 2
                    }}>
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.type === 'qr' ? "Not Image QR Code" : "Not Image Barcode"}
                            style={{
                                width: '100%',
                                maxHeight: selectedImage.type === 'qr' ? '300px' : '150px',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                </Box>
            </Modal>

            <Stack sx={{ display: "none" }}>
                <Stack>
                    <Stack ref={contentToPrint}>
                        <Stack gap={2} sx={{ mb: 4 }}>
                            <Stack direction='row' justifyContent='space-between'>
                                <Typography variant="body2">
                                    <strong> บริษัท มันนี่ฟอร์ยู จำกัด</strong>
                                </Typography>
                                <Typography variant="body2">
                                    <strong>รายงานการชำระเงิน</strong>
                                </Typography>
                            </Stack>
                            <Typography variant="body2">
                                เงื่อนไขการพิมพ์ ระหว่างวันที่{" "}
                                <strong>{toDate(searchDate.start, 2)}</strong> ถึง วันที่{" "}
                                <strong>{toDate(searchDate.end, 2)}</strong>
                            </Typography>
                        </Stack>
                        <TableContainer sx={{ bgcolor: "#fff" }}>
                            <Table
                                sx={{
                                    minWidth: 650,
                                    "& .MuiTableCell-root": {
                                        border: "1px solid rgba(224, 224, 224, 1)",
                                        fontSize: 8,
                                        lineHeight: 1.5,
                                        padding: '4px',
                                    },
                                }}
                                size="small"
                                aria-label="a dense table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">วันที่</TableCell>
                                        <TableCell align="center">หมายเลขสัญญา</TableCell>
                                        <TableCell align="center">หมายเลขอ้างอิง</TableCell>
                                        <TableCell align="center">ยอดชำระ</TableCell>
                                        <TableCell align="center">สถานะตอบกลับ</TableCell>
                                        <TableCell align="center">สถานะการอัพเดท</TableCell>
                                        <TableCell align="center">คิวอาร์โค้ด</TableCell>
                                        <TableCell align="center">บาร์โค้ด</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((value, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{toDate(value.created_at)}</TableCell>
                                            <TableCell align="center">{value.loan_number}</TableCell>
                                            <TableCell align="center">{value.referenceNo}</TableCell>
                                            <TableCell align="center">{toFloat(value.total)}</TableCell>
                                            <TableCell align="center">{CallbackFilter(value.callback)}</TableCell>
                                            <TableCell align="center">{StatusFilter(value.update_installment)}</TableCell>
                                            <TableCell align="center">
                                                <img
                                                    src={`${import.meta.env.VITE_BASE}/file/${value.image}`}
                                                    alt="QR Code"
                                                    style={{ width: '40px', height: '20px' }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <img
                                                    src={`${import.meta.env.VITE_BASE}/file/${value.barcode}`}
                                                    alt="Barcode"
                                                    style={{ width: '40px', height: '20px' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default ReportPayment;
