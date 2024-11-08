"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="footer-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="single-footer-widget">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: 0,
                  }}
                >
                  <Link href="line://ti/p/@830hhlhc">
                    <Image
                      src="/images/qrcode.webp"
                      alt="image"
                      width={180}
                      height={180}
                    />
                  </Link>
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "#fff",
                    textAlign: "start",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>สแกนขอสินเชื่อ</span>
                    <span>@moneyforyou</span>
                    <span>มี @ ด้วย</span>
                  </div>
                </div>
              </div>

              {/* </div> */}
              {/* <ul className="social">
                  <li>
                    <b>Follow us:</b>
                  </li>
                  <li>
                    <a href="https://www.twitter.com/" target="_blank">
                      <i className="flaticon-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank">
                      <i className="flaticon-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/" target="_blank">
                      <i className="flaticon-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" target="_blank">
                      <i className="flaticon-linkedin"></i>
                    </a>
                  </li>
                </ul> */}
              {/* </div> */}
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="single-footer-widget">
                <h3>ติดต่อเรา</h3>

                <ul className="quick-links">
                  <li>
                    <Link href="/about-us">เกี่ยวกับ</Link>
                  </li>
                  {/* <li>
                    <Link href="#">Our Performance</Link>
                  </li> */}
                  <li>
                    <Link href="/faq">คำถามที่พบบ่อย</Link>
                  </li>
                  {/* <li>
                    <Link href="/news">Blog</Link>
                  </li> */}
                  <li>
                    <Link href="/contact">ติดต่อ</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="single-footer-widget">
                <h3>บริการ</h3>

                <ul className="quick-links">
                  {/* <li>
                    <Link href="/contact">ติดต่อ</Link>
                  </li> */}
                  <li>
                    <Link href="/privacy-policy">นโยบายความเป็นส่วนตัว</Link>
                  </li>
                  <li>
                    <Link href="/terms-conditions">เงื่อนไขการใช้บริการ</Link>
                  </li>
                  <li>
                    <Link href="line://ti/p/@830hhlhc">สินเชื่อ</Link>
                  </li>
                  <li>
                    <Link href="https://www.moneyforyou.co.th/howtopay/payment.pdf">วิธีการชำระสินเชื่อ</Link>
                  </li>
                  {/* <li>
                    <Link href="/services">บริการ</Link>
                  </li> */}
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="single-footer-widget">
                <h3>ที่อยู่</h3>

                <div className="info-contact">
                  <i className="flaticon-loan"></i>
                  <span>
                    <a href="/about-us">บริษัท มันนี่ ฟอร์ยู จำกัด</a>
                  </span>
                  <span>
                    <a href="/about-us">MONEY FOR YOU CO., LTD</a>
                  </span>
                </div>

                <div className="info-contact">
                  <i className="flaticon-pin"></i>
                  <span>
                    <a href="https://maps.app.goo.gl/1f8oy1kpjKNLSSgy8">
                      2/69 ซ.สุขุมวิท 42 แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร
                      10110
                    </a>
                  </span>
                </div>

                <div className="info-contact">
                  <i className="flaticon-mail"></i>
                  <span>
                    <a href="mailto:hello@leza.com">info@moneyforyou.co.th</a>
                  </span>
                  <span></span>
                </div>

               
                {/* <div className="info-contact">
                  <i className="flaticon-telephone"></i>
                  <span>
                    <a href="tel:1514312-6688">XX-XXX-XXXX</a>
                  </span>
                  <span>
                    <a href="tel:1514312-6688">XX-XXX-XXXX</a>
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="copy-right-area">
        <div className="container">
          <div className="copy-right-content">
            {/* <p>
              Copyright &copy; {currentYear} Leza. Designed By{" "}
              <a href="https://envytheme.com/" target="_blank">
                EnvyTheme
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
