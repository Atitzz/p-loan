import ContactUS from "@/controller/contact_us/ContactUS";
import Dashboard from "@/controller/dashboard/Dashboard";
import ViewDeposits from "@/controller/deposits/ViewDeposits";
import FileManager from "@/controller/file_manager/FileManager";
// import Guarantee from "@/controller/guarantee/Guarantee";
// import Guarantee_Form from "@/controller/guarantee/Guarantee_Form";
import Loan_Apply_Now from "@/controller/loan_apply_now/Loan_Apply_Now";
import AddLoanContract from "@/controller/loans/AddLoanContract";
import LoanDetails from "@/controller/loans/LoanDetails";
import LoanInstallment from "@/controller/loans/LoanInstallment";
import ViewLoans from "@/controller/loans/ViewLoans";
import Permission from "@/controller/permissions/Permission";
import Permission_Form from "@/controller/permissions/Permission_Form";
import Policy from "@/controller/policy/Policy";
import Policy_Form from "@/controller/policy/Policy_Form";
import Property from "@/controller/property/Property";
import Property_Form from "@/controller/property/Property_Form";
import ReportDebt from "@/controller/report/ReportDebt";
import ReportDue from "@/controller/report/ReportDue";
import ReportLoan1 from "@/controller/report/ReportLoan1";
import ReportLoan2 from "@/controller/report/ReportLoan2";
import ReportLoan3 from "@/controller/report/ReportLoan3";
import ReportLogs from "@/controller/report/ReportLogs";
import ReportNew from "@/controller/report/ReportNew";
import ReportPaid from "@/controller/report/ReportPaid";
import ReportRemaining from "@/controller/report/ReportRemaining";
import ReportStamp from "@/controller/report/ReportStamp";
import ReportTax from "@/controller/report/ReportTax";
import ReportTransaction from "@/controller/report/ReportTransaction";
import ReportPayment from "@/controller/report/ReportPayment";
import Roles from "@/controller/roles/Roles";
import Roles_Form from "@/controller/roles/Roles_Form";
import FormPlans from "@/controller/settings/FormPlans";
import LoansPlans from "@/controller/settings/LoansPlans";
import PlansCategories from "@/controller/settings/PlansCategories";
import Settings from "@/controller/settings/Settings";
import System_Users from "@/controller/system_users/System_Users";
import ViewSystemUsers from "@/controller/system_users/ViewSystemUsers";
import UserCreate from "@/controller/Users/UserCreate";
import UserDetails from "@/controller/Users/UserDetails";
import UserKYC from "@/controller/Users/UserKYC";
import ViewKYC from "@/controller/Users/ViewKYC";
import ViewUsers from "@/controller/Users/ViewUsers";
import ViewWithdrawals from "@/controller/withdrawals/ViewWithdrawals";
import LoanAlert_BeforeDue from "@/controller/loan_alert/LoanAlert_BeforeDue";
import LoanAlert_OverDue from "@/controller/loan_alert/LoanAlert_OverDue";
import { Box, InputLabel, Stack } from "@mui/material";
import AddInstallment from "@/controller/loans/AddInstallment";
import Advert from "@/controller/advert/Advert"
import Advert_Form from "@/controller/advert/Advert_Form"

export const routeDict: { [key: string]: JSX.Element } = {
  default: (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
      <Box component="h1">Error 404!</Box>
      <InputLabel>
        The Page you Requested does not exist of has moved.
      </InputLabel>
    </Stack>
  ),
  dashboard_page: <Dashboard />,
  system_users_action: <System_Users/>,
  system_users_view: <ViewSystemUsers/>,
  loans_addcontract: <AddLoanContract />,
  loans_page: <ViewLoans />,
  loans_details: <LoanDetails />,
  add_installment:<AddInstallment/>,
  loans_installments:<LoanInstallment/>,
  loan_plans:<LoansPlans/>,
  form_plans:<FormPlans/>,
  plans_categories:<PlansCategories/>,
  deposits_page: <ViewDeposits/>,
  withdrawals_page: <ViewWithdrawals/>,
  users_page: <ViewUsers />,
  users_details: <UserDetails />,
  users_create: <UserCreate />,
  users_kyc: <UserKYC />,
  kyc_page: <ViewKYC />,
  loan_apply_now: <Loan_Apply_Now />,
  contact_us:<ContactUS/>,
  policy:<Policy/>,
  policy_forms:<Policy_Form/>,
  roles:<Roles/>,
  roles_forms:<Roles_Form/>,
  permissions:<Permission/>,
  permissions_forms:<Permission_Form/>,
  // guarantee:<Guarantee/>,
  // guarantee_form:<Guarantee_Form/>,
  property:<Property/>,
  property_form:<Property_Form/>,
  file_manager: <FileManager />,
  settings: <Settings />,
  report_transaction: <ReportTransaction/>,
  report_new: <ReportNew/>,
  report_paid: <ReportPaid/>,
  report_debt: <ReportDebt/>,
  report_due: <ReportDue/>,
  report_remaining: <ReportRemaining/>,
  report_loan1: <ReportLoan1/>,
  report_loan2: <ReportLoan2/>,
  report_loan3: <ReportLoan3/>,
  report_tax: <ReportTax/>,
  report_stamp: <ReportStamp/>,
  report_logs: <ReportLogs/>,
  report_payment: <ReportPayment/>,
  loanalert_beforedue: <LoanAlert_BeforeDue />,
  loanalert_overdue: <LoanAlert_OverDue />,
  advert: <Advert />,
  advert_form: <Advert_Form />,
};

export const getComponent = (route: string): JSX.Element => {
  return (
    routeDict[route] || (
      <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
        <Box component="h1">Error 404!</Box>
        <InputLabel>
          The Page you Requested does not exist of has moved.
        </InputLabel>
      </Stack>
    )
  );
};
