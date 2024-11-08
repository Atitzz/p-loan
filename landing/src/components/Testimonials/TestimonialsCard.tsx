"use client";

import React from "react";
import Image from "next/image";

const TestimonialsCard: React.FC = () => {
  return (
    <>
      <div className="pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client1.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>Markus Twain</h4>
                  <span>React Developer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client2.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>Jessica Molony</h4>
                  <span>Angular Developer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client3.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>James</h4>
                  <span>Web Designer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client4.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>Michael</h4>
                  <span>Vue Developer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client5.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>William</h4>
                  <span>Web Developer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="clients-item">
                <div className="info">
                  <Image
                    src="/images/clients/client6.png"
                    alt="image"
                    width={100}
                    height={100}
                  />
                  <h4>Christopher</h4>
                  <span>TF Developer</span>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis ipsum suspendisse ultrices gravida.
                </p>
                <div className="icon">
                  <i className="flaticon-right-quote"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsCard;
