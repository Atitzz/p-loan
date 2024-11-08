"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const AboutCompany: React.FC = () => {
  return (
    <>
      <div className="about-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-wrap">
                <Image
                  src="/images/about/about3.png"
                  alt="image"
                  width={498}
                  height={480}
                />

                <div
                  className="about-shape"
                  style={{
                    backgroundImage: `url(/images/about/about-shape.png)`,
                  }}
                >
                  <div className="text">
                    <h3>25</h3>
                    <span>Years Of Experience</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-content">
                <span>About company</span>
                <h3>
                  We have been working very efficiently with loan and funding
                  for 25 years.
                </h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.{" "}
                </p>
                <strong>In business, we focus on 3 things.</strong>

                <ul className="about-list">
                  <li>
                    <i className="flaticon-check"></i>
                    Useful info
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    Reliability
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    Innovation
                  </li>
                </ul>

                <div className="about-btn">
                  <Link href="/about-us" className="default-btn">
                    View more <span></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutCompany;
