"use client";

import React from "react";

const FaqForm: React.FC = () => {
  return (
    <>
      <div className="faq-contact">
        <div className="section-title">
          <h2>Still, have questions?</h2>
        </div>

        <div className="faq-contact-form">
          <form>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    name="number"
                    placeholder="Phone number"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <textarea
                    name="text"
                    cols={30}
                    rows={6}
                    placeholder="Write your message..."
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-12 col-sm-12">
                <button type="submit" className="btn default-btn">
                  Send message <span></span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FaqForm;
