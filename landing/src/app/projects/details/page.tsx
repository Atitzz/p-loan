import React from "react";
import Navbar from "../../../components/Layouts/Navbar";
import PageBanner from "../../../components/Common/PageBanner";
import CallUsStyleTwo from "../../../components/Common/CallUsStyleTwo";
import Footer from "../../../components/Layouts/Footer";
import ProjectDetailsContent from "../../../components/Projects/ProjectDetailsContent";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Project Details"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Project Details"
        bgImage="/images/page-title/bg-3.jpg"
      />

      <ProjectDetailsContent />

      <CallUsStyleTwo />

      <Footer />
    </>
  );
}
