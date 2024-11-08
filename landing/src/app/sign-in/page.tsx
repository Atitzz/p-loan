import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import Footer from "../../components/Layouts/Footer";
import SignInForm from "../../components/Auth/SignInForm";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Sign In"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Sign In"
        bgImage="/images/page-title/bg-7.jpg"
      />

      <SignInForm />

      <Footer />
    </>
  );
}
