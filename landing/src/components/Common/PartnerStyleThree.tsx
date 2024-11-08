"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

const PartnerStyleThree: React.FC = () => {
  return (
    <>
      <div className="partner-area bg-f5f4ef ptb-100">
        <div className="container">
          <Swiper
            spaceBetween={30}
            breakpoints={{
              0: {
                slidesPerView: 2,
              },
              576: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 5,
              },
            }}
            modules={[Autoplay]}
            className="partner-slider"
          >
            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner6.png"
                  alt="image"
                  width={225}
                  height={35}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner7.png"
                  alt="image"
                  width={225}
                  height={35}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner8.png"
                  alt="image"
                  width={225}
                  height={35}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner9.png"
                  alt="image"
                  width={225}
                  height={35}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner10.png"
                  alt="image"
                  width={225}
                  height={35}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner7.png"
                  alt="image"
                  width={225}
                  height={35}
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default PartnerStyleThree;
