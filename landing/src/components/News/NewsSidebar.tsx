"use client";
  
import React from "react";
import Link from "next/link";

const NewsSidebar: React.FC = () => {
  return (
    <>
      <div className="widget-area" id="secondary">
        <div className="widget widget_search">
          <form className="search-form search-top">
            <label>
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

        <div className="widget widget_posts_thumb">
          <h3 className="widget-title">Recent Posts</h3>
          <div className="item">
            <Link href="/news/details" className="thumb">
              <span
                className="fullimage cover"
                role="img"
                style={{ backgroundImage: `url(/images/blog/blog1.jpg)` }}
              ></span>
            </Link>
            <div className="info">
              <h4 className="title usmall">
                <Link href="/news/details">
                  Customer experience more important
                </Link>
              </h4>
              <p className="time">06-07-2020</p>
            </div>
          </div>

          <div className="item">
            <Link href="/news/details" className="thumb">
              <span
                className="fullimage cover"
                role="img"
                style={{ backgroundImage: `url(/images/blog/blog2.jpg)` }}
              ></span>
            </Link>
            <div className="info">
              <h4 className="title usmall">
                <Link href="/news/details">
                  Start up loans here for the long time
                </Link>
              </h4>
              <p className="time">06-07-2020</p>
            </div>
          </div>

          <div className="item">
            <Link href="/news/details" className="thumb">
              <span
                className="fullimage cover"
                role="img"
                style={{ backgroundImage: `url(/images/blog/blog3.jpg)` }}
              ></span>
            </Link>
            <div className="info">
              <h4 className="title usmall">
                <Link href="/news/details">
                  Eligibility and criteria for business loans
                </Link>
              </h4>
              <p className="time">06-07-2020</p>
            </div>
          </div>
        </div>

        <div className="widget widget_categories">
          <h3 className="widget-title">Categories</h3>
          <ul>
            <li>
              <Link href="/news">Agricultural loan</Link>
            </li>
            <li>
              <Link href="/news">Business loan</Link>
            </li>
            <li>
              <Link href="/news">House loan</Link>
            </li>
            <li>
              <Link href="/news">Personal loan</Link>
            </li>
            <li>
              <Link href="/news">Education loan</Link>
            </li>
            <li>
              <Link href="/news">Payday Loan</Link>
            </li>
            <li>
              <Link href="/news">Vehicle loan</Link>
            </li>
            <li>
              <Link href="/news">Medical loan</Link>
            </li>
            <li>
              <Link href="/news">StartUp loan</Link>
            </li>
          </ul>
        </div>

        <div className="widget widget_tag_cloud">
          <h3 className="widget-title">Tags</h3>
          <div className="tagcloud section-bottom">
            <Link href="/news">Business</Link>

            <Link href="/news">Growth</Link>

            <Link href="/news">Loan</Link>

            <Link href="/news">Funds</Link>

            <Link href="/news">Speed</Link>

            <Link href="/news">Investment</Link>

            <Link href="/news">Payment</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsSidebar;
