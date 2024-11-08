import React from "react";
import Navbar from "../../../components/Layouts/Navbar";
import PageBanner from "../../../components/Common/PageBanner";
import CallUsStyleTwo from "../../../components/Common/CallUsStyleTwo";
import Footer from "../../../components/Layouts/Footer";
import ServicesDetailsContent from "../../../components/Services/ServicesDetailsContent";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Services Details"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Services Details"
        bgImage="/images/page-title/bg-6.jpg"
      />

      <ServicesDetailsContent />

      <CallUsStyleTwo />

      <Footer />
    </>
  );
}
