import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import CallUsStyleTwo from "../../components/Common/CallUsStyleTwo";
import Footer from "../../components/Layouts/Footer";
import ServicesCard from "../../components/Services/ServicesCard";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="บริการ"
        homePageUrl="/"
        homePageText="หน้าแรก"
        activePageText="บริการ"
        bgImage="/images/page-title/bg-5.jpg"
      />

      <ServicesCard />

      <CallUsStyleTwo />

      <Footer />
    </>
  );
}
