import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import ProjectsSlider from "../../components/Projects/ProjectsSlider";
import ProfessionalServices from "../../components/HomeThree/ProfessionalServices";
import Partner from "../../components/Common/Partner";
import Footer from "../../components/Layouts/Footer";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Projects"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Projects"
        bgImage="/images/page-title/bg-4.jpg"
      />

      <ProjectsSlider />

      <ProfessionalServices />

      <Partner />

      <Footer />
    </>
  );
}
