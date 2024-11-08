"use client";

import React from "react";
import Image from "next/image";

const OurCompanyValues: React.FC = () => {
  return (
    <>
      <div className="company-area bg-color ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="company-content">
                <h3>Our company values</h3>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-idea"></i>
                  </div>
                  <h4>Innovative</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-talent"></i>
                  </div>
                  <h4>Talent</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-key"></i>
                  </div>
                  <h4>Enabling</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-responsibility"></i>
                  </div>
                  <h4>Commercially responsible</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="company-wrap">
                <Image
                  src="/images/company2.png"
                  alt="image"
                  width={630}
                  height={460}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurCompanyValues;
