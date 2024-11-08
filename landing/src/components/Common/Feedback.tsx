"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const Feedback: React.FC = () => {
  return (
    <>
      <div className="clients-area ptb-100">
        <div className="container">
          <div className="section-title">
            <span>Clients words</span>
            <h2>What our clients say</h2>
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
              992: {
                slidesPerView: 2,
              },
            }}
            modules={[Pagination, Autoplay]}
            className="feedback-slider"
          >
            <SwiperSlide>
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client1.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>Markus Twain</h4>
                  <span>React Developer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client2.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>Jessica Molony</h4>
                  <span>Angular Developer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client3.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>Harry Nelis</h4>
                  <span>Technology Officer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client4.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>Lucy Vernall</h4>
                  <span>Chief Financial Officer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Feedback;
