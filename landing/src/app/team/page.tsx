import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import CallUsStyleTwo from "../../components/Common/CallUsStyleTwo";
import Footer from "../../components/Layouts/Footer";
import TeamMembaer from "../../components/Team/TeamMembaer";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Team"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Team"
        bgImage="/images/page-title/bg-9.jpg"
      />

      <TeamMembaer />

      <CallUsStyleTwo />

      <Footer />
    </>
  );
}
