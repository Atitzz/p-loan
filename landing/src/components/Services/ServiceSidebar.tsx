"use client";
  
import React from "react";
import Link from "next/link";

const ServiceSidebar: React.FC = () => {
  return (
    <>
      <div className="widget-area pr-15" id="secondary">
        <div className="widget widget_search">
          <form className="search-form search-top">
            <label>
              <span className="screen-reader-text">Search for:</span>
              <input
                type="search"
                className="search-field"
                placeholder="Search Here"
              />
            </label>
            <button type="submit">
              <i className="bx bx-search-alt"></i>
            </button>
          </form>
        </div>

        <div className="widget widget_categories">
          <h3 className="widget-title">Categories</h3>
          <ul>
            <li>
              <Link href="/services/details">Agricultural loan</Link>
            </li>
            <li>
              <Link href="/services/details">Business loan</Link>
            </li>
            <li>
              <Link href="/services/details">House loan</Link>
            </li>
            <li>
              <Link href="/services/details">Personal loan</Link>
            </li>
            <li>
              <Link href="/services/details">Education loan</Link>
            </li>
            <li>
              <Link href="/services/details">Payday Loan</Link>
            </li>
            <li>
              <Link href="/services/details">Vehicle loan</Link>
            </li>
            <li>
              <Link href="/services/details">Medical loan</Link>
            </li>
            <li>
              <Link href="/services/details">StartUp loan</Link>
            </li>
          </ul>
        </div>

        <div className="widget widget_hours">
          <h3 className="widget-title">Opening Hours</h3>
          <ul>
            <li>
              Mon – Thurs
              <span>8:00 AM - 5:00 PM</span>
            </li>
            <li>
              Fri - Satur
              <span>8:00 AM - 3:00 PM</span>
            </li>
            <li>
              Sun
              <span>CLOSED</span>
            </li>
          </ul>
        </div>

        <div className="widget widget_appointment">
          <h3 className="widget-title">Book an Appointment</h3>

          <form id="contactForm">
            <div className="form-group">
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                placeholder="Name"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                placeholder="Email"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="phone_number"
                id="phone_number"
                className="form-control"
                placeholder="Phone"
              />
            </div>

            <button type="submit" className="btn default-btn">
              Send Message <span></span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ServiceSidebar;
