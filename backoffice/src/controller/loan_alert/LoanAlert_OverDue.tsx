import React, { useContext, useEffect, useState, useRef } from "react";
import {
    Stack,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    TextField,
    InputAdornment,
    Box,
    Typography
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";


function LoanAlert_OverDue() {
    const navigate = useNavigate();
    const { AddAlert, useLang } = useContext(MainContext);
    const { Get, Post, ErrorResponse } = useContext(HttpContext);
    const { toFloat, toDate } = useContext(ToolsContext);

    const [data, setData] = useState([]);
    const [searchMonth, setSearchMonth] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [pages, setPages] = useState({
        page: 1,
        total: 0,
        limit: 25,
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [selectedLoans, setSelectedLoans] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dialogData, setDialogData] = useState([]);
    const [debouncedSearchMonth, setDebouncedSearchMonth] = useState("");
    const timeoutRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, [debouncedSearchMonth, page, pageSize]);

    const fetchData = () => {
        setIsLoading(true);
        Get(`loan/alert/overdue?searchMonth=${debouncedSearchMonth}&page=${page}&limit=${pageSize}`)
            .then((response) => {
                const indexedData = response.data.data.map((item, index) => ({
                    ...item,
                    index: index + 1 + (page - 1) * pageSize,
                }));
                setData(indexedData);
                setFilteredData(indexedData);
                setPages(response.data.pages);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                AddAlert(ErrorResponse(err), "error");
            });
    };

    const columns: GridColDef<(typeof data)[number]>[] = [
        {
            field: "index",
            headerName: "#",
            align: "center",
            headerAlign: "center",
            width: 50
        },
        {
            field: "loan_number",
            headerName: useLang("เลขที่สัญญา", "Loan NO"),
            align: "center",
            headerAlign: "center",
            width: 150
        },
        {
            field: "user_name",
            headerName: useLang("ชื่อ - สกุล", "Name - Lastname"),
            align: "center",
            headerAlign: "center",
            width: 150
        },
        {
            field: "amount",
            headerName: useLang("จำนวนเงินกู้", "Amount"),
            align: "center",
            headerAlign: "center",
            width: 150,
            valueFormatter: (value) => `${toFloat(value)} บาท`,
        },
        {
            field: "per_installment",
            headerName: useLang("ยอดผ่อนชำระ", "Installment Amount"),
            align: "center",
            headerAlign: "center",
            width: 150,
            valueFormatter: (value) => `${toFloat(value)} บาท`,
        },
        {
            field: "given_installment",
            headerName: useLang("ชำระมาแล้ว", "Given Installment"),
            align: "center",
            headerAlign: "center",
            width: 120,
        },
        {
            field: "total_installment",
            headerName: useLang("จำนวนงวดทั้งหมด", "Total Installment"),
            align: "center",
            headerAlign: "center",
            width: 120,
        },
        {
            field: "installment_due",
            headerName: useLang("กำหนดชำระ", "Due Date"),
            align: "center",
            headerAlign: "center",
            width: 150,
            valueFormatter: (value) => toDate(value).slice(0, -5)
        },
        {
            field: "overdue_months",
            headerName: useLang("เกินกำหนด (งวด)", "Over Months"),
            align: "center",
            headerAlign: "center",
            width: 120,
            valueFormatter: (value) => (value)
        },
        {
            field: "status",
            headerName: useLang("สถานะ", "Status"),
            align: "center",
            headerAlign: "center",
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={useLang("เกินกำหนด", "Over Due")}
                    variant="outlined"
                    color="error"
                    size="small"
                />
            ),
        },
        {
            field: "notification_status",
            headerName: useLang("สถานะการแจ้งเตือน", "Notification Status"),
            align: "center",
            headerAlign: "center",
            width: 150,
            renderCell: (params) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let isNotifiedToday = false;

                if (params.row.last_alert_date) {
                    const lastNotified = new Date(params.row.last_alert_date);
                    lastNotified.setHours(0, 0, 0, 0);
                    isNotifiedToday = lastNotified.getTime() === today.getTime();
                }

                return (
                    <Chip
                        label={isNotifiedToday ? useLang("ส่งแล้ว", "Notified") : useLang("ยังไม่ส่ง", "Not Notified")}
                        color={isNotifiedToday ? "success" : "default"}
                        size="small"
                        variant="outlined"
                    />
                );
            }
        },
        {
            field: "remaining",
            headerName: useLang("ยอดคงเหลือ", "Remaining"),
            align: "center",
            headerAlign: "center",
            width: 150,
            valueFormatter: (value) => toFloat(value)
        },
    ];

    const handleNotificationClick = () => {
        setOpenDialog(true);
        setSearchText("");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const notNotifiedLoans = data.filter(loan => {
            if (loan.last_alert_date) {
                const lastNotified = new Date(loan.last_alert_date);
                lastNotified.setHours(0, 0, 0, 0);
                return lastNotified.getTime() !== today.getTime();
            }
            return true;
        });

        setDialogData(notNotifiedLoans);
        setFilteredData(notNotifiedLoans);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAllSelected(false);
        setSelectedLoans([]);
    };

    const handleSelectAll = (event) => {
        setAllSelected(event.target.checked);
        if (event.target.checked) {
            setSelectedLoans(filteredData.map(loan => loan.id));
        } else {
            setSelectedLoans([]);
        }
    };

    const handleSelectLoan = (loanId) => {
        setSelectedLoans(prev =>
            prev.includes(loanId)
                ? prev.filter(id => id !== loanId)
                : [...prev, loanId]
        );
    };

    const handleSendNotifications = () => {
        if (selectedLoans.length === 0) {
            AddAlert('กรุณาเลือกรายการ');
            return;
        }

        // กรองสินเชื่อที่ยังไม่ถูกส่งแจ้งเตือน
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const loansToNotify = selectedLoans.filter(loanId => {
            const loan = data.find(d => d.id === loanId);
            if (loan && loan.last_alert_date) {
                const lastNotified = new Date(loan.last_alert_date);
                lastNotified.setHours(0, 0, 0, 0);
                return lastNotified.getTime() !== today.getTime();
            }
            return true;
        });

        if (loansToNotify.length === 0) {
            AddAlert('ได้ทำการแจ้งเตือนแล้วในวันนี้สำหรับรายการที่เลือก', 'warning');
            return;
        }

        setIsLoading(true);
        Post('loan/alert/due', { loanIds: selectedLoans })
            .then((response) => {
                AddAlert('การแจ้งเตือนถูกส่งเรียบร้อยแล้ว');
                handleCloseDialog();
                fetchData();
                // navigate(0);
            })
            .catch((err) => {
                console.error('Error:', err);
                AddAlert(ErrorResponse(err), "error");
            })
    };

    const handleMonthSearch = (event) => {
        const value = event.target.value;
        if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
            setSearchMonth(value);
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setDebouncedSearchMonth(value);
                setPage(1);
            }, 100);
        }
    };

    const handleTextSearch = (event) => {
        const searchValue = event.target.value;
        setSearchText(searchValue);
        const searchValueWithoutSpaces = searchValue.replace(/\s+/g, '').toLowerCase();
        
        const filtered = dialogData.filter(loan => {
            const fullName = loan.user_name.replace(/\s+/g, '').toLowerCase();
            const loanNumber = loan.loan_number.toLowerCase();
            
            return fullName.includes(searchValueWithoutSpaces) ||
                   loanNumber.includes(searchValueWithoutSpaces);
        });
        setFilteredData(filtered);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <Stack spacing={1}>
            <GridRender
                isLoading={isLoading}
                columns={columns}
                rows={data}
                thisPage={setPage}
                pages={pages}
                pageSize={setPageSize}
                insertEnd={
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            // label={useLang("จำนวนวันล่วงหน้า", "Days in advance")}
                            type="number"
                            value={searchMonth}
                            onChange={handleMonthSearch}
                            size="small"
                            placeholder="ระบุจำนวนเดือน..."
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                inputProps: { min: 0 }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white',
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNotificationClick}
                            disabled={isLoading}
                        >
                            {isLoading ? useLang("กำลังค้นหา...", "Processing...") : useLang("ส่งแจ้งเตือน", "Send Notification")}
                        </Button>
                    </Stack>
                }
            />


            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ mb: 2 }}>{useLang("เลือกรายการ", "Select for Notification")}</Box>
                        <TextField
                            fullWidth="true"
                            value={searchText}
                            onChange={handleTextSearch}
                            variant="outlined"
                            placeholder="ค้นหาชื่อหรือเลขที่สัญญา..."
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                </DialogTitle>
                <DialogContent>
                    {filteredData.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={allSelected}
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                        <TableCell align="center">{useLang("ชื่อ - สกุล", "Name - Lastname")}</TableCell>
                                        <TableCell align="center">{useLang("เลขที่สัญญา", "Loan NO")}</TableCell>
                                        <TableCell align="center">{useLang("กำหนดชำระ", "Due Date")}</TableCell>
                                        <TableCell align="center">{useLang("ยอดชำระ", "Amount")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.map((loan) => (
                                        <TableRow key={loan.id}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedLoans.includes(loan.id)}
                                                    onChange={() => handleSelectLoan(loan.id)}
                                                />
                                            </TableCell>
                                            <TableCell align="center">{loan.loan_number}</TableCell>
                                            <TableCell align="center">{loan.user_name}</TableCell>
                                            <TableCell align="center">{toDate(loan.installment_due).slice(0, -5)}</TableCell>
                                            <TableCell align="center">{toFloat(loan.per_installment)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="50px">
                            <Typography variant="h6" color="text.secondary">
                                {useLang("ไม่พบข้อมูล", "No results found.")}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" disabled={isLoading}>
                        {useLang("ยกเลิก", "Cancel")}
                    </Button>
                    <Button
                        onClick={handleSendNotifications}
                        color="primary"
                        variant="contained"
                        disabled={isLoading || selectedLoans.length === 0}
                    >
                        {isLoading ? useLang("กำลังส่ง...", "Sending...") : useLang("ส่งแจ้งเตือน", "Send Notifications")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default LoanAlert_OverDue;