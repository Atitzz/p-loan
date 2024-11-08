import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import Partner from "../../components/Common/Partner";
import Footer from "../../components/Layouts/Footer";
import TestimonialsCard from "../../components/Testimonials/TestimonialsCard";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="Testimonials"
        homePageUrl="/"
        homePageText="Home"
        activePageText="Testimonials"
        bgImage="/images/page-title/bg-3.jpg"
      />

      <TestimonialsCard />

      <Partner />

      <Footer />
    </>
  );
}
