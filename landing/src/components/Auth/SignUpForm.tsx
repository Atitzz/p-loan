"use client";
  
import React from "react";
import Link from "next/link";

const SignUpForm: React.FC = () => {
  return (
    <>
      <div className="signup-area ptb-100">
        <div className="container">
          <div className="signup-form">
            <h3>สมัครสมาชิก</h3>
            <form>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="checkme"
                    />
                    <label className="form-check-label" htmlFor="checkme">
                      ยอมรับเงื่อนไขความเป็นส่วนตัว
                    </label>
                  </div>
                </div>

                <div className="col-6 text-right">
                  <div className="send-btn">
                    <button type="submit" className="default-btn">
                      สมัคร <span></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p>
                  เป็นสมาชิกอยู่แล้ว?{" "}
                  <Link href="line://ti/p/@830hhlhc">เข้าสู่ระบบ!</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
