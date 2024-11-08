"use client";
  
import React from "react";
import Link from "next/link";

const Services: React.FC = () => {
  return (
    <>
      <div className="services-area pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <span>Knowledge of the market</span>
            <h2>Only the best professional services</h2>
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
                <Link href="/services" className="learn-btn">
                อ่านต่อ
                </Link>
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
                <Link href="/services" className="learn-btn">
                อ่านต่อ
                </Link>
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
                <Link href="/services" className="learn-btn">
                อ่านต่อ
                </Link>
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
                <Link href="/services" className="learn-btn">
                  อ่านต่อ
                </Link>
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
                <Link href="/services" className="learn-btn">
                อ่านต่อ
                </Link>
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
                <Link href="/services" className="learn-btn">
                อ่านต่อ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
