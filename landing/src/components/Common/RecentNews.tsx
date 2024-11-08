"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const RecentNews: React.FC = () => {
  return (
    <>
      <div className="blog-area pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <span>Recent news</span>
            <h2>Success story posts</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
            </p>
          </div>

          <div className="row justify-contenct-center">
            <div className="col-lg-4 col-md-6">
              <div className="blog-item">
                <div className="image">
                  <Link href="/news/details">
                    <Image
                      src="/images/blog/blog1.jpg"
                      alt="image"
                      width={390}
                      height={260}
                    />
                  </Link>
                </div>
                <div className="content">
                  <span>July 05, 2024</span>
                  <h3>
                    <Link href="/news/details">
                      Financing loans available to small businesses
                    </Link>
                  </h3>
                  <Link href="/news/details" className="blog-btn">
                    Read More
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="blog-item">
                <div className="image">
                  <Link href="/news/details">
                    <Image
                      src="/images/blog/blog2.jpg"
                      alt="image"
                      width={390}
                      height={260}
                    />
                  </Link>
                </div>
                <div className="content">
                  <span>July 04, 2024</span>
                  <h3>
                    <Link href="/news/details">
                      5 Ways you can prepare your business for success
                    </Link>
                  </h3>
                  <Link href="/news/details" className="blog-btn">
                    Read More
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="blog-item">
                <div className="image">
                  <Link href="/news/details">
                    <Image
                      src="/images/blog/blog3.jpg"
                      alt="image"
                      width={390}
                      height={260}
                    />
                  </Link>
                </div>
                <div className="content">
                  <span>July 03, 2024</span>
                  <h3>
                    <Link href="/news/details">
                      Tips for saving money and better guide for investment
                    </Link>
                  </h3>
                  <Link href="/news/details" className="blog-btn">
                    Read More
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

export default RecentNews;
