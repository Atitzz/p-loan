import React from "react";
import Navbar from "../../../components/Layouts/Navbar";
import PageBanner from "../../../components/Common/PageBanner";
import Footer from "../../../components/Layouts/Footer";
import NewsDetailsContent from "../../../components/News/NewsDetailsContent";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="News Details"
        homePageUrl="/"
        homePageText="Home"
        activePageText="News Details"
        bgImage="/images/page-title/bg-1.jpg"
      />

      <NewsDetailsContent />

      <Footer />
    </>
  );
}
