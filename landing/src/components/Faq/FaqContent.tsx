"use client";

import React, { useState } from "react";
import FaqForm from "./FaqForm";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

const FaqContent: React.FC = () => {
  return (
    <>
      <div className="faq-area ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>คำถามที่พบบ่อย</h2>
            <b>สามารถค้นหาคำตอบได้จากด้านล่าง</b>
          </div>

          <Accordion preExpanded={['a']} className="faq-list-tab">
            <AccordionItem uuid="a">
              <AccordionItemHeading>
                <AccordionItemButton>คำถามที่พบบ่อย</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <ul className="question-list">
                  {/* <li>
                    <h4 className="title">สินเชื่อธุรกิจของเรามีประเภทใดบ้าง?</h4>
                    <p>
                    เรามีสินเชื่อธุรกิจหลากหลายประเภท เช่น สินเชื่อเพื่อการเริ่มต้นธุรกิจ สินเชื่อเพื่อการขยายธุรกิจ และสินเชื่อหมุนเวียนธุรกิจ เพื่อให้ตรงกับความต้องการที่หลากหลายของคุณ
                    </p>
                  </li> */}

                  <li>
                    <h4 className="title">
                    อัตราดอกเบี้ยของสินเชื่อเป็นอย่างไร?
                    </h4>
                    <p>
                    อัตราดอกเบี้ยของเรามีความยืดหยุ่นและแข่งขันได้ ขึ้นอยู่กับระยะเวลาการชำระเงิน คุณสามารถติดต่อเจ้าหน้าที่ของเราเพื่อขอรายละเอียดเพิ่มเติม
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                    เงื่อนไขการขอสินเชื่อมีอะไรบ้าง?
                    </h4>
                    <p>
                    เงื่อนไขการขอสินเชื่อ โดยทั่วไปจะต้องมีแผนที่ชัดเจน ประวัติทางการเงินที่ดี และเอกสารต่างๆ ที่เกี่ยวข้องกับคุณ
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                    กระบวนการอนุมัติสินเชื่อใช้เวลานานเท่าใด?
                    </h4>
                    <p>
                    กระบวนการอนุมัติสินเชื่อของเราใช้เวลาประมาณ 7-14 วันทำการ ขึ้นอยู่กับความซับซ้อนของคำขอและเอกสารที่ยื่นประกอบ
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                    ต้องมีหลักประกันในการขอสินเชื่อหรือไม่?
                    </h4>
                    <p>
                    การใช้หลักประกันขึ้นอยู่กับวงเงินที่ขอ อาจจะใช้หลักประกันในบางกรณี
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                    สามารถขอสินเชื่อออนไลน์ได้หรือไม่?
                    </h4>
                    <p>
                    ได้ คุณสามารถขอสินเชื่อผ่านทางเว็บไซต์ของเราโดยกรอกแบบฟอร์มคำขอสินเชื่อออนไลน์ และเจ้าหน้าที่ของเราจะติดต่อกลับเพื่อดำเนินการต่อไป
                    </p>
                  </li>

                  
                  <li>
                    <h4 className="title">
                    การชำระคืนสินเชื่อทำได้อย่างไร?
                    </h4>
                    <p>
                    คุณสามารถชำระคืนสินเชื่อผ่านทางช่องทางต่างๆ เช่น การโอนเงินผ่านธนาคาร หรือการชำระผ่านระบบออนไลน์
                    </p>
                  </li>

                  
                  <li>
                    <h4 className="title">
                    มีค่าธรรมเนียมในการขอสินเชื่อหรือไม่?
                    </h4>
                    <p>
                    ค่าธรรมเนียมขึ้นอยู่กับนโยบายของบริษัท คุณสามารถสอบถามรายละเอียดเพิ่มเติมจากเจ้าหน้าที่ของเรา
                    </p>
                  </li>

                  
                  <li>
                    <h4 className="title">
                    ถ้ามีปัญหาในการชำระคืนสินเชื่อ ควรทำอย่างไร?
                    </h4>
                    <p>
                    หากคุณมีปัญหาในการชำระคืนสินเชื่อ กรุณาติดต่อเจ้าหน้าที่ของเราโดยทันที เพื่อหาแนวทางแก้ไขที่เหมาะสมและป้องกันปัญหาที่อาจเกิดขึ้น
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                    สามารถเพิ่มวงเงินสินเชื่อในภายหลังได้หรือไม่?
                    </h4>
                    <p>
                    ได้ คุณสามารถขอเพิ่มวงเงินสินเชื่อได้ โดยต้องผ่านการพิจารณาและอนุมัติจากเจ้าหน้าที่ของเรา
                    </p>
                  </li>

            
                </ul>
              </AccordionItemPanel>
            </AccordionItem>
{/* 
            <AccordionItem uuid="b">
              <AccordionItemHeading>
                <AccordionItemButton>General questions</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <ul className="question-list">
                  <li>
                    <h4 className="title">What is State Aid?</h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      Why do you charge interest on the loan?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      Can I apply for a loan if I have poor credit?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      How long does the application process take?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      My business internationally. Am I still eligible to apply?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      What kind of financial advice do you give?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>
                </ul>
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem uuid="c">
              <AccordionItemHeading>
                <AccordionItemButton>About qinix</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <ul className="question-list">
                  <li>
                    <h4 className="title">What is State Aid?</h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      Why do you charge interest on the loan?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      Can I apply for a loan if I have poor credit?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      How long does the application process take?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      My business internationally. Am I still eligible to apply?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>

                  <li>
                    <h4 className="title">
                      What kind of financial advice do you give?
                    </h4>
                    <p>
                      Lorem ipsum dolor consectetur adipiscing Fusce varius
                      euismod lacus eget feugiat rorem lorem ipsum dolor sit
                      amet, consectetuer adipiscing elit. Aenean commodo ligula
                      eget dolor massa sociis natoque penatibus. ipsum dolor
                      consectetur Fusce varius Fusce varius euismod lacus eget
                      feugiat...
                    </p>
                  </li>
                </ul>
              </AccordionItemPanel>
            </AccordionItem> */}
          </Accordion>

          {/* Faq Form */}
          {/* <FaqForm /> */}
        </div>
      </div>
    </>
  );
};

export default FaqContent;
