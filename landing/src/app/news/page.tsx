import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import Footer from "../../components/Layouts/Footer";
import NewsCard from "../../components/News/NewsCard";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="News"
        homePageUrl="/"
        homePageText="Home"
        activePageText="News"
        bgImage="/images/page-title/bg-9.jpg"
      />

      <NewsCard />

      <Footer />
    </>
  );
}
