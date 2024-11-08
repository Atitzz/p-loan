"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ProfessionalServices: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("tab1");

  const openTabSection = (
    evt: React.MouseEvent<HTMLLIElement>,
    tabName: string
  ) => {
    const tabcontent = document.getElementsByClassName("tabs_item");
    for (let i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).classList.remove("fadeInUp");
      (tabcontent[i] as HTMLElement).style.display = "none";
    }

    const tablinks = document.getElementsByTagName("li");
    for (let i = 0; i < tablinks.length; i++) {
      (tablinks[i] as HTMLElement).className = (
        tablinks[i] as HTMLElement
      ).className.replace("current", "");
    }

    const currentTabElement = document.getElementById(tabName);
    if (currentTabElement) {
      currentTabElement.style.display = "block";
      currentTabElement.className += " fadeInUp animated";
    }
    (evt.currentTarget as HTMLElement).className += " current";
    setCurrentTab(tabName);
  };

  return (
    <>
      <div className="best-services-area bg-color ptb-100">
        <div className="container">
          <div className="section-title">
            <span>Knowledge of the market</span>
            <h2>Only the best professional services</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
            </p>
          </div>

          <div className="tab services-list-tab">
            <ul className="tabs-list">
              <li
                className={currentTab === "tab1" ? "current" : ""}
                onClick={(e) => openTabSection(e, "tab1")}
              >
                <i className="flaticon-agriculture"></i>
                <span>Agricultural loan</span>
              </li>

              <li
                className={currentTab === "tab2" ? "current" : ""}
                onClick={(e) => openTabSection(e, "tab2")}
              >
                <i className="flaticon-personal"></i>
                <span>Personal loan</span>
              </li>

              <li
                className={currentTab === "tab3" ? "current" : ""}
                onClick={(e) => openTabSection(e, "tab3")}
              >
                <i className="flaticon-loan-1"></i>
                <span>Business loan</span>
              </li>

              <li
                className={currentTab === "tab4" ? "current" : ""}
                onClick={(e) => openTabSection(e, "tab4")}
              >
                <i className="flaticon-scholarship"></i>
                <span>Education loan</span>
              </li>

              <li
                className={currentTab === "tab5" ? "current" : ""}
                onClick={(e) => openTabSection(e, "tab5")}
              >
                <i className="flaticon-loan-2"></i>
                <span>House loan</span>
              </li>

              <li
                className={currentTab === "tab6" ? "current" : ""}
                onClick={(e) => openTabSection(e, "tab6")}
              >
                <i className="flaticon-loan-3"></i>
                <span>Payday loan</span>
              </li>
            </ul>

            <div className="tab_content">
              <div
                id="tab1"
                className={`tabs_item ${
                  currentTab === "tab1" ? "fadeInUp" : ""
                }`}
              >
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="services-tab-content">
                      <h3>About Agricultural loan</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <h3>Get financing for whatever you need now</h3>
                      <ul className="list">
                        <li>New home</li>
                        <li>Home improvement loan</li>
                        <li>Home renovation</li>
                        <li>Land purchase</li>
                      </ul>

                      <h3>Agricultural loan - Eligibility</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <Link href="/services/details" className="default-btn">
                        Learn more <span></span>
                      </Link>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="services-tab-image1">
                      <Image
                        src="/images/services-tab2.png"
                        alt="image"
                        width={805}
                        height={415}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="tab2"
                className={`tabs_item ${
                  currentTab === "tab2" ? "fadeInUp" : ""
                }`}
              >
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="services-tab-content">
                      <h3>About Personal loan</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <h3>Get financing for whatever you need now</h3>
                      <ul className="list">
                        <li>New home</li>
                        <li>Home improvement loan</li>
                        <li>Home renovation</li>
                        <li>Land purchase</li>
                      </ul>

                      <h3>Personal loan - Eligibility</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <Link href="/services/details" className="default-btn">
                        Learn more <span></span>
                      </Link>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="services-tab-image1">
                      <Image
                        src="/images/services-tab2.png"
                        alt="image"
                        width={805}
                        height={415}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="tab3"
                className={`tabs_item ${
                  currentTab === "tab3" ? "fadeInUp" : ""
                }`}
              >
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="services-tab-content">
                      <h3>About Business loan</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <h3>Get financing for whatever you need now</h3>
                      <ul className="list">
                        <li>New home</li>
                        <li>Home improvement loan</li>
                        <li>Home renovation</li>
                        <li>Land purchase</li>
                      </ul>

                      <h3>Business loan - Eligibility</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <Link href="/services/details" className="default-btn">
                        Learn more <span></span>
                      </Link>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="services-tab-image1">
                      <Image
                        src="/images/services-tab2.png"
                        alt="image"
                        width={805}
                        height={415}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="tab4"
                className={`tabs_item ${
                  currentTab === "tab4" ? "fadeInUp" : ""
                }`}
              >
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="services-tab-content">
                      <h3>About Education loan</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <h3>Get financing for whatever you need now</h3>
                      <ul className="list">
                        <li>New home</li>
                        <li>Home improvement loan</li>
                        <li>Home renovation</li>
                        <li>Land purchase</li>
                      </ul>

                      <h3>Education loan - Eligibility</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <Link href="/services/details" className="default-btn">
                        Learn more <span></span>
                      </Link>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="services-tab-image1">
                      <Image
                        src="/images/services-tab2.png"
                        alt="image"
                        width={805}
                        height={415}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="tab5"
                className={`tabs_item ${
                  currentTab === "tab5" ? "fadeInUp" : ""
                }`}
              >
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="services-tab-content">
                      <h3>About Home Loan</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <h3>Get financing for whatever you need now</h3>
                      <ul className="list">
                        <li>New home</li>
                        <li>Home improvement loan</li>
                        <li>Home renovation</li>
                        <li>Land purchase</li>
                      </ul>

                      <h3>Home Loan - Eligibility</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <Link href="/services/details" className="default-btn">
                        Learn more <span></span>
                      </Link>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="services-tab-image1">
                      <Image
                        src="/images/services-tab2.png"
                        alt="image"
                        width={805}
                        height={415}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="tab6"
                className={`tabs_item ${
                  currentTab === "tab6" ? "fadeInUp" : ""
                }`}
              >
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="services-tab-content">
                      <h3>About Payday loan</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <h3>Get financing for whatever you need now</h3>
                      <ul className="list">
                        <li>New home</li>
                        <li>Home improvement loan</li>
                        <li>Home renovation</li>
                        <li>Land purchase</li>
                      </ul>

                      <h3>Payday loan - Eligibility</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>

                      <Link href="/services/details" className="default-btn">
                        Learn more <span></span>
                      </Link>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="services-tab-image1">
                      <Image
                        src="/images/services-tab2.png"
                        alt="image"
                        width={805}
                        height={415}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalServices;
