"use client";
  
import React from "react";
import Link from "next/link";

const ServicesCard: React.FC = () => {
  return (
    <>
      <div className="services-area bg-color ptb-100">
        <div className="container">
          <div className="section-title">
            <span>สินเชื่อเพื่อคุณ</span>
            <h2>ผลิตภัณฑ์สินเชื่อที่หลากหลาย</h2>
            <p>
            เรามุ่งมั่นที่จะมอบบริการที่ดีที่สุดและเป็นมืออาชีพที่สุดให้กับลูกค้าของเรา เราเข้าใจถึงความสำคัญของการสนับสนุนและการให้คำปรึกษาทางการเงินที่ถูกต้องและทันสมัย ดังนั้นเราจึงมีบริการที่หลากหลายเพื่อรองรับความต้องการทางธุรกิจของคุณ
            </p>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-agriculture"></i>
                </div>
                <h3>สินเชื่อเพื่อการเริ่มต้นธุรกิจ</h3>
                <p>
                ให้การสนับสนุนทางการเงินสำหรับผู้ประกอบการที่ต้องการเริ่มต้นธุรกิจใหม่ ด้วยอัตราดอกเบี้ยที่เหมาะสมและเงื่อนไขที่ยืดหยุ่น เราช่วยให้คุณสามารถเริ่มต้นธุรกิจของคุณได้อย่างมั่นใจ
                </p>
                {/* <Link href="/services/details" className="learn-btn">
                  อ่านต่อ
                </Link> */}
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-loan-1"></i>
                </div>
                <h3>สินเชื่อเพื่อการขยายธุรกิจ</h3>
                <p>
                รองรับการเติบโตและการขยายธุรกิจของคุณ ด้วยวงเงินสินเชื่อที่สูงขึ้นและเงื่อนไขที่ออกแบบมาเพื่อความสำเร็จของธุรกิจคุณ
                </p>
                {/* <Link href="/services/details" className="learn-btn">
                  อ่านต่อ
                </Link> */}
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-loan-2"></i>
                </div>
                <h3>สินเชื่อหมุนเวียนธุรกิจ</h3>
                <p>
                ให้การสนับสนุนการดำเนินธุรกิจประจำวันด้วยสินเชื่อหมุนเวียนธุรกิจ ช่วยให้คุณมีสภาพคล่องที่เพียงพอในการจัดการค่าใช้จ่ายต่างๆ
                </p>
                {/* <Link href="/services/details" className="learn-btn">
                  อ่านต่อ
                </Link> */}
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-personal"></i>
                </div>
                <h3>สินเชื่อส่วนบุคคล</h3>
                <p>
                ให้การสนับสนุนทางการเงินสำหรับความต้องการส่วนบุคคลของคุณ ด้วยวงเงินสินเชื่อที่ยืดหยุ่นและอัตราดอกเบี้ยที่แข่งขันได้ ไม่ว่าคุณจะต้องการสินเชื่อเพื่อการศึกษา การท่องเที่ยว หรือการจัดการค่าใช้จ่ายในชีวิตประจำวัน เราพร้อมให้บริการคุณด้วยความเป็นมืออาชีพ
                </p>
                {/* <Link href="/services/details" className="learn-btn">
                  อ่านต่อ
                </Link> */}
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-scholarship"></i>
                </div>
                <h3>สินเชื่อเพื่อการศึกษา</h3>
                <p>
                สินเชื่อเพื่อการศึกษา ที่ช่วยให้คุณก้าวไปข้างหน้าในชีวิตการเรียน
ไม่ว่าคุณจะเรียนคณะไหน หรือสถาบันอะไร เราพร้อมช่วยให้คุณบรรลุเป้าหมาย สินเชื่อเพื่อการศึกษา ดอกเบี้ยต่ำ อนุมัติง่าย
                </p>
                {/* <Link href="/services/details" className="learn-btn">
                  Learn More
                </Link> */}
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-loan-3"></i>
                </div>
                <h3>สินเชื่อเพื่อธุรกิจออนไลน์</h3>
                <p>
                เปลี่ยนไอเดียของคุณให้กลายเป็นธุรกิจที่ยั่งยืน! สินเชื่อเพื่อธุรกิจออนไลน์ ก้าวแรกสู่ความสำเร็จทางธุรกิจ ไม่ว่าคุณจะขายอะไร หรือทำธุรกิจแนวไหน เราพร้อมช่วยให้คุณเติบโต สินเชื่อเพื่อธุรกิจออนไลน์ เพื่อความสำเร็จและพร้อมสนับสนุนทุกก้าวที่คุณต้องการ

                </p>
                {/* <Link href="/services/details" className="learn-btn">
                  Learn More
                </Link> */}
              </div>
            </div>
{/* 
            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-car"></i>
                </div>
                <h3>Vehicle loan</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor ncid dunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/details" className="learn-btn">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-loan-4"></i>
                </div>
                <h3>Medical loan</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor ncid dunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/details" className="learn-btn">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="services-item">
                <div className="icon">
                  <i className="flaticon-rocket"></i>
                </div>
                <h3>StartUp loan</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor ncid dunt ut labore et dolore magna aliqua.
                </p>
                <Link href="/services/details" className="learn-btn">
                  Learn More
                </Link>
              </div>
            </div> */}

            {/* Pagination */}
            {/* <div className="col-lg-12">
              <ul className="pagination-list">
                <li>
                  <Link href="#">
                    <i className="bx bx-chevrons-left"></i>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="active">
                    1
                  </Link>
                </li>
                <li>
                  <Link href="#">2</Link>
                </li>
                <li>
                  <Link href="#">3</Link>
                </li>
                <li>
                  <Link href="#">
                    <i className="bx bx-chevrons-right"></i>
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesCard;
