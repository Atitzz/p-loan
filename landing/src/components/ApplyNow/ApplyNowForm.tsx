"use client";

import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
const defaultData = {
  amount: 0,
  firstname: "",
  birthdate: new Date().toISOString().split("T")[0],
  address: "",
  email: "",
  mobile: "",
  job: "",
  objective: "",
  income: 0,
  lastname: "",
  sex: "",
  country: "ไทย",
  email2: "",
  job_company_name: "",
  job_address: "",
  loan_plan: "",
};

const defaultErrors = {
  loan_plan: { status: false, message: "กรุณาระบุแผนสินเชื่อ" },
  amount: { status: false, message: "กรุณาระบุจำนวนเงิน" },
  firstname: { status: false, message: "กรุณากรอกชื่อผู้ติดต่อ" },
  lastname: { status: false, message: "กรุณากรอกนามสกุลผู้ติดต่อ" },
  email: { status: false, message: "กรุณากรอกอีเมล" },
  email2: { status: false, message: "กรุณากรอกอีเมลสำรอง" },
  mobile: { status: false, message: "กรุณากรอกเบอร์โทรศัพท์" },
  objective: { status: false, message: "กรุณากรอกวัตถุประสงค์" },
  adress: { status: false, message: "กรุณากรอกที่อยู่" },
  country: { status: false, message: "กรุณาระบุประเทศ" },
  job: { status: false, message: "กรุณาระบุอาชีพ" },
  income: { status: false, message: "กรุณากรอกรายได้" },
};

const ApplyNowForm: React.FC = () => {
  const toTHB = (amount:any) => {
    return `${Number(amount).toLocaleString("th-TH", {
        currency: "THB",
        minimumFractionDigits: 0,
      })} บาท`;
  }
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [input, setInput] = useState(defaultData);
  const [plans, setPlans] = useState<{ name: string ,maximum_amount:number}[]>([]);
  const [message, setMessage] = useState({
    status: 0,
    message: "",
  });
  const [errors, setErrors] = useState(defaultErrors);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/plan/loan/all`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      const { data } = await response.json();
      setPlans(data);
    });
  }, []);
  async function handleCaptchaSubmission(token: string | null) {
    try {
      if (token) {
        // const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${token}`, {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ token }),
        // });
        // if(response)
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
      setErrors((prev) => {
        return {
          ...prev,
          [e.target.name]: {
            status: !/^\d+$/.test(e.target.value),
            message: "กรุณาระบุเฉพาะตัวเลข",
          },
        };
      });
    } else if (e.target.name == "income") {
      setErrors((prev) => {
        return {
          ...prev,
          [e.target.name]: {
            status: !/^\d+$/.test(e.target.value),
            message: "กรุณาระบุเฉพาะตัวเลข",
          },
        };
      });
    } else if (e.target.name == "amount") {
      setErrors((prev) => {
        return {
          ...prev,
          [e.target.name]: {
            status: !/^\d+$/.test(e.target.value),
            message: "กรุณาระบุเฉพาะตัวเลข",
          },
        };
      });
    } else if (e.target.name == "email") {
      setErrors((prev) => {
        return {
          ...prev,
          [e.target.name]: {
            status: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
              e.target.value
            ),
            message: "กรุณาระบุรูปแบบอีเมลให้ถูกต้อง",
          },
        };
      });
    }
    else if (e.target.name == "email2")
      {
        setErrors((prev) => {
          return {
            ...prev,
            [e.target.name]: {
              status: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value),
              message: "กรุณาระบุรูปแบบอีเมลให้ถูกต้อง",
            },
          };
        });
        
  
      }
  };

  function handleOnChange(e: any) {
    isValidate(e);
    
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

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.email2)
    ) {
      thisErrors += 1;
      __errros.email2.status = true;
    }

    if (input.loan_plan == "") {
      thisErrors += 1;
      __errros.loan_plan.status = true;
    }
    if (input.amount < 1000) {
      thisErrors += 1;
      __errros.amount.status = true;
    }
    if (input.firstname == "") {
      thisErrors += 1;
      __errros.firstname.status = true;
    }
    if (input.lastname == "") {
      thisErrors += 1;
      __errros.lastname.status = true;
    }
    if (input.objective == "") {
      thisErrors += 1;
      __errros.lastname.status = true;
    }
    if (input.mobile == "") {
      thisErrors += 1;
      __errros.mobile.status = true;
    }

    if (input.address == "") {
      thisErrors += 1;
      __errros.adress.status = true;
    }
    if (input.email == "") {
      thisErrors += 1;
      __errros.email.status = true;
    }
    if (input.email2 == "") {
      thisErrors += 1;
      __errros.email2.status = true;
    }
    if (input.income < 1000) {
      thisErrors += 1;
      __errros.income.status = true;
    }
    if (thisErrors > 0) {
      setErrors(__errros);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/nonloan/apply-now`, {
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
      <div className="apply-area ptb-100">
        <div className="container">
          <div className="apply-title">
            <h3>ข้อมูลการขอสินเชื่อ</h3>
          </div>

          <form>
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
              <div className="col-lg-6">
                <div className="apply-form">
                  <div className="form-group">
                    <label>
                      ชื่อ{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.firstname.status && errors.firstname.message}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={input.firstname}
                      name="firstname"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      นามสกุล{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.lastname.status && errors.lastname.message}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={input.lastname}
                      name="lastname"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      โทร{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.mobile.status && errors.mobile.message}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={input.mobile}
                      name="mobile"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>เพศ</label>
                    <select
                      className="form-select"
                      value={input.sex}
                      name="sex"
                      onChange={handleOnChange}
                    >
                      <option value="ไม่ระบุ">โปรดเลือกเพศ</option>
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                      <option value="หญิง">อื่นๆ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>วันเกิด</label>
                    <input
                      type="date"
                      value={input.birthdate}
                      name="birthdate"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      ที่อยู่{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.adress.status && errors.adress.message}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={input.address}
                      name="address"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      ประเทศ{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.country.status && errors.country.message}
                      </span>
                    </label>
                    <select className="form-select">
                      {/* <option value="0">Select the Country</option> */}
                      <option value="ไทย">ไทย</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      อาชีพ{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.job.status && errors.job.message}
                      </span>
                    </label>
                    <select
                      className="form-select"
                      value={input.job}
                      name="job"
                      onChange={handleOnChange}
                    >
                      <option value="ไม่ระบุ">โปรดเลือกอาชีพ</option>
                      <option value="วิทยาศาสตร์และเทคโนโลยี">
                        วิทยาศาสตร์และเทคโนโลยี
                      </option>
                      <option value="วิศวกรรมและการก่อสร้าง">
                        วิศวกรรมและการก่อสร้าง
                      </option>
                      <option value="สุขภาพและการแพทย์">
                        สุขภาพและการแพทย์
                      </option>
                      <option value="การศึกษาและวิชาการ">
                        การศึกษาและวิชาการ
                      </option>
                      <option value="ธุรกิจ การเงิน และการบริหาร">
                        ธุรกิจ การเงิน และการบริหาร
                      </option>
                      <option value="ศิลปะ การออกแบบ และสถาปัตยกรรม">
                        ศิลปะ การออกแบบ และสถาปัตยกรรม
                      </option>
                      <option value="การบันเทิงและสื่อสารมวลชน">
                        การบันเทิงและสื่อสารมวลชน
                      </option>
                      <option value="บริการลูกค้าและการค้าปลีก">
                        บริการลูกค้าและการค้าปลีก
                      </option>
                      <option value="กฎหมายและการปกครอง">
                        กฎหมายและการปกครอง
                      </option>
                      <option value="การเกษตรและอุตสาหกรรมการผลิต">
                        การเกษตรและอุตสาหกรรมการผลิต
                      </option>
                      <option value="เทคโนโลยีสารสนเทศและการสื่อสาร">
                        เทคโนโลยีสารสนเทศและการสื่อสาร
                      </option>
                      <option value="ขนส่งและโลจิสติกส์">
                        ขนส่งและโลจิสติกส์
                      </option>
                      <option value="การท่องเที่ยวและการโรงแรม">
                        การท่องเที่ยวและการโรงแรม
                      </option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="apply-form">
                  <div className="form-group">
                    <label>
                      ประเภทเงินสินเชื่อ{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.loan_plan.status && errors.loan_plan.message}
                      </span>
                    </label>
                    <select
                      className="form-select"
                      value={input.loan_plan}
                      name="loan_plan"
                      onChange={handleOnChange}
                    >
                      <option value="ไม่ระบุ">เลือกประเภทสินเชื่อ</option>
                      {plans
                      .filter(x => {
                        const excludedNames = ["สินเชื่อเพื่อสวัสดิการ", "test", "ดอกเบี้ยคงที่"]; // เพิ่มชื่อที่ต้องการกรองออก
                        return !excludedNames.some(name => x.name.startsWith(name));
                      })
                      .map((x, i) => (
                        <option key={i} value={x.name}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      วงเงินสินเชื่อที่ต้องการ{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.amount.status && errors.amount.message}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={input.amount}
                      name="amount"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      วัตถุประสงค์ของการขอสินเชื่อ{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.objective.status && errors.objective.message}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={input.objective}
                      name="objective"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      รายได้ / เดือน{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.income.status && errors.income.message}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={input.income}
                      name="income"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      อีเมล{" "}
                      <span style={{ color: "#eb0000" }}>
                        * {errors.email.status && errors.email.message}
                      </span>
                    </label>
                    <input
                      type="email"
                      value={input.email}
                      name="email"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      ที่อยู่อีเมลสํารอง{" "}
                      <span style={{ color: "#eb0000" }}>
                        {errors.email2.status && input.email2!=''  && `* ${errors.email2.message}`}
                      </span>
                    </label>
                    <input
                      type="email"
                      value={input.email2}
                      name="email2"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>ชื่อบริษัท</label>
                    <input
                      type="text"
                      value={input.job_company_name}
                      name="job_company_name"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>ที่อยู่บริษัท</label>
                    <input
                      type="text"
                      value={input.job_address}
                      name="job_address"
                      onChange={handleOnChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                ref={recaptchaRef}
                onChange={handleChange}
                onExpired={handleExpired}
              />
            </div>

            <div className="apply-btn">
              <button
                disabled={!isVerified}
                onClick={handleOnSubmit}
                type="submit"
                className="btn default-btn btn-lg"
                style={{ width: "50%" }}
              >
                ยื่นคำขอ <span></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ApplyNowForm;
