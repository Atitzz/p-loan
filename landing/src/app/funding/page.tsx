import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import AboutFunding from "../../components/Funding/AboutFunding";
import WhyPeopleChooseUsTwo from "../../components/Common/WhyPeopleChooseUsTwo";
import HowItWork from "../../components/Funding/HowItWorks";
import ApplyForFunding from "../../components/Funding/ApplyForFunding";
import Footer from "../../components/Layouts/Footer";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Funding"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Funding"
        bgImage="/images/page-title/bg-5.jpg"
      />

      <AboutFunding />

      <WhyPeopleChooseUsTwo />

      <HowItWork />

      <ApplyForFunding />

      <Footer />
    </>
  );
}
