import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import FaqContent from "../../components/Faq/FaqContent";
import CallUsStyleTwo from "../../components/Common/CallUsStyleTwo";
import Footer from "../../components/Layouts/Footer";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="ถามตอบ"
        homePageUrl="/"
        homePageText="หน้าแรก"
        activePageText="ถามตอบ"
        bgImage="/images/page-title/bg-4.jpg"
      />

      <FaqContent />

      <CallUsStyleTwo />

      <Footer />
    </>
  );
}
