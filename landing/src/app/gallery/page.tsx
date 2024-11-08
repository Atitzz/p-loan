import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import Footer from "../../components/Layouts/Footer";
import GalleryImages from "../../components/Gallery/GalleryImages";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Gallery"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Gallery"
        bgImage="/images/page-title/bg-6.jpg"
      />

      <GalleryImages />

      <Footer />
    </>
  );
}
