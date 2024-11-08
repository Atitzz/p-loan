"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const LoansContent: React.FC = () => {
  return (
    <>
      <div className="loan-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="loan-image">
                <Image
                  src="/images/loan.png"
                  alt="image"
                  width={500}
                  height={480}
                />

                <div
                  className="loan-shape"
                  style={{
                    backgroundImage: `url(/images/about/about-shape.png)`,
                  }}
                >
                  <div className="text">
                    <Image
                      src="/images/logo.png"
                      alt="image"
                      width={150}
                      height={53}
                    />
                    <span>We believe in those made to do more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="loan-content">
                <h3>What is a leza loan?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida. Quis ipsum
                  suspendisse ultrices gravida
                </p>

                <ul className="list">
                  <li>Unsecured loans of between $500 - $5,000</li>
                  <li>Borrow over 1-5 years at a fixed interest rate of 6%</li>
                  <li>FREE mentoring for the first year of the loan</li>
                  <li>No minimum trading requirement.</li>
                </ul>

                <h4>Resources to help you with your Loan</h4>

                <ul className="loan-list">
                  <li>
                    <i className="flaticon-check"></i>
                    Business Plan
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    Budget Planner
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    Cashflow Forecast
                  </li>
                </ul>

                <div className="loan-btn">
                  <Link href="/apply-now" className="default-btn">
                    Apply now <span></span>
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

export default LoansContent;
