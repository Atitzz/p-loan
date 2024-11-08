import GridRender from "@/component/GridRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { Visibility, Edit } from "@mui/icons-material";
import { Box, Button, Divider, Paper, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Payment from "./component/Payment";
import Installment from "./component/Installment";
import EditInstallment from "./component/EditInstallment";

function LoanInstallment() {
  const { id } = useParams();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Post, ErrorResponse, MessageResponse } = useContext(HttpContext);
  const { toDate, toTHB, toFloat } = useContext(ToolsContext);
  const [data, setData] = useState([]);
  const [loan, setLoan] = useState<any>();
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [_, setPageSize] = useState(25);
  const [pages, setPages] = useState({
    page: 1,
    total: 0,
    limit: 20,
  });

  useEffect(() => {
    setPage(1);
  }, [id]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   Get(`loan/installment/${id}?search=&page=${page}&limit=20`).then(
  //     (response) => {
  //       const installments = response.data.data.installment;
  //       setLoan(response.data.data.loan_summary);
  //       setPages(response.data.pages);

  //       if (response.data.data.loan_summary) {
  //         const calculatorParams = {
  //           amount: response.data.data.loan_summary.amount,
  //           rate: response.data.data.loan_summary.interestRate,
  //           installment: response.data.data.loan_summary.total_installment,
  //           start: response.data.data.loan_summary.startDate,
  //           created: response.data.data.loan_summary.approved_at
  //         };

  //         Post(`loan/calcurate`, calculatorParams)
  //           .then(calResponse => {
  //             const lastPaidInstallment = installments.length
  //               ? installments[installments.length - 1].installment
  //               : 0;

  //             const lastPaidRemaining = installments.length
  //               ? installments[installments.length - 1].remaining
  //               : response.data.data.loan_summary.remaining;

  //             const calculatedInstallments = calResponse.data.data.installment.map((item, index) => ({
  //               id: `${item.date}`,
  //               installment: lastPaidInstallment + index + 1,
  //               installment_date: item.date,
  //               given_at: null,
  //               paid: null,
  //               principle_paid: null,
  //               interest_paid: null,
  //               delay_charge_paid: null,
  //               remaining: null,
  //               isCalculated: true,
  //               nextDueInfo: index > 0 ? calResponse.data.data.installment[index - 1] : null,
  //               principle: item.principle,
  //               interest: item.interest,
  //               total: item.amount
  //             }));

  //             const filteredCalculatedInstallments = calculatedInstallments.filter(
  //               (_, index) => lastPaidInstallment + index + 1 <= response.data.data.loan_summary.total_installment
  //             );

  //             const allInstallments = [...installments, ...filteredCalculatedInstallments].map((inst, index, array) => {
  //               if (inst.paid === null || inst.paid === 0) {
  //                 const lastPaidInst = array.slice(0, index).reverse().find(i => i.paid !== null && i.paid !== 0);
  //                 return {
  //                   ...inst,
  //                   remaining: lastPaidInst ? lastPaidInst.remaining : lastPaidRemaining
  //                 };
  //               }
  //               return inst;
  //             });

  //             setData(allInstallments);
  //           })
  //           .catch(error => {
  //             console.error('Error', error);
  //             AddAlert('เกิดข้อผิดพลาด', 'error');
  //           });
  //       } else {
  //         setData(installments);
  //       }

  //       setTimeout(() => {
  //         setIsLoading(false);
  //       }, 250);
  //     }
  //   );
  // }, [page, refresh]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   Get(`loan/installment/${id}?search=&page=${page}&limit=20`).then(
  //     (response) => {
  //       const installments = response.data.data.installment;
  //       setLoan(response.data.data.loan_summary);
  //       setPages(response.data.pages);

  //       if (response.data.data.loan_summary) {
  //         const totalInstallments = response.data.data.loan_summary.total_installment;
  //         const givenInstallments = Number(response.data.data.loan_summary.given_installment);
  //         const remaining = Number(response.data.data.loan_summary.remaining);

  //         const regular = installments.filter(inst => inst.installment <= totalInstallments);
  //         const extended = installments.filter(inst => inst.installment > totalInstallments);

  //         const lastPaidInstallment = [...regular, ...extended].reverse().find(inst => inst.paid !== null && inst.paid !== 0);
  //         const lastPaidRemaining = lastPaidInstallment ? lastPaidInstallment.remaining : remaining;

  //         if (regular.length < totalInstallments) {
  //           const calculatorParams = {
  //             amount: response.data.data.loan_summary.amount,
  //             rate: response.data.data.loan_summary.interestRate,
  //             installment: totalInstallments,
  //             start: response.data.data.loan_summary.startDate,
  //             created: response.data.data.loan_summary.approved_at,
  //             given_at: givenInstallments
  //           };

  //           Post(`loan/calcurate`, calculatorParams)
  //             .then(calResponse => {
  //               const lastPaidInstallmentNumber = regular.length;

  //               let calculatedInstallments = calResponse.data.data.installment
  //                 .slice(lastPaidInstallmentNumber)
  //                 .map((item, index) => ({
  //                   id: `calculated-${lastPaidInstallmentNumber + index + 1}`,
  //                   installment: lastPaidInstallmentNumber + index + 1,
  //                   installment_date: item.date,
  //                   given_at: null,
  //                   paid: null,
  //                   principle_paid: null,
  //                   interest_paid: null,
  //                   delay_charge_paid: null,
  //                   remaining: lastPaidRemaining,
  //                   isCalculated: true,
  //                   principle: item.principle,
  //                   interest: item.interest,
  //                   total: item.amount
  //                 }));

  //               if (calculatedInstallments.length > 0) {
  //                 const lastRegularInstallment = calculatedInstallments[calculatedInstallments.length - 1];
  //                 lastRegularInstallment.total = lastRegularInstallment.remaining;
  //                 lastRegularInstallment.principle = lastRegularInstallment.remaining - lastRegularInstallment.interest;
  //               }

  //               if (extended.length > 0) {
  //                 calculatedInstallments = [...calculatedInstallments, ...extended];
  //               }

  //               setData([...regular, ...calculatedInstallments]);
  //             })
  //             .catch(error => {
  //               console.error('Error', error);
  //               AddAlert('เกิดข้อผิดพลาดในการคำนวณงวด', 'error');
  //             });
  //         } else {
  //           setData([...regular, ...extended]);
  //         }
  //       } else {
  //         setData(installments);
  //       }

  //       setTimeout(() => {
  //         setIsLoading(false);
  //       }, 250);
  //     }
  //   );
  // }, [page, refresh]);

  useEffect(() => {
    setIsLoading(true);
    Get(`loan/installment/${id}?search=&page=${page}&limit=20`).then(
      (response) => {
        const installments = response.data.data.installment;
        setLoan(response.data.data.loan_summary);
        setPages(response.data.pages);

        if (response.data.data.loan_summary) {
          const totalInstallments =
            response.data.data.loan_summary.total_installment;
          const givenInstallments = Number(
            response.data.data.loan_summary.given_installment
          );
          const remaining = Number(response.data.data.loan_summary.remaining);

          // Separate regular and extended installments
          const regular = installments.filter(
            (inst) => inst.installment <= totalInstallments
          );
          const extended = installments.filter(
            (inst) => inst.installment > totalInstallments
          );

          const lastPaidInstallment = [...regular, ...extended]
            .reverse()
            .find((inst) => inst.paid !== null && inst.paid !== 0);
          const lastPaidRemaining = lastPaidInstallment
            ? lastPaidInstallment.remaining
            : remaining;

          if (regular.length < totalInstallments) {
            const calculatorParams = {
              amount: response.data.data.loan_summary.amount,
              rate: response.data.data.loan_summary.interestRate,
              installment: totalInstallments,
              start: response.data.data.loan_summary.startDate,
              created: response.data.data.loan_summary.approved_at,
              type_interest: response.data.data.loan_summary.type_interest,
              remaining: response.data.data.loan_summary.remaining,
              given_at: installments.length,
            };

            Post(`loan/calcurate?loan_id=${id}`, { ...calculatorParams })
              .then((calResponse) => {
                const lastPaidInstallmentNumber = regular.length;

                let calculatedInstallments = calResponse.data.data.installment
                  // .slice(lastPaidInstallmentNumber)
                  .map((item, index) => ({
                    id: `calculated-${lastPaidInstallmentNumber + index + 1}`,
                    installment: lastPaidInstallmentNumber + index + 1,
                    installment_date: item.date,
                    given_at: null,
                    paid: item.amount,
                    principle_paid: item.principle,
                    interest_paid: item.interest,
                    delay_charge_paid: null,
                    remaining: item.remaining,
                    outstanding_balance: item.remaining,
                    isCalculated: true,
                    principle: item.principle,
                    interest: item.interest,
                    total: item.amount,
                  }));

                if (calculatedInstallments.length > 0) {
                  const lastRegularInstallment =
                    calculatedInstallments[calculatedInstallments.length - 1];
                  lastRegularInstallment.total =
                    lastRegularInstallment.remaining;
                  lastRegularInstallment.principle =
                    lastRegularInstallment.remaining -
                    lastRegularInstallment.interest;
                }

                if (extended.length > 0) {
                  calculatedInstallments = [
                    ...calculatedInstallments,
                    ...extended,
                  ];
                }

                setData([...regular, ...calculatedInstallments]);
              })
              .catch((error) => {
                console.error("Error", error);
                AddAlert("เกิดข้อผิดพลาดในการคำนวณงวด", "error");
              });
          } else {
            setData([...regular, ...extended]);
          }
        } else {
          setData(installments);
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      }
    );
  }, [page, refresh]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "installment",
      headerName: "งวดที่",
      width: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "given_at",
      headerName: "วันที่ชำระ",
      width: 150,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => `${toDate(value)}`,
    },
    {
      field: "installment_date",
      headerName: "กำหนดชำระ",
      width: 150,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => `${toDate(value).slice(0, -5)}`,
    },
    {
      field: "paid",
      headerName: "ชำระ",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => `${toFloat(value)} บาท`,
    },
    {
      field: "principle_paid",
      headerName: "หักเงินต้น",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => `${toFloat(value)} บาท`,
    },
    {
      field: "interest_paid",
      headerName: "หักดอกเบี้ย",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => `${toFloat(value)} บาท`,
    },
    {
      field: "delay_charge_paid",
      headerName: "หักทวงถาม",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => `${toFloat(value)} บาท`,
    },
    {
      field: "remaining",
      headerName: "ยอดหนี้คงเหลือ",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => `${toFloat(value)} บาท`,
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const isViewable =
          row.paid !== null && row.paid !== 0 && !row.isCalculated;
          const isEdit = row.given_at != null
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => handleOnView(id)}
            disabled={!isViewable}
          >
            <Visibility />
            {useLang("เรียกดู", "View")}
          </Button>,
          // <Button
          //   variant="outlined"
          //   color="warning"
          //   sx={{ gap: 2, alignItems: "center" }}
          //   onClick={() => openEditIntsllment(id)}
          //   disabled={!isEdit}
          // >
          //   <Edit />
          //   {useLang("แก้ไข", "Edit")}
          // </Button>,
        ];
      },
    },
  ];

  const handleOnEdit = (id, installment) => {
    Post(`loan/installment/edit/${id}`, { loan_id: id, installment })
      .then((response) => {
        setData((prev) => [response.data.data, ...prev]);
        setRefresh(!refresh);
        AddAlert(MessageResponse(response), "success");
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleOnPayment = (data) => {
    if (data.type === "transfer")
      return (window.location.href = `${import.meta.env.VITE_BASE}/payment/${
        loan.loan_number
      }/${data.paidAmount}`);
    Post(`loan/pay`, { loan_id: id, ...data })
      .then((response) => {
        // setData((prev) => [response.data.data, ...prev]);
        setRefresh(!refresh);
        AddAlert(MessageResponse(response), "success");
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  const [view, setView] = useState(false);
  const [viewData, setViewData] = useState();
  const handleOnView = (id) => {
    const __existed = data.find((x) => x.id === id);
    if (!__existed) return AddAlert("ไม่พบข้อมูล!");

    let viewData;
    if (__existed.isCalculated) {
      const prevInstallment = data.find(
        (x) => x.installment === __existed.installment - 1
      );
      viewData = {
        ...__existed,
        loan_number: loan.loan_number,
        plan: loan.plan,
        installment_due: loan.installment_due,
        approved_at: loan.approved_at,
        startDate: loan.startDate,
        amount: loan.amount,
        principle_next_due: __existed.principle,
        interest_next_due: __existed.interest,
        total_amount_next_due: __existed.total,
        installment_next_due: __existed.installment_date,
        prevInstallment: prevInstallment,
        type_interest: loan.type_interest,
      };
    } else {
      const nextInstallment = data.find(
        (x) => x.installment === __existed.installment + 1
      );
      viewData = {
        ...__existed,
        loan_number: loan.loan_number,
        plan: loan.plan,
        installment_due: loan.installment_due,
        approved_at: loan.approved_at,
        startDate: loan.startDate,
        nextInstallment: nextInstallment,
        type_interest: loan.type_interest,
      };
    }
    setViewData(viewData);
    setView(true);
  };
  const [editData, setEditData] = useState();
  const [edit, setEdit] = useState(false);
  const openEditIntsllment = (id) => {
    const __existed = data.find((x) => x.id === id);
    if (!__existed) return AddAlert("ไม่พบข้อมูล!");
    let remaining = Number(__existed.remaining)+Number(__existed.principle_paid);
    if(loan.type_interest == 'flatrate')
      remaining = remaining + Number(__existed.interest_paid);
    setEditData({
      amount: __existed.amount,
      remaining: remaining,
      interestRate: loan.interestRate,
      total_installment: loan.total_installment,
      installment_start: __existed.start_date,
      installment_due: __existed.installment_date,
      paymentDate: __existed.given_at,
      pay: 0,
      overdue_balance: loan.overdue_balance,
      given_installment: __existed.installment,
      type_interest: loan.type_interest,
      pay_days: loan.delay_value,
      delay_value: loan.delay_charge,
    });
    setEdit(true);
  };

  const handleAddDelayCharge = () => {
    Post(`loan/delaycharge`, { id: id })
      .then((response) => {
        setRefresh(!refresh);
        AddAlert(MessageResponse(response), "success");
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  return (
    <Stack spacing={2}>
      <Payment
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleOnPayment}
        data={loan}
      />
      <EditInstallment
        open={edit}
        onClose={() => setEdit(false)}
        onSubmit={handleOnEdit}
        data={editData}
      />
      <Installment
        open={view}
        onClose={() => setView(false)}
        props={viewData}
      />
      <Stack direction="row" spacing={2}>
        <Stack sx={{ flex: 1, minWidth: 200 }}>
          <Stack component={Paper} spacing={2} sx={{ p: 4 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {useLang("สินเชื่อ", "Loan Summary")}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {loan?.loan_number}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("เลขที่สัญญา", "Loan Number")}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {loan?.plan}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("แผนสินเชื่อ", "Loan Plan")}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {loan?.interestRate} %
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("อัตราดอกเบี้ย", "Interset Rate(%)")}
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {toTHB(loan?.amount)}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("ยอดกู้", "Loan Amount")}
              </Box>
            </Stack>
            {/* <Divider />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {toTHB(Number(loan?.remaining) + Number(loan?.interest))}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("ยอดคงเหลือ", "Outstanding Balance")}
              </Box>
            </Stack> */}
            <Divider />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {toTHB(loan?.remaining)}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("ยอดคงเหลือ", "Loan Remaining")}
              </Box>
            </Stack>
            {/* <Divider />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {toTHB(loan?.interest)}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("ดอกเบี้ยคงเหลือ", "Loan Interest")}
              </Box>
            </Stack> */}
            <Divider />
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {toTHB(loan?.per_installment)}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("ยอดชำระ/งวด", "Per Installment")}
              </Box>
            </Stack>
            <Divider />

            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <Box component="span" sx={{}}>
                {toTHB(loan?.total_paid)}
              </Box>
              <Box component="span" sx={{ color: "#5b6e88" }}>
                {useLang("ยอดชำระรวม", "Given Installment")}
              </Box>
            </Stack>
            <Button variant="contained" onClick={handleOpen}>
              ชำระสินเชื่อ
            </Button>
            {/* <Button 
  variant="outlined" 
  color="warning"
  onClick={handleAddDelayCharge}
>
  เพิ่มค่าทวงถาม
</Button> */}
          </Stack>
        </Stack>
        <Stack sx={{ flex: 3 }}>
          <GridRender
            isLoading={isLoading}
            columns={columns}
            rows={data}
            thisPage={setPage}
            isTools={false}
            pages={pages}
            pageSize={setPageSize}
          />
          {/* <TableRender
            isTools={false}
            title="Loans Installments"
            fields={headers}
            data={data}
            thisPage={setPage}
            pages={pages}
          /> */}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default LoanInstallment;
