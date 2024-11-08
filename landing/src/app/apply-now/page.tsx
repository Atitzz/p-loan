import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import Footer from "../../components/Layouts/Footer";
import ApplyNowForm from "../../components/ApplyNow/ApplyNowForm";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="ขอสินเชื่อ"
        homePageUrl="/"
        homePageText="หน้าแรก"
        activePageText="ขอสินเชื่อ"
        bgImage="/images/page-title/bg-2.jpg"
      />

      <ApplyNowForm />

      <Footer />
    </>
  );
}
