"use client";

import React from "react";
import Link from "next/link";

const MainBanner: React.FC = () => {
  return (
    <>
      {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" /> */}
      <div
        className="main-banner-area"
        style={{
          backgroundImage: `url(/images/main-banner.webp)`,
        }}
      >
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container-fluid">
              {/* <div className="main-banner-content">
                <span>Money for you</span>
                <h1>สินเชื่อเพื่อคุณ</h1>
                <p>
                  ต้องการเริ่มต้นหรือขยายธุรกิจ เราพร้อมที่จะเป็นส่วนหนึ่งในความสำเร็จของคุณ
                </p>

                <div className="banner-btn">
                  <Link href="line://ti/p/@830hhlhc" className="default-btn">
                    เพิ่มเติม <span></span>
                  </Link>
                </div>
              </div> */}

              <div className="banner-social-buttons">
                <ul>
                  <li>
                    <span>ช่องทาง</span>
                  </li>
                  <li>
                    <a href="https://www.twitter.com/" target="_blank">
                      <i className="flaticon-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank">
                      <i className="flaticon-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/" target="_blank">
                      <i className="flaticon-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" target="_blank">
                      <i className="flaticon-linkedin"></i>
                    </a>
                  </li>
                  <li>
                    <a href="line://ti/p/@830hhlhc" target="_blank">
                      <i className="fab fa-line" style={{ fontSize: '19px' }}></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Approvals Area */}
        <div className="approvals-area" >
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="approvals-content">
                  <div className="icon">
                    <i className="flaticon-loan"></i>
                  </div>
                  <span>อนุมัติง่าย</span>
                  <p>ได้ทันที</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="approvals-content">
                  <div className="icon">
                    <i className="flaticon-satisfaction"></i>
                  </div>
                  <span>20,000</span>
                  <p>ความพึงพอใจของลูกค้า</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 offset-lg-0 offset-md-3">
                <div className="approvals-content">
                  <div className="icon">
                    <i className="flaticon-document"></i>
                  </div>
                  <span>ไม่มีการชําระเงินล่วงหน้าหรือ</span>
                  <p>ค่าธรรมเนียมแอบแฝง</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainBanner;
