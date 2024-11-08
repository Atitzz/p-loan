"use client";

import React, { useState, useEffect } from "react";

const GoTop: React.FC = () => {
  const [showScroll, setShowScroll] = useState<boolean>(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 100) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 100) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="go-top"
        onClick={scrollTop}
        style={{
          display: showScroll ? "block" : "none",
        }}
      >
        <i className='bx bx-chevrons-up'></i>
      </div>
    </>
  );
};

export default GoTop;
