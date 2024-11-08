"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
const defaultData = {
  name: "",
  email: "",
  mobile: "",
  subject: "",
  message: "",
};

const defaultErrors = {
  name: { status: false, message: "กรุณากรอกชื่อผู้ติดต่อ" },
  email: { status: false, message: "กรุณากรอกอีเมลให้ถูกต้อง" },
  mobile: { status: false, message: "กรุณากรอกเบอร์โทรศัพท์" },
  subject: { status: false, message: "กรุณากรอกหัวข้อ" },
  message: { status: false, message: "กรุณากรอกข้อความ" },
};

const ContactForm: React.FC = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [input, setInput] = useState(defaultData);
  const [message, setMessage] = useState({
    status: 0,
    message: "",
  });
  const [errors, setErrors] = useState(defaultErrors);

  async function handleCaptchaSubmission(token: string | null) {
    try {
      if (token) {
        // await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${token}`, {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ token }),
        // });
        setIsVerified(true);
      }
    } catch (e) {
      setIsVerified(false);
    }
  }

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };

  function handleExpired() {
    setIsVerified(false);
  }

  const isValidate = (e: { target: { name: string; value: string } }) => {
    if (e.target.name == "mobile") {
      if (/^\d+$/.test(e.target.value)) return true;
      return false;
    } else return true;
  };

  function handleOnChange(e: any) {
    const __validate = isValidate(e);
    if (!__validate) return;
    const { name, value } = e.target;
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function handleOnSubmit(e: any) {
    e.preventDefault();
    let __errros = defaultErrors;
    let thisErrors = 0;
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.email)) {
      thisErrors += 1;
      __errros.email.status = true;
    }
    if (input.name == "") {
      thisErrors += 1;
      __errros.name.status = true;
    }
    if (input.mobile == "") {
      thisErrors += 1;
      __errros.mobile.status = true;
    }
    if (input.subject == "") {
      thisErrors += 1;
      __errros.subject.status = true;
    }
    if (input.message == "") {
      thisErrors += 1;
      __errros.message.status = true;
    }

    if (thisErrors > 0) {
      setErrors(__errros);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/contactus`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...input }),
    })
      .then(async (response) => {
        setInput(defaultData);
        setMessage({
          status: 1,
          message: "การดำเนินการเสร็จสิ้น  ,ขอบคุณที่ร่วมเป็นส่วนหนึ่งของเรา",
        });
        setIsVerified(false);
      })
      .catch(async (err) => {
        setMessage({
          status: 2,
          message: "การดำเนินการผิดพลาด  ,กรุณาตรวจสอบความถูกต้องของข้อมูล",
        });
      });
  }
  return (
    <>
      <div className="contact-area ptb-100">
        <div className="container">
          <div className="section-title">
            <span>มาคุยกัน</span>
            <h2>หากคุณมีคำถามเพิ่มเติม</h2>
          </div>
          {message.status != 0 && (
            <div
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 5,
                border: `1px solid ${
                  message.status == 2 ? "#eb0000" : "#28a745"
                }`,
                color: `${message.status == 2 ? "#eb0000" : "#28a745"}`,
              }}
            >
              {message.message}
            </div>
          )}
          <div className="row">
            <div className="col-lg-8 col-md-6">
              <div className="contact-form">
                <div className="title">
                  <h3>เขียนถึงเรา</h3>
                </div>

                <form>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>
                          ชื่อ - สกุล{" "}
                          <span style={{ color: "#eb0000" }}>
                            * {errors.name.status && errors.name.message}
                          </span>
                        </label>
                        <input
                          style={{
                            border: errors.name.status
                              ? "1px solid #eb0000"
                              : "",
                          }}
                          type="text"
                          name="name"
                          placeholder="Name"
                          className="form-control"
                          required
                          value={input.name}
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>
                          อีเมล{" "}
                          <span style={{ color: "#eb0000" }}>
                            * {errors.email.status && errors.email.message}
                          </span>
                        </label>
                        <input
                          style={{
                            border: errors.email.status
                              ? "1px solid #eb0000"
                              : "",
                          }}
                          type="text"
                          name="email"
                          placeholder="Email"
                          className="form-control"
                          required
                          value={input.email}
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>
                          โทร{" "}
                          <span style={{ color: "#eb0000" }}>
                            * {errors.mobile.status && errors.mobile.message}
                          </span>
                        </label>
                        <input
                          style={{
                            border: errors.mobile.status
                              ? "1px solid #eb0000"
                              : "",
                          }}
                          type="text"
                          name="mobile"
                          placeholder="Phone number"
                          className="form-control"
                          required
                          value={input.mobile}
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>
                          ชื่อเรื่อง{" "}
                          <span style={{ color: "#eb0000" }}>
                            * {errors.subject.status && errors.subject.message}
                          </span>
                        </label>
                        <input
                          style={{
                            border: errors.subject.status
                              ? "1px solid #eb0000"
                              : "",
                          }}
                          type="text"
                          name="subject"
                          placeholder="Subject"
                          className="form-control"
                          required
                          value={input.subject}
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>
                          ข้อความ{" "}
                          <span style={{ color: "#eb0000" }}>
                            * {errors.message.status && errors.message.message}
                          </span>
                        </label>
                        <textarea
                          style={{
                            border: errors.message.status
                              ? "1px solid #eb0000"
                              : "",
                          }}
                          name="message"
                          cols={30}
                          rows={6}
                          placeholder="Write your message..."
                          className="form-control"
                          required
                          value={input.message}
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-sm-12">
                      <ReCAPTCHA
                        sitekey={
                          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
                        }
                        ref={recaptchaRef}
                        onChange={handleChange}
                        onExpired={handleExpired}
                      />
                    </div>

                    <div className="col-lg-12 col-sm-12">
                      <button
                        disabled={!isVerified}
                        onClick={handleOnSubmit}
                        type="submit"
                        className="btn default-btn btn-lg"
                        style={{ width: "100%" }}
                      >
                        ส่งถึงเรา <span></span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="contact-side-box">
                <div className="title">
                  <h3>ข้อมูลการติดต่อ</h3>
                </div>

                <div className="info-box">
                  <div className="icon">
                    <i className="flaticon-clock"></i>
                  </div>
                  <h4>เวลาทำการ</h4>
                  <ul className="list">
                    <li>
                      จันทร์ – เสาร์
                      <span>08:00 - 17:00 น</span>
                    </li>
                    {/* <li>
                      ศุกร์ – เสาร์
                      <span>08:00 - 17:00 น</span>
                    </li> */}
                    <li>
                      อาทิตย์
                      <span>ปิดทำการ</span>
                    </li>
                  </ul>
                </div>

                <div className="info-box">
                  <div className="icon">
                    <i className="flaticon-pin"></i>
                  </div>
                  <h4>ที่อยู่</h4>
                  <span>
                    2/69 ซ.สุขุมวิท 42 แขวงพระโขนง เขตคลองเตย กรุงเทพมหานคร
                    10110
                  </span>
                </div>

                {/* <div className="info-box">
                  <div className="icon">
                    <i className="flaticon-phone-call"></i>
                  </div>
                  <h4>โทร</h4>
                  <span>
                    <a href="tel:XX-XXX-XXXX">XX-XXX-XXXX</a>
                  </span>
                  <span>
                    <a href="tel:XX-XXX-XXXX">XX-XXX-XXXX</a>
                  </span>
                </div> */}

                <div className="info-box">
                  <div className="icon">
                    <i className="flaticon-email"></i>
                  </div>
                  <h4>อีเมล</h4>
                  <span>
                    <a href="mailto:hello@leza.com">info@moneyforyou.co.th</a>
                  </span>
                  <span>{/* <a href="#">Skype: example</a> */}</span>
                </div>

                <div className="info-box" style={{ paddingTop: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: 0,
                    }}
                  >
                    <Link href="line://ti/p/@830hhlhc">
                      <Image
                        src="/images/qrcode.jpg"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
