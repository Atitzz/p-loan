import React from "react";
import Navbar from "../../components/Layouts/Navbar";
import PageBanner from "../../components/Common/PageBanner";
import ContactForm from "../../components/Contact/ContactForm";
import Footer from "../../components/Layouts/Footer";

export default function Page() {
  return (
    <>
      <Navbar />

      <PageBanner
        pageTitle="ติดต่อ"
        homePageUrl="/"
        homePageText="หน้าแรก"
        activePageText="ติดต่อ"
        bgImage="/images/page-title/bg-3.jpg"
      />

      <ContactForm />

      <div className="map">
        <div className="container-fluid">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1937.99549578532!2d100.58328223847556!3d13.718995096667369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29fa53dbdad9f%3A0x19b616399a4bb397!2zMi82OSDguKrguLjguILguLjguKHguKfguLTguJcgNDIg4LmB4LiC4Lin4LiH4Lie4Lij4Liw4LmC4LiC4LiZ4LiHIOC5gOC4guC4leC4hOC4peC4reC4h-C5gOC4leC4oiDguIHguKPguLjguIfguYDguJfguJ7guKHguKvguLLguJnguITguKMgMTAxMTA!5e0!3m2!1sth!2sth!4v1721383216358!5m2!1sth!2sth" loading="lazy" ></iframe>
        </div>
      </div>

      <Footer />
    </>
  );
}
