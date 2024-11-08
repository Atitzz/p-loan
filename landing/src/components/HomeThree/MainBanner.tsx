"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const MainBanner: React.FC = () => {
  return (
    <>
      <div
        className="main-banner-area bg-three"
        style={{
          backgroundImage: `url(/images/main-banner3.jpg)`,
        }}
      >
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="main-banner-content">
                    <h1>The funds have helped us move your business forward</h1>
                    <p>
                      Loans are advantageous as a relatively inexpensive way of
                      borrowing money. Start or grow your own business
                    </p>

                    <div className="banner-btn">
                      <Link href="/services" className="default-btn">
                        View more <span></span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="banner-image">
                    <Image
                      src="/images/vector.png"
                      alt="image"
                      width={830}
                      height={765}
                    />
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

export default MainBanner;
