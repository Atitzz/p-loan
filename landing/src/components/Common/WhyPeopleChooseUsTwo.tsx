"use client";

import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import Image from "next/image";

const WhyPeopleChooseUsTwo: React.FC = () => {
  // To open the lightbox change the value of the "toggler" prop.
  const [toggler, setToggler] = useState(false);

  return (
    <>
      <FsLightbox
        toggler={toggler}
        sources={[
          "https://www.youtube.com/embed/bk7McNUjWgw?si=QNjD6j8g15jdiKZl",
        ]}
      />

      <div className="choose-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="choose-title">
                <span>ได้เงินไวไม่ยุ่งยาก</span>
                <h2>สินเชื่อสำหรับทุกความต้องการ</h2>
                <p>
                เราเสนออัตราดอกเบี้ยที่ต่ำเพื่อช่วยให้คุณสามารถจัดการการเงินได้อย่างมีประสิทธิภาพ
สมัครง่าย อนุมัติไว เพื่อให้คุณไม่พลาดโอกาส
เราเชื่อมั่นในศักยภาพของคุณ และพร้อมที่จะสนับสนุนทุกก้าวย่างในการเดินทางสู่ความสำเร็จ
                </p>
              </div>

              <div className="choose-image">
                <Image
                  src="/images/choose.png"
                  alt="image"
                  width={565}
                  height={460}
                />

                <div onClick={() => setToggler(!toggler)} className="video-btn">
                  <i className="flaticon-play-button"></i>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="process-item bg-top1">
                    <div className="icon">
                      <i className="flaticon-guarantee"></i>
                    </div>
                    <h3>ดอกเบี้ยต่ำ</h3>
                    <p>
                    เราเสนออัตราดอกเบี้ยที่ต่ำเพื่อช่วยให้คุณสามารถจัดการการเงินได้อย่างมีประสิทธิภาพ
                    </p>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="process-item bg-top2">
                    <div className="icon">
                      <i className="flaticon-speed"></i>
                    </div>
                    <h3>สมัครง่าย</h3>
                    <p>
                    เพียงไม่กี่ขั้นตอนเพื่อรับสินเชื่อของเรา
                    </p>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="process-item bg-top3">
                    <div className="icon">
                      <i className="flaticon-reliability"></i>
                    </div>
                    <h3>อนุมัติเร็ว</h3>
                    <p>
                    เพื่อให้คุณไม่พลาดโอกาสทางธุรกิจ
                    </p>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="process-item bg-top4">
                    <div className="icon">
                      <i className="flaticon-user-experience"></i>
                    </div>
                    <h3>บริการด้วยใจ</h3>
                    <p>
                    พร้อมที่จะสนับสนุนทุกก้าวย่างในการเดินทางสู่ความสำเร็จ
                    </p>
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

export default WhyPeopleChooseUsTwo;
