import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import LoanCalculatorForm from "../../components/LoanCalculator/LoanCalculatorForm";
import LoanTable from "../../components/LoanCalculator/LoanTable";
import Footer from "../../components/Layouts/Footer";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Loan Calculator"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Loan Calculator"
        bgImage="/images/page-title/bg-7.jpg"
      />

      <LoanCalculatorForm />

      <LoanTable />

      <Footer />
    </>
  );
}
