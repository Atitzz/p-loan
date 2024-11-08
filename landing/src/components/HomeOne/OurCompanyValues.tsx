"use client";

import React from "react";
import Image from "next/image";

const OurCompanyValues: React.FC = () => {
  return (
    <>
      <div className="company-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-7">
              <div
                className="company-image"
                style={{
                  backgroundImage: `url(/images/company.jpg)`,
                }}
              >
                <Image
                  src="/images/company.jpg"
                  alt="image"
                  width={945}
                  height={678}
                />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="company-content">
                <h3>คุณค่าของเรา</h3>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-idea"></i>
                  </div>
                  <h4>ความซื่อสัตย์และความโปร่งใส</h4>
                  <p>
                  เราดำเนินธุรกิจด้วยความซื่อสัตย์และเปิดเผยข้อมูลอย่างโปร่งใส เพื่อให้ลูกค้าใช้บริการได้อย่างมั่นใจ

                  </p>
                </div>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-talent"></i>
                  </div>
                  <h4>การสนับสนุนความสำเร็จของลูกค้า
                  </h4>
                  <p>
                  เรามุ่งมั่นที่จะเห็นคุณประสบความสำเร็จ ไม่ว่าคุณจะเริ่มต้นธุรกิจใหม่หรือขยายธุรกิจเดิม เราพร้อมที่จะสนับสนุนทุกก้าวย่างของคุณ

                  </p>
                </div>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-key"></i>
                  </div>
                  <h4>การบริการด้วยหัวใจ
                  </h4>
                  <p>
                  การให้บริการที่เป็นมิตรและจริงใจคือหัวใจของเรา เราใส่ใจในทุกความต้องการและพร้อมที่จะให้คำปรึกษาที่เหมาะสมเพื่อช่วยให้คุณบรรลุเป้าหมายทางการเงิน

                  </p>
                </div>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-responsibility"></i>
                  </div>
                  <h4>นวัตกรรมและความคิดสร้างสรรค์
                  </h4>
                  <p>
                  เราเชื่อในการนำเสนอวิธีแก้ไขที่ทันสมัยและสร้างสรรค์ เพื่อให้ลูกค้าของเราได้รับประสบการณ์ที่ดีที่สุดและก้าวหน้าไปพร้อมกับการเปลี่ยนแปลงของโลกธุรกิจ
                  </p>
                </div>

                <div className="company-text">
                  <div className="icon">
                    <i className="flaticon-growth"></i>
                  </div>
                  <h4>ความรับผิดชอบต่อสังคม</h4>
                  <p>
                  เรามีความรับผิดชอบต่อชุมชนและสิ่งแวดล้อม โดยมุ่งเน้นในการดำเนินธุรกิจอย่างยั่งยืนและเป็นมิตรต่อสังคม
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurCompanyValues;
