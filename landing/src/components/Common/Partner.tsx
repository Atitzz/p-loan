"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

const Partner: React.FC = () => {
  return (
    <>
      <div className="partner-area ptb-100">
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
              992: {
                slidesPerView: 5,
              },
            }}
            modules={[Autoplay]}
            className="partner-slider"
          >
            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner1.png"
                  alt="image"
                  width={180}
                  height={130}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner2.png"
                  alt="image"
                  width={180}
                  height={130}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner3.png"
                  alt="image"
                  width={180}
                  height={130}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner4.png"
                  alt="image"
                  width={180}
                  height={130}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner5.png"
                  alt="image"
                  width={180}
                  height={130}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="partner-item">
                <Image
                  src="/images/partner/partner3.png"
                  alt="image"
                  width={180}
                  height={130}
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Partner;
