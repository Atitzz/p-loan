"use client";

import React from "react";
import Link from "next/link";
import NewsSidebar from "./NewsSidebar";
import Image from "next/image";

const NewsCard: React.FC = () => {
  return (
    <>
      <div className="blog-area ptb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="single-blog">
                    <div className="image">
                      <Link href="/news/details">
                        <Image
                          src="/images/blog/blog4.jpg"
                          alt="image"
                          width={810}
                          height={500}
                        />
                      </Link>
                    </div>

                    <ul className="post-meta">
                      <li>
                        <i className="bx bx-calendar"></i>
                        July 05, 2024
                      </li>
                      <li>
                        <i className="bx bx-user"></i>
                        <Link href="#">Admin</Link>
                      </li>
                      <li>
                        <i className="bx bx-comment"></i>
                        No Comments
                      </li>
                    </ul>

                    <div className="content">
                      <h3>
                        <Link href="/news/details">
                          Financing loans available to small businesses
                        </Link>
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore dolore magna
                        aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                        commodo viverra maecenas accumsan lacus vel facilisis.
                        At vero eos et accusam et justo duo dolores et ea rebum.
                      </p>

                      <div className="blog-btn">
                        <Link href="/news/details" className="default-btn">
                          Read More <span></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-blog">
                    <div className="image">
                      <Link href="/news/details">
                        <Image
                          src="/images/blog/blog5.jpg"
                          alt="image"
                          width={810}
                          height={500}
                        />
                      </Link>
                    </div>

                    <ul className="post-meta">
                      <li>
                        <i className="bx bx-calendar"></i>
                        July 04, 2024
                      </li>
                      <li>
                        <i className="bx bx-user"></i>
                        <Link href="#">Admin</Link>
                      </li>
                      <li>
                        <i className="bx bx-comment"></i>
                        No Comments
                      </li>
                    </ul>

                    <div className="content">
                      <h3>
                        <Link href="/news/details">
                          5 Ways you can prepare your business for success
                        </Link>
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore dolore magna
                        aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                        commodo viverra maecenas accumsan lacus vel facilisis.
                        At vero eos et accusam et justo duo dolores et ea rebum.
                      </p>

                      <div className="blog-btn">
                        <Link href="/news/details" className="default-btn">
                          Read More <span></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-blog">
                    <div className="image">
                      <Link href="/news/details">
                        <Image
                          src="/images/blog/blog6.jpg"
                          alt="image"
                          width={810}
                          height={500}
                        />
                      </Link>
                    </div>

                    <ul className="post-meta">
                      <li>
                        <i className="bx bx-calendar"></i>
                        July 03, 2024
                      </li>
                      <li>
                        <i className="bx bx-user"></i>
                        <Link href="#">Admin</Link>
                      </li>
                      <li>
                        <i className="bx bx-comment"></i>
                        No Comments
                      </li>
                    </ul>

                    <div className="content">
                      <h3>
                        <Link href="/news/details">
                          Tips for saving money and better guide for investment
                        </Link>
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore dolore magna
                        aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                        commodo viverra maecenas accumsan lacus vel facilisis.
                        At vero eos et accusam et justo duo dolores et ea rebum.
                      </p>

                      <div className="blog-btn">
                        <Link href="/news/details" className="default-btn">
                          Read More <span></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-blog">
                    <div className="image">
                      <Link href="/news/details">
                        <Image
                          src="/images/blog/blog7.jpg"
                          alt="image"
                          width={810}
                          height={500}
                        />
                      </Link>
                    </div>

                    <ul className="post-meta">
                      <li>
                        <i className="bx bx-calendar"></i>
                        July 02, 2024
                      </li>
                      <li>
                        <i className="bx bx-user"></i>
                        <Link href="#">Admin</Link>
                      </li>
                      <li>
                        <i className="bx bx-comment"></i>
                        No Comments
                      </li>
                    </ul>

                    <div className="content">
                      <h3>
                        <Link href="/news/details">
                          Need financial help to open again your business
                        </Link>
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore dolore magna
                        aliqua. Quis ipsum suspendisse ultrices gravida. Risus
                        commodo viverra maecenas accumsan lacus vel facilisis.
                        At vero eos et accusam et justo duo dolores et ea rebum.
                      </p>

                      <div className="blog-btn">
                        <Link href="/news/details" className="default-btn">
                          Read More <span></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="col-lg-12 col-md-12">
                  <div className="pagination-area">
                    <Link href="#" className="next page-numbers">
                      <i className="bx bx-chevron-left"></i>
                    </Link>

                    <Link href="#" className="page-numbers current">
                      1
                    </Link>

                    <Link href="#" className="page-numbers">
                      2
                    </Link>

                    <Link href="#" className="page-numbers">
                      3
                    </Link>

                    <Link href="#" className="page-numbers">
                      4
                    </Link>

                    <Link href="#" className="next page-numbers">
                      <i className="bx bx-chevron-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12">
              <NewsSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsCard;
