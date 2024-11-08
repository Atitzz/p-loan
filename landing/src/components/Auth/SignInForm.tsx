"use client";
  
import React from "react";
import Link from "next/link";

const SignInForm: React.FC = () => {
  return (
    <>
      <div className="sign-in-area ptb-100">
        <div className="container">
          <div className="sign-in-form">
            <div className="sign-in-title">
              <h3>Welcome Back!</h3>
              <p>Please Sign In to your account.</p>
            </div>

            <form>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                />
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="checkme"
                    />
                    <label className="form-check-label" htmlFor="checkme">
                      Keep me Log In
                    </label>
                  </div>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="forgot-password">
                    <Link href="#">Forgot Password?</Link>
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="send-btn">
                  <button type="submit" className="default-btn">
                    Sign In Now <span></span>
                  </button>
                </div>
                <br />
                <span>
                  Don&apos;t have account? <Link href="/sign-up">Sign Up!</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInForm;
