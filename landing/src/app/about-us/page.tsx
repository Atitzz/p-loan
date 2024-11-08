import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import AboutUsContent from "../../components/AboutUs/AboutUsContent";
import WhyPeopleChooseUsTwo from "../../components/Common/WhyPeopleChooseUsTwo";
import Feedback from "../../components/Common/Feedback";
import TeamMember from "../../components/Common/TeamMember";
import PartnerStyleTwo from "../../components/Common/PartnerStyleTwo";
import CallUsStyleTwo from "../../components/Common/CallUsStyleTwo";
import Footer from "../../components/Layouts/Footer";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="เกี่ยวกับ"
        homePageUrl="/"
        homePageText="หน้าแรก"
        activePageText="เกี่ยวกับ"
        bgImage="/images/page-title/bg-1.jpg"
      />

      <AboutUsContent />

      <WhyPeopleChooseUsTwo />

      {/* <Feedback /> */}

      {/* <TeamMember /> */}

      {/* <PartnerStyleTwo /> */}

      <CallUsStyleTwo />

      <Footer />
    </>
  );
}
