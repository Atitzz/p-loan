"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const FeedbackStyleThree: React.FC = () => {
  return (
    <>
      <div className="clients-area bg-color ptb-100">
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
            slidesPerView={1}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination, Autoplay]}
            className="clients-slider"
          >
            <SwiperSlide>
              <div className="clients-item">
                <div className="row align-items-center">
                  <div className="col-lg-3">
                    <div className="clients-image">
                      <Image
                        src="/images/clients/man2.png"
                        alt="image"
                        width={215}
                        height={215}
                      />

                      <div className="icon-1">
                        <i className="flaticon-right-quote"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-9">
                    <div className="clients-info-text">
                      <p>
                        “Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Quis ipsum suspendisse ultrices
                        gravida. Risus commodo viverra maecenas accumsan lacus
                        vel facilisis.”
                      </p>
                      <h3>Debra C. Cowen</h3>
                      <span>Founder</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="clients-item">
                <div className="row align-items-center">
                  <div className="col-lg-3">
                    <div className="clients-image">
                      <Image
                        src="/images/clients/man2.png"
                        alt="image"
                        width={215}
                        height={215}
                      />

                      <div className="icon-1">
                        <i className="flaticon-right-quote"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-9">
                    <div className="clients-info-text">
                      <p>
                        “Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Quis ipsum suspendisse ultrices
                        gravida. Risus commodo viverra maecenas accumsan lacus
                        vel facilisis.”
                      </p>
                      <h3>Debra C. Cowen</h3>
                      <span>Founder</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="clients-item">
                <div className="row align-items-center">
                  <div className="col-lg-3">
                    <div className="clients-image">
                      <Image
                        src="/images/clients/man2.png"
                        alt="image"
                        width={215}
                        height={215}
                      />

                      <div className="icon-1">
                        <i className="flaticon-right-quote"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-9">
                    <div className="clients-info-text">
                      <p>
                        “Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Quis ipsum suspendisse ultrices
                        gravida. Risus commodo viverra maecenas accumsan lacus
                        vel facilisis.”
                      </p>
                      <h3>Debra C. Cowen</h3>
                      <span>Founder</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default FeedbackStyleThree;
