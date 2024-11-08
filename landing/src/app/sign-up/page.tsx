import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import Footer from "../../components/Layouts/Footer";
import SignUpForm from "../../components/Auth/SignUpForm";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="สมัครสมาชิก"
        homePageUrl="/"
        homePageText="หน้าแรก"
        activePageText="สมัครสมาชิก"
        bgImage="/images/page-title/bg-8.jpg"
      />

      <SignUpForm />

      <Footer />
    </>
  );
}
