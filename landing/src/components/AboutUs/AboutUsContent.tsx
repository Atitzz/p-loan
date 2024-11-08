"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutUsContent: React.FC = () => {
  return (
    <>
      <div className="about-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="p-relative">
                <div className="about-image">
                  <Image
                    src="/images/about/about1.jpg"
                    alt="image"
                    width={465}
                    height={350}
                  />

                  <Image
                    src="/images/about/about2.jpg"
                    alt="image"
                    width={495}
                    height={310}
                  />
                </div>

                <div className="experience">
                  <h4>25</h4>
                  <p>เรามีประสบการณ์มากกว่า</p>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="about-content">
                <span>เกี่ยวกับ</span>
                <h3>
                ยินดีต้อนรับสู่โอกาสใหม่ในการสร้างอนาคตทางธุรกิจของคุณ

                </h3>
                <p>
                ยินดีต้อนรับสู่โอกาสใหม่ในการสร้างอนาคตทางธุรกิจของคุณ 
เราพร้อมที่จะเป็นส่วนหนึ่งในความสำเร็จของคุณ ไม่ว่าคุณจะกำลังเริ่มต้นธุรกิจใหม่หรือขยายธุรกิจที่มีอยู่ สินเชื่อของเราจะเป็นทางเลือกที่คุ้มค่า เพื่อให้คุณสามารถเดินหน้าสู่เป้าหมายได้อย่างมั่นใจ
                </p>
                <strong>ในธุรกิจเรามุ่งเน้น 3 สิ่ง</strong>

                <ul className="about-list">
                  <li>
                    <i className="flaticon-check"></i>
                    ข้อมูลที่เป็นประโยชน์
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    ความน่าเชื่อถือ
                  </li>
                  <li>
                    <i className="flaticon-check"></i>
                    นวัตกรรม
                  </li>
                </ul>

                <div className="about-btn">
                  <Link href="/apply-now" className="default-btn">
                    ขอสินเชื่อ <span></span>
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

export default AboutUsContent;
