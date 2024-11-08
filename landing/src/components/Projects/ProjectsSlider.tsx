"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const ProjectsSlider: React.FC = () => {
  return (
    <>
      <div className="projects-area ptb-100">
        <div className="container">
          <div className="section-title">
            <span>Our projects</span>
            <h2>All the work that we do</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
            </p>
          </div>

          <Swiper
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 4,
              },
            }}
            modules={[Pagination, Autoplay]}
            className="projects-slider"
          >
            <SwiperSlide>
              <div className="projects-item">
                <Link href="/projects/details">
                  <Image
                    src="/images/projects/project1.jpg"
                    alt="image"
                    width={285}
                    height={350}
                  />
                </Link>
                <div className="content">
                  <h3>
                    <Link href="/projects/details">Financial Planning</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="projects-item">
                <Link href="/projects/details">
                  <Image
                    src="/images/projects/project2.jpg"
                    alt="image"
                    width={285}
                    height={350}
                  />
                </Link>
                <div className="content">
                  <h3>
                    <Link href="/projects/details">Startup Funding</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="projects-item">
                <Link href="/projects/details">
                  <Image
                    src="/images/projects/project3.jpg"
                    alt="image"
                    width={285}
                    height={350}
                  />
                </Link>
                <div className="content">
                  <h3>
                    <Link href="/projects/details">Fund Management</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="projects-item">
                <Link href="/projects/details">
                  <Image
                    src="/images/projects/project4.jpg"
                    alt="image"
                    width={285}
                    height={350}
                  />
                </Link>
                <div className="content">
                  <h3>
                    <Link href="/projects/details">Investment Shares</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="projects-item">
                <Link href="/projects/details">
                  <Image
                    src="/images/projects/project5.jpg"
                    alt="image"
                    width={285}
                    height={350}
                  />
                </Link>
                <div className="content">
                  <h3>
                    <Link href="/projects/details">Financial Planning</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="projects-item">
                <Link href="/projects/details">
                  <Image
                    src="/images/projects/project6.jpg"
                    alt="image"
                    width={285}
                    height={350}
                  />
                </Link>
                <div className="content">
                  <h3>
                    <Link href="/projects/details">Startup Funding</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="projects-item">
                <Link href="/projects/details">
                  <Image
                    src="/images/projects/project7.jpg"
                    alt="image"
                    width={285}
                    height={350}
                  />
                </Link>
                <div className="content">
                  <h3>
                    <Link href="/projects/details">Fund Management</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="projects-item">
                <Link href="/projects/details">
                  <Image
                    src="/images/projects/project8.jpg"
                    alt="image"
                    width={285}
                    height={350}
                  />
                </Link>
                <div className="content">
                  <h3>
                    <Link href="/projects/details">Investment Shares</Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ProjectsSlider;
