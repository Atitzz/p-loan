"use client";

import React from "react";
import Image from "next/image";

const GalleryImages: React.FC = () => {
  return (
    <>
      <div className="gallery-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery1.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Financial Planning</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery2.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Startup Funding</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery3.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Fund Management</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery4.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Investment Shares</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery5.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Strategy</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery6.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Finance</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery7.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Investments Loan</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery8.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Business Purpose</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <div className="image">
                  <Image
                    src="/images/gallery/gallery9.jpg"
                    alt="image"
                    width={440}
                    height={275}
                  />
                </div>
                <div className="content">
                  <h3>Commercial Loan</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryImages;
