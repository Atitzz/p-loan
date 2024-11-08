(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{9072:function(e,i,s){Promise.resolve().then(s.bind(s,7415)),Promise.resolve().then(s.bind(s,7452)),Promise.resolve().then(s.bind(s,8722)),Promise.resolve().then(s.bind(s,4057)),Promise.resolve().then(s.bind(s,3101)),Promise.resolve().then(s.bind(s,7889)),Promise.resolve().then(s.bind(s,8363))},1449:function(e,i){"use strict";/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */i.parse=function(e,i){if("string"!=typeof e)throw TypeError("argument str must be a string");for(var s={},n=(i||{}).decode||r,t=0;t<e.length;){var a=e.indexOf("=",t);if(-1===a)break;var c=e.indexOf(";",t);if(-1===c)c=e.length;else if(c<a){t=e.lastIndexOf(";",a-1)+1;continue}var o=e.slice(t,a).trim();if(void 0===s[o]){var l=e.slice(a+1,c).trim();34===l.charCodeAt(0)&&(l=l.slice(1,-1)),s[o]=function(e,i){try{return i(e)}catch(i){return e}}(l,n)}t=c+1}return s},i.serialize=function(e,i,r){var a=r||{},c=a.encode||t;if("function"!=typeof c)throw TypeError("option encode is invalid");if(!n.test(e))throw TypeError("argument name is invalid");var o=c(i);if(o&&!n.test(o))throw TypeError("argument val is invalid");var l=e+"="+o;if(null!=a.maxAge){var d=a.maxAge-0;if(isNaN(d)||!isFinite(d))throw TypeError("option maxAge is invalid");l+="; Max-Age="+Math.floor(d)}if(a.domain){if(!n.test(a.domain))throw TypeError("option domain is invalid");l+="; Domain="+a.domain}if(a.path){if(!n.test(a.path))throw TypeError("option path is invalid");l+="; Path="+a.path}if(a.expires){var h=a.expires;if("[object Date]"!==s.call(h)&&!(h instanceof Date)||isNaN(h.valueOf()))throw TypeError("option expires is invalid");l+="; Expires="+h.toUTCString()}if(a.httpOnly&&(l+="; HttpOnly"),a.secure&&(l+="; Secure"),a.partitioned&&(l+="; Partitioned"),a.priority)switch("string"==typeof a.priority?a.priority.toLowerCase():a.priority){case"low":l+="; Priority=Low";break;case"medium":l+="; Priority=Medium";break;case"high":l+="; Priority=High";break;default:throw TypeError("option priority is invalid")}if(a.sameSite)switch("string"==typeof a.sameSite?a.sameSite.toLowerCase():a.sameSite){case!0:case"strict":l+="; SameSite=Strict";break;case"lax":l+="; SameSite=Lax";break;case"none":l+="; SameSite=None";break;default:throw TypeError("option sameSite is invalid")}return l};var s=Object.prototype.toString,n=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function r(e){return -1!==e.indexOf("%")?decodeURIComponent(e):e}function t(e){return encodeURIComponent(e)}},3375:function(e,i,s){"use strict";var n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var i,s=1,n=arguments.length;s<n;s++)for(var r in i=arguments[s])Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);return e}).apply(this,arguments)},r=this&&this.__rest||function(e,i){var s={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>i.indexOf(n)&&(s[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var r=0,n=Object.getOwnPropertySymbols(e);r<n.length;r++)0>i.indexOf(n[r])&&Object.prototype.propertyIsEnumerable.call(e,n[r])&&(s[n[r]]=e[n[r]]);return s};Object.defineProperty(i,"__esModule",{value:!0}),i.hasCookie=i.deleteCookie=i.setCookie=i.getCookie=i.getCookies=void 0;var t=s(1449),a=function(){return"undefined"!=typeof window},c=function(e){return!!e&&"getAll"in e&&"set"in e&&"function"==typeof e.getAll&&"function"==typeof e.set},o=function(e){return!!(null==e?void 0:e.req)&&"cookies"in e.req&&c(null==e?void 0:e.req.cookies)||!!(null==e?void 0:e.res)&&"cookies"in e.res&&c(null==e?void 0:e.res.cookies)||!!(null==e?void 0:e.cookies)&&c(e.cookies())},l=function(e){var i={};return e.getAll().forEach(function(e){var s=e.name,n=e.value;i[s]=n}),i},d=function(e){try{if("string"==typeof e)return e;return JSON.stringify(e)}catch(i){return e}};i.getCookies=function(e){if(o(e)){if(null==e?void 0:e.req)return l(e.req.cookies);if(null==e?void 0:e.cookies)return l(e.cookies())}if(e&&(i=e.req),!a())return i&&i.cookies?i.cookies:i&&i.headers.cookie?(0,t.parse)(i.headers.cookie):{};for(var i,s={},n=document.cookie?document.cookie.split("; "):[],r=0,c=n.length;r<c;r++){var d=n[r].split("="),h=d.slice(1).join("=");s[d[0]]=h}return s},i.getCookie=function(e,s){var n=(0,i.getCookies)(s)[e];if(void 0!==n)return n?n.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent):n},i.setCookie=function(e,i,s){if(o(s)){var c,l,h,f=s.req,m=s.res,u=s.cookies,x=r(s,["req","res","cookies"]),p=n({name:e,value:d(i)},x);f&&f.cookies.set(p),m&&m.cookies.set(p),u&&u().set(p);return}if(s){var f=s.req,m=s.res,j=r(s,["req","res"]);l=f,h=m,c=j}var v=(0,t.serialize)(e,d(i),n({path:"/"},c));if(a())document.cookie=v;else if(h&&l){var g=h.getHeader("Set-Cookie");if(Array.isArray(g)||(g=g?[String(g)]:[]),h.setHeader("Set-Cookie",g.concat(v)),l&&l.cookies){var N=l.cookies;""===i?delete N[e]:N[e]=d(i)}if(l&&l.headers&&l.headers.cookie){var N=(0,t.parse)(l.headers.cookie);""===i?delete N[e]:N[e]=d(i),l.headers.cookie=Object.entries(N).reduce(function(e,i){return e.concat("".concat(i[0],"=").concat(i[1],";"))},"")}}},i.deleteCookie=function(e,s){return(0,i.setCookie)(e,"",n(n({},s),{maxAge:-1}))},i.hasCookie=function(e,s){return!!e&&(0,i.getCookies)(s).hasOwnProperty(e)}},6648:function(e,i,s){"use strict";s.d(i,{default:function(){return r.a}});var n=s(5601),r=s.n(n)},7138:function(e,i,s){"use strict";s.d(i,{default:function(){return r.a}});var n=s(231),r=s.n(n)},6463:function(e,i,s){"use strict";var n=s(1169);s.o(n,"usePathname")&&s.d(i,{usePathname:function(){return n.usePathname}})},5601:function(e,i,s){"use strict";Object.defineProperty(i,"__esModule",{value:!0}),function(e,i){for(var s in i)Object.defineProperty(e,s,{enumerable:!0,get:i[s]})}(i,{default:function(){return o},getImageProps:function(){return c}});let n=s(9920),r=s(497),t=s(8173),a=n._(s(1241));function c(e){let{props:i}=(0,r.getImgProps)(e,{defaultLoader:a.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image/",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,s]of Object.entries(i))void 0===s&&delete i[e];return{props:i}}let o=t.Image},7452:function(e,i,s){"use strict";var n=s(7437);s(2265),i.default=()=>(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{className:"process-area pt-100 pb-70",children:(0,n.jsxs)("div",{className:"container",children:[(0,n.jsxs)("div",{className:"section-title",children:[(0,n.jsx)("span",{children:"ได้เงินไวไม่ยุ่งยาก"}),(0,n.jsx)("h2",{children:"สินเชื่อสำหรับทุกความต้องการ"}),(0,n.jsx)("p",{children:"เราเสนออัตราดอกเบี้ยที่ต่ำเพื่อช่วยให้คุณสามารถจัดการการเงินได้อย่างมีประสิทธิภาพ สมัครง่าย อนุมัติไว เพื่อให้คุณไม่พลาดโอกาส เราเชื่อมั่นในศักยภาพของคุณ และพร้อมที่จะสนับสนุนทุกก้าวย่างในการเดินทางสู่ความสำเร็จ"})]}),(0,n.jsxs)("div",{className:"row",children:[(0,n.jsx)("div",{className:"col-lg-3 col-md-6",children:(0,n.jsxs)("div",{className:"process-item",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-guarantee"})}),(0,n.jsx)("h3",{children:"ดอกเบี้ยต่ำ"}),(0,n.jsx)("p",{children:"เราเสนออัตราดอกเบี้ยที่ต่ำเพื่อช่วยให้คุณสามารถจัดการการเงินได้อย่างมีประสิทธิภาพ"})]})}),(0,n.jsx)("div",{className:"col-lg-3 col-md-6",children:(0,n.jsxs)("div",{className:"process-item",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-speed"})}),(0,n.jsx)("h3",{children:"สมัครง่าย"}),(0,n.jsx)("p",{children:"เพียงไม่กี่ขั้นตอนเพื่อรับสินเชื่อของเรา"})]})}),(0,n.jsx)("div",{className:"col-lg-3 col-md-6",children:(0,n.jsxs)("div",{className:"process-item",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-reliability"})}),(0,n.jsx)("h3",{children:"อนุมัติเร็ว"}),(0,n.jsx)("p",{children:"เพื่อให้คุณไม่พลาดโอกาสทางธุรกิจ"})]})}),(0,n.jsx)("div",{className:"col-lg-3 col-md-6",children:(0,n.jsxs)("div",{className:"process-item",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-user-experience"})}),(0,n.jsx)("h3",{children:"บริการด้วยใจ"}),(0,n.jsx)("p",{children:"พร้อมที่จะสนับสนุนทุกก้าวย่างในการเดินทางสู่ความสำเร็จ"})]})})]})]})})})},8722:function(e,i,s){"use strict";s.d(i,{CookieConsent:function(){return a}});var n=s(7437),r=s(3375),t=s(2265);let a=()=>{let[e,i]=(0,t.useState)(!1);return((0,t.useEffect)(()=>{(async()=>{(0,r.hasCookie)("consent")||i(!0)})()},[]),e)?(0,n.jsx)("div",{className:"fixed-bottom d-flex justify-content-center p-3",style:{backgroundColor:"#f0e5d8",color:"#333"},children:(0,n.jsxs)("div",{className:"container d-flex flex-column align-items-center",children:[(0,n.jsxs)("p",{className:"text-center mb-3",children:["เราใช้ ",(0,n.jsx)("strong",{children:"แพ็คเกจวิเคราะห์มาตรฐาน"})," เพื่อเข้าใจพฤติกรรมทั่วไปของผู้ใช้ เพื่อให้เราสามารถปรับปรุงเนื้อหาของเราได้ ซึ่งเกี่ยวข้องกับการใช้คุกกี้ คุณโอเคกับสิ่งนี้หรือไม่?"]}),(0,n.jsxs)("div",{className:"d-flex",children:[(0,n.jsx)("button",{onClick:()=>{i(!1),(0,r.setCookie)("consent","true"),window.dispatchEvent(new Event("updateGTMConsent"))},className:"btn",style:{backgroundColor:"#d3a84f",color:"#fff",marginRight:"10px"},children:"ยอมรับ"}),(0,n.jsx)("button",{onClick:()=>{i(!1)},className:"btn",style:{backgroundColor:"#a8a8a8",color:"#fff"},children:"ปฏิเสธ"})]})]})}):null}},4057:function(e,i,s){"use strict";var n=s(7437);s(2265),i.default=()=>(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)("div",{className:"main-banner-area",style:{backgroundImage:"url(/images/main-banner.webp)"},children:[(0,n.jsx)("div",{className:"d-table",children:(0,n.jsx)("div",{className:"d-table-cell",children:(0,n.jsx)("div",{className:"container-fluid",children:(0,n.jsx)("div",{className:"banner-social-buttons",children:(0,n.jsxs)("ul",{children:[(0,n.jsx)("li",{children:(0,n.jsx)("span",{children:"ช่องทาง"})}),(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:"https://www.twitter.com/",target:"_blank",children:(0,n.jsx)("i",{className:"flaticon-twitter"})})}),(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:"https://www.instagram.com/",target:"_blank",children:(0,n.jsx)("i",{className:"flaticon-instagram"})})}),(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:"https://www.facebook.com/",target:"_blank",children:(0,n.jsx)("i",{className:"flaticon-facebook"})})}),(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:"https://www.linkedin.com/",target:"_blank",children:(0,n.jsx)("i",{className:"flaticon-linkedin"})})}),(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:"line://ti/p/@830hhlhc",target:"_blank",children:(0,n.jsx)("i",{className:"fab fa-line",style:{fontSize:"19px"}})})})]})})})})}),(0,n.jsx)("div",{className:"approvals-area",children:(0,n.jsx)("div",{className:"container-fluid",children:(0,n.jsxs)("div",{className:"row",children:[(0,n.jsx)("div",{className:"col-lg-4 col-md-6",children:(0,n.jsxs)("div",{className:"approvals-content",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-loan"})}),(0,n.jsx)("span",{children:"อนุมัติง่าย"}),(0,n.jsx)("p",{children:"ได้ทันที"})]})}),(0,n.jsx)("div",{className:"col-lg-4 col-md-6",children:(0,n.jsxs)("div",{className:"approvals-content",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-satisfaction"})}),(0,n.jsx)("span",{children:"20,000"}),(0,n.jsx)("p",{children:"ความพึงพอใจของลูกค้า"})]})}),(0,n.jsx)("div",{className:"col-lg-4 col-md-6 offset-lg-0 offset-md-3",children:(0,n.jsxs)("div",{className:"approvals-content",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-document"})}),(0,n.jsx)("span",{children:"ไม่มีการชําระเงินล่วงหน้าหรือ"}),(0,n.jsx)("p",{children:"ค่าธรรมเนียมแอบแฝง"})]})})]})})})]})})},3101:function(e,i,s){"use strict";var n=s(7437);s(2265);var r=s(6648);i.default=()=>(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{className:"company-area",children:(0,n.jsx)("div",{className:"container-fluid",children:(0,n.jsxs)("div",{className:"row",children:[(0,n.jsx)("div",{className:"col-lg-7",children:(0,n.jsx)("div",{className:"company-image",style:{backgroundImage:"url(/images/company.jpg)"},children:(0,n.jsx)(r.default,{src:"/images/company.jpg",alt:"image",width:945,height:678})})}),(0,n.jsx)("div",{className:"col-lg-5",children:(0,n.jsxs)("div",{className:"company-content",children:[(0,n.jsx)("h3",{children:"คุณค่าของเรา"}),(0,n.jsxs)("div",{className:"company-text",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-idea"})}),(0,n.jsx)("h4",{children:"ความซื่อสัตย์และความโปร่งใส"}),(0,n.jsx)("p",{children:"เราดำเนินธุรกิจด้วยความซื่อสัตย์และเปิดเผยข้อมูลอย่างโปร่งใส เพื่อให้ลูกค้าใช้บริการได้อย่างมั่นใจ"})]}),(0,n.jsxs)("div",{className:"company-text",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-talent"})}),(0,n.jsx)("h4",{children:"การสนับสนุนความสำเร็จของลูกค้า"}),(0,n.jsx)("p",{children:"เรามุ่งมั่นที่จะเห็นคุณประสบความสำเร็จ ไม่ว่าคุณจะเริ่มต้นธุรกิจใหม่หรือขยายธุรกิจเดิม เราพร้อมที่จะสนับสนุนทุกก้าวย่างของคุณ"})]}),(0,n.jsxs)("div",{className:"company-text",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-key"})}),(0,n.jsx)("h4",{children:"การบริการด้วยหัวใจ"}),(0,n.jsx)("p",{children:"การให้บริการที่เป็นมิตรและจริงใจคือหัวใจของเรา เราใส่ใจในทุกความต้องการและพร้อมที่จะให้คำปรึกษาที่เหมาะสมเพื่อช่วยให้คุณบรรลุเป้าหมายทางการเงิน"})]}),(0,n.jsxs)("div",{className:"company-text",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-responsibility"})}),(0,n.jsx)("h4",{children:"นวัตกรรมและความคิดสร้างสรรค์"}),(0,n.jsx)("p",{children:"เราเชื่อในการนำเสนอวิธีแก้ไขที่ทันสมัยและสร้างสรรค์ เพื่อให้ลูกค้าของเราได้รับประสบการณ์ที่ดีที่สุดและก้าวหน้าไปพร้อมกับการเปลี่ยนแปลงของโลกธุรกิจ"})]}),(0,n.jsxs)("div",{className:"company-text",children:[(0,n.jsx)("div",{className:"icon",children:(0,n.jsx)("i",{className:"flaticon-growth"})}),(0,n.jsx)("h4",{children:"ความรับผิดชอบต่อสังคม"}),(0,n.jsx)("p",{children:"เรามีความรับผิดชอบต่อชุมชนและสิ่งแวดล้อม โดยมุ่งเน้นในการดำเนินธุรกิจอย่างยั่งยืนและเป็นมิตรต่อสังคม"})]})]})})]})})})})}},function(e){e.O(0,[30,917,415,971,23,744],function(){return e(e.s=9072)}),_N_E=e.O()}]);