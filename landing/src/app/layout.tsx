import "../../styles/bootstrap.min.css";
import "../../styles/animate.css";
import "../../styles/boxicons.min.css";
import "../../styles/flaticon.css";
import "react-accessible-accordion/dist/fancy-example.css";
import "swiper/css";
import "swiper/css/bundle";
// Global styles
import "../../styles/style.css";
import "../../styles/responsive.css";

import type { Metadata } from "next";
import { Roboto, Rubik, Sarabun } from "next/font/google";
import GoTop from "@/components/Layouts/GoTop";
import { hasCookie } from "cookies-next";
import { useEffect } from "react";
// For all body text font
const sarabun = Sarabun({
  weight: ["100", "300", "400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sarabun",
  display: "swap",
});

// For all body text font
const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

// For all heading font
const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Money For You",
  description:
    "ยินดีต้อนรับสู่โอกาสใหม่ในการสร้างอนาคตทางธุรกิจของคุณ เราพร้อมที่จะเป็นส่วนหนึ่งในความสำเร็จของคุณ ไม่ว่าคุณจะกำลังเริ่มต้นธุรกิจใหม่หรือขยายธุรกิจที่มีอยู่ สินเชื่อของเราจะเป็นทางเลือกที่คุ้มค่า เพื่อให้คุณสามารถเดินหน้าสู่เป้าหมายได้อย่างมั่นใจ",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useEffect(() => {
  //   if (hasCookie('consent')) {
  //     loadScripts();
  //   }
  // }, []);
  return (
    <html lang="en">
        <head>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=YOUR_GA_MEASUREMENT_ID`}></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'YOUR_GA_MEASUREMENT_ID', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </head>
      <body
        className={`${sarabun.variable} ${roboto.variable} ${rubik.variable}`}
      >
        {children}

        <GoTop />
      </body>
    </html>
  );
}
