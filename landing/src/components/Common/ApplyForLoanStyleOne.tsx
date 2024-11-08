"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
const defaultInput = {
  plan_id: -1,
  amount: 0,
  installment: 0,
};
const ApplyForLoanStyleOne: React.FC = () => {
  const toTHB = (amount:any) => {
    return `${Number(amount).toLocaleString("th-TH", {
        currency: "THB",
        minimumFractionDigits: 0,
      })} บาท`;
  }
  const [input, setInput] = useState(defaultInput);
  const [plans, setPlans] = useState<{
    id: -1,
    name: "สินเชื่อพนักงาน",
    title: "ขอสินเชื่อ",
    minimum_amount: "1000.00000000",
    maximum_amount: "50000.00000000",
    per_installment: "9.00",
    delay_value: 15,
    fixed_charge: "50.00000000",
    percent_charge: "0.00000000",
    type_interest: "flatrate",
    rate: [
      {
        index: 1,
        installment: "12",
        interest_rate: "15",
      },
    ],
    application_percent_charge: 0,
  }[]>([]);
  const [loanPlans, setLoanPlans] = useState({
    id: -1,
    name: "สินเชื่อพนักงาน",
    title: "ขอสินเชื่อ",
    minimum_amount: "1000.00000000",
    maximum_amount: "50000.00000000",
    per_installment: "9.00",
    delay_value: 15,
    fixed_charge: "50.00000000",
    percent_charge: "0.00000000",
    type_interest: "flatrate",
    rate: [
      {
        index: 1,
        installment: "12",
        interest_rate: "15",
      },
    ],
    application_percent_charge: 0,
  });
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

  const onChange = (e: any) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const planOnChange = (e: any) =>
  {
    const __plan = plans.find(plan => plan.id == e.target.value);
    if(__plan) 
    setLoanPlans(__plan);
  }
   
  // const calculate = useMemo(() => {
  //   const __interest_rate = Number(
  //     loanPlans.rate[input.installment]?.interest_rate || 15
  //   );
  //   const __installment = Number(
  //     loanPlans.rate[input.installment]?.installment || 12
  //   );
  //   const __application_charge = Number(loanPlans.application_percent_charge);
  //   const __total_interest =
  //     (__interest_rate + __application_charge) / 100 / 12;
  //   const __interest_bath = input.amount * __total_interest;
  //   const __interest_per_month = Math.pow(1 + __total_interest, __installment);
  //   const __preAmount = __interest_bath * __interest_per_month;
  //   const __preInterest = __interest_per_month - 1;
  //   const result = __preAmount / __preInterest;
  //   return `${Number(result).toLocaleString('th-TH',{
  //     minimumFractionDigits: 2,
  //   })} บาท`;
  // }, [input]);

  const calculate = useMemo(() => {
    const __amount = Number(input.amount);
    const __interest_rate = Number(
      loanPlans.rate[input.installment]?.interest_rate || 15
    );
    const __installment = Number(
      loanPlans.rate[input.installment]?.installment || 12
    );
    const __application_charge = Number(loanPlans.application_percent_charge);
    const total_rate = __interest_rate + __application_charge;

    let installmentPerMonth = 0;

    if (loanPlans.type_interest === "flatrate") {
      // คำนวณดอกเบี้ยแบบคงที่ (Flat Rate)
      const totalInterest = __amount * (total_rate / 100) * (__installment / 12);
      const totalAmount = __amount + totalInterest;
      installmentPerMonth = Math.round((totalAmount / __installment + Number.EPSILON) * 100) / 100;
    } else {
      // คำนวณดอกเบี้ยแบบลดต้นลดดอก (Effective Rate)
      const monthlyRate = (total_rate / 100) / 12;
      // จากฟังก์ชัน calculator:
      const __interest_bath = __amount * monthlyRate;
      const __interest_per_month = Math.pow(1 + monthlyRate, __installment);
      const __preAmount = __interest_bath * __interest_per_month;
      const __preInterest = __interest_per_month - 1;
      installmentPerMonth = Math.round((__preAmount / __preInterest + Number.EPSILON) * 100) / 100;
    }

    return `${Number(installmentPerMonth).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
    })} บาท`;
  }, [input, loanPlans]);

  return (
    <>
      <div className="deserve-area ptb-100">
        <div className="container">
          <div className="section-title">
            <span>สินเชื่อเพื่อคุณ</span>
            <h2>สมัครสินเชื่อกับเรา</h2>
            <p>
              กรอกแบบฟอร์มออนไลน์:
              เข้าไปที่เว็บไซต์ของเราและกรอกข้อมูลในแบบฟอร์มการสมัครสินเชื่อออนไลน์ที่
            </p>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="deserve-item">
                <h3>4 ขั้นตอนเพื่อขอรับสินเชื่อ</h3>

                <div className="deserve-content">
                  <span>1</span>
                  <h4>เอกสารที่จำเป็น</h4>
                  <p>
                    อัปโหลดเอกสารที่จำเป็น เช่น บัตรประจำตัวประชาชน
                    หลักฐานรายได้ และข้อมูลเพิ่มเติมตามที่ร้องขอ
                  </p>
                </div>

                <div className="deserve-content">
                  <span>2</span>
                  <h4>รอการอนุมัติ</h4>
                  <p>
                    เมื่อส่งแบบฟอร์มสมัครเสร็จสิ้น
                    ทีมงานของเราจะพิจารณาข้อมูลของท่านโดยรวดเร็ว
                  </p>
                </div>

                <div className="deserve-content">
                  <span>3</span>
                  <h4>รับผลการพิจารณา</h4>
                  <p>
                    ท่านจะได้รับการแจ้งผลเกี่ยวกับการอนุมัติสินเชื่อผ่าน SMS
                    หรือ Email
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
              <div className="rate-form">
                <div className="rate-content">
                  <span>คำนวนสินเชื่อ</span>
                  <h3>จำนวนสินเชื่อที่คุณต้องการ?</h3>
                </div>

                <form className="form">
                  <div className="form-group">
                    <label htmlFor="loan_plan">ประเภทเงินสินเชื่อ</label>
                    <select
                    id="loan-plan"
                    aria-label="เลือกประเภทสินเชื่อ"
                      className="form-select"
                      value={loanPlans.id}
                      name="loan_plan"
                      onChange={planOnChange}
                    >
                      <option value="ไม่ระบุ">เลือกประเภทสินเชื่อ</option>
                      {/* {plans.map((x, i) => (
                        <option key={i} value={x.id}>
                          {x.name} (สูงสุด:{toTHB(x.maximum_amount)})
                          {x.name}
                        </option>
                      ))} */}
                      {plans
                        // .filter(x => !x.name.startsWith("สินเชื่อเพื่อสวัสดิการ")) // กรองชื่อที่ไม่ขึ้นต้นด้วย "สินเชื่อเพื่อสวัสดิการ"
                        .filter(x => {
                          const excludedNames = ["สินเชื่อเพื่อสวัสดิการ", "test", "ดอกเบี้ยคงที่"]; // เพิ่มชื่อที่ต้องการกรองออก
                          return !excludedNames.some(name => x.name.startsWith(name));
                        })
                        .map((x, i) => (
                          <option key={i} value={x.id}>
                            {x.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="amount">วงเงินสินเชื่อ: {toTHB(input.amount)}</label>
                    <input
                      type="range"  
                      id="amount" 
                      value={input.amount}
                      name="amount"
                      onChange={onChange}
                      step={1000}
                      min={Number(loanPlans.minimum_amount)}
                      max={Number(loanPlans.maximum_amount)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount">ระยะเวลาการชำระ :  {loanPlans.rate[input.installment]?.installment || 12} เดือน</label>
                    <input
                      type="range"
                      value={input.installment}
                      id="installment"
                      name="installment"
                      onChange={onChange}
                      step={1}
                      min={0}
                      max={Number(loanPlans.rate.length - 1)}
                    />
                  </div>

                  <div className="form-group">
                    <label>อัตราการผ่อนชำระต่อเดือน</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="฿0"
                      readOnly
                      value={calculate}
                    />
                  </div>

                  <div className="rate-btn">
                  <Link href="/apply-now" className="default-btn">
                    ขอสินเชื่อ <span></span>
                  </Link>
                  
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyForLoanStyleOne;
