"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const HowToApplyForLoan: React.FC = () => {
  return (
    <>
      <div className="deserve-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="deserve-item">
                <h3>4 ขั้นตอนเพื่อขอรับสินเชื่อ</h3>

                <div className="deserve-content">
                  <span>1</span>
                  <h4>เอกสารที่จำเป็น</h4>
                  <p>
                  อัปโหลดเอกสารที่จำเป็น เช่น บัตรประจำตัวประชาชน หลักฐานรายได้ และข้อมูลเพิ่มเติมตามที่ร้องขอ
                  </p>
                </div>

                <div className="deserve-content">
                  <span>2</span>
                  <h4>รอการอนุมัติ</h4>
                  <p>
                  เมื่อส่งแบบฟอร์มสมัครเสร็จสิ้น ทีมงานของเราจะพิจารณาข้อมูลของท่านโดยรวดเร็ว
                  </p>
                </div>

                <div className="deserve-content">
                  <span>3</span>
                  <h4>รับผลการพิจารณา</h4>
                  <p>
                  ท่านจะได้รับการแจ้งผลเกี่ยวกับการอนุมัติสินเชื่อผ่าน SMS หรือ Email
                  </p>
                </div>

                <div className="deserve-content">
                  <span>4</span>
                  <h4>รับเงินโอนเข้าบัญชี</h4>
                  <p>
                  เมื่อได้รับการอนุมัติ เงินกู้จะถูกโอนเข้าบัญชีที่ท่านระบุ
                  </p>
                </div>

                <div className="deserve-btn">
                  <Link href="/apply-now" className="default-btn">
                    ขอสินเชื่อ <span></span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="default-image">
                <Image
                  src="/images/loan2.png"
                  alt="image"
                  width={600}
                  height={560}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToApplyForLoan;
