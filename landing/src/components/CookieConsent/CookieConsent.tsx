"use client";

import { setCookie, hasCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

export const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const checkConsent = async () => {
            if (!hasCookie('consent')) {
                setShowConsent(true);
            }
        };
        checkConsent();
    }, []);

    const acceptConsent = () => {
        setShowConsent(false);
        setCookie('consent', 'true');
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('updateGTMConsent'));
        }
    };

    const declineConsent = () => {
        setShowConsent(false);
    };

    if (!showConsent) {
        return null;
    }

    return (
        <div className="fixed-bottom d-flex justify-content-center p-3" style={{ backgroundColor: '#f0e5d8', color: '#333' }}>
            <div className="container d-flex flex-column align-items-center">
                <p className="text-center mb-3">
                    เราใช้ <strong>แพ็คเกจวิเคราะห์มาตรฐาน</strong> เพื่อเข้าใจพฤติกรรมทั่วไปของผู้ใช้
                    เพื่อให้เราสามารถปรับปรุงเนื้อหาของเราได้ ซึ่งเกี่ยวข้องกับการใช้คุกกี้ คุณโอเคกับสิ่งนี้หรือไม่?
                </p>
                <div className="d-flex">
                    <button onClick={acceptConsent} className="btn" style={{ backgroundColor: '#d3a84f', color: '#fff', marginRight: '10px' }}>
                        ยอมรับ
                    </button>
                    <button onClick={declineConsent} className="btn" style={{ backgroundColor: '#a8a8a8', color: '#fff' }}>
                        ปฏิเสธ
                    </button>
                </div>
            </div>
        </div>
    );
};
