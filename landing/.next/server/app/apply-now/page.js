(()=>{var e={};e.id=649,e.ids=[649],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3773:(e,s,a)=>{"use strict";a.r(s),a.d(s,{GlobalError:()=>r.a,__next_app__:()=>u,originalPathname:()=>d,pages:()=>m,routeModule:()=>p,tree:()=>c}),a(3044),a(8341),a(2523);var t=a(3191),n=a(8716),l=a(7922),r=a.n(l),o=a(5231),i={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(i[e]=()=>o[e]);a.d(s,i);let c=["",{children:["apply-now",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,3044)),"C:\\Users\\User\\Documents\\GitLab\\p-loan\\p-loan\\landing\\src\\app\\apply-now\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,8341)),"C:\\Users\\User\\Documents\\GitLab\\p-loan\\p-loan\\landing\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(a.bind(a,2523)),"C:\\Users\\User\\Documents\\GitLab\\p-loan\\p-loan\\landing\\src\\app\\not-found.tsx"]}],m=["C:\\Users\\User\\Documents\\GitLab\\p-loan\\p-loan\\landing\\src\\app\\apply-now\\page.tsx"],d="/apply-now/page",u={require:a,loadChunk:()=>Promise.resolve()},p=new t.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/apply-now/page",pathname:"/apply-now",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},6208:(e,s,a)=>{Promise.resolve().then(a.t.bind(a,9404,23)),Promise.resolve().then(a.bind(a,4469)),Promise.resolve().then(a.bind(a,7058)),Promise.resolve().then(a.bind(a,2177))},4469:(e,s,a)=>{"use strict";a.d(s,{default:()=>i});var t=a(326),n=a(7577),l=a(610);let r={amount:0,firstname:"",birthdate:new Date().toISOString().split("T")[0],address:"",email:"",mobile:"",job:"",objective:"",income:0,lastname:"",sex:"",country:"ไทย",email2:"",job_company_name:"",job_address:"",loan_plan:""},o={loan_plan:{status:!1,message:"กรุณาระบุแผนสินเชื่อ"},amount:{status:!1,message:"กรุณาระบุจำนวนเงิน"},firstname:{status:!1,message:"กรุณากรอกชื่อผู้ติดต่อ"},lastname:{status:!1,message:"กรุณากรอกนามสกุลผู้ติดต่อ"},email:{status:!1,message:"กรุณากรอกอีเมล"},email2:{status:!1,message:"กรุณากรอกอีเมลสำรอง"},mobile:{status:!1,message:"กรุณากรอกเบอร์โทรศัพท์"},objective:{status:!1,message:"กรุณากรอกวัตถุประสงค์"},adress:{status:!1,message:"กรุณากรอกที่อยู่"},country:{status:!1,message:"กรุณาระบุประเทศ"},job:{status:!1,message:"กรุณาระบุอาชีพ"},income:{status:!1,message:"กรุณากรอกรายได้"}},i=()=>{let e=e=>`${Number(e).toLocaleString("th-TH",{currency:"THB",minimumFractionDigits:0})} บาท`,s=(0,n.useRef)(null),[a,i]=(0,n.useState)(!1),[c,m]=(0,n.useState)(r),[d,u]=(0,n.useState)([]),[p,x]=(0,n.useState)({status:0,message:""}),[h,j]=(0,n.useState)(o);async function g(e){try{e&&i(!0)}catch(e){i(!1)}}(0,n.useEffect)(()=>{fetch("https://api-member.moneyforyou.co.th/plan/loan/all",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(async e=>{let{data:s}=await e.json();u(s)})},[]);let v=e=>{"mobile"==e.target.name?j(s=>({...s,[e.target.name]:{status:!/^\d+$/.test(e.target.value),message:"กรุณาระบุเฉพาะตัวเลข"}})):"income"==e.target.name?j(s=>({...s,[e.target.name]:{status:!/^\d+$/.test(e.target.value),message:"กรุณาระบุเฉพาะตัวเลข"}})):"amount"==e.target.name?j(s=>({...s,[e.target.name]:{status:!/^\d+$/.test(e.target.value),message:"กรุณาระบุเฉพาะตัวเลข"}})):"email"==e.target.name?j(s=>({...s,[e.target.name]:{status:!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value),message:"กรุณาระบุรูปแบบอีเมลให้ถูกต้อง"}})):"email2"==e.target.name&&j(s=>({...s,[e.target.name]:{status:!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value),message:"กรุณาระบุรูปแบบอีเมลให้ถูกต้อง"}}))};function b(e){v(e);let{name:s,value:a}=e.target;m(e=>({...e,[s]:a}))}return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)("div",{className:"apply-area ptb-100",children:(0,t.jsxs)("div",{className:"container",children:[(0,t.jsx)("div",{className:"apply-title",children:(0,t.jsx)("h3",{children:"ข้อมูลการขอสินเชื่อ"})}),(0,t.jsxs)("form",{children:[0!=p.status&&(0,t.jsx)("div",{style:{width:"100%",padding:"12px",borderRadius:5,border:`1px solid ${2==p.status?"#eb0000":"#28a745"}`,color:`${2==p.status?"#eb0000":"#28a745"}`},children:p.message}),(0,t.jsxs)("div",{className:"row",children:[(0,t.jsx)("div",{className:"col-lg-6",children:(0,t.jsxs)("div",{className:"apply-form",children:[(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["ชื่อ"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.firstname.status&&h.firstname.message]})]}),(0,t.jsx)("input",{type:"text",value:c.firstname,name:"firstname",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["นามสกุล"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.lastname.status&&h.lastname.message]})]}),(0,t.jsx)("input",{type:"text",value:c.lastname,name:"lastname",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["โทร"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.mobile.status&&h.mobile.message]})]}),(0,t.jsx)("input",{type:"text",value:c.mobile,name:"mobile",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsx)("label",{children:"เพศ"}),(0,t.jsxs)("select",{className:"form-select",value:c.sex,name:"sex",onChange:b,children:[(0,t.jsx)("option",{value:"ไม่ระบุ",children:"โปรดเลือกเพศ"}),(0,t.jsx)("option",{value:"ชาย",children:"ชาย"}),(0,t.jsx)("option",{value:"หญิง",children:"หญิง"}),(0,t.jsx)("option",{value:"หญิง",children:"อื่นๆ"})]})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsx)("label",{children:"วันเกิด"}),(0,t.jsx)("input",{type:"date",value:c.birthdate,name:"birthdate",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["ที่อยู่"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.adress.status&&h.adress.message]})]}),(0,t.jsx)("input",{type:"text",value:c.address,name:"address",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["ประเทศ"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.country.status&&h.country.message]})]}),(0,t.jsx)("select",{className:"form-select",children:(0,t.jsx)("option",{value:"ไทย",children:"ไทย"})})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["อาชีพ"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.job.status&&h.job.message]})]}),(0,t.jsxs)("select",{className:"form-select",value:c.job,name:"job",onChange:b,children:[(0,t.jsx)("option",{value:"ไม่ระบุ",children:"โปรดเลือกอาชีพ"}),(0,t.jsx)("option",{value:"วิทยาศาสตร์และเทคโนโลยี",children:"วิทยาศาสตร์และเทคโนโลยี"}),(0,t.jsx)("option",{value:"วิศวกรรมและการก่อสร้าง",children:"วิศวกรรมและการก่อสร้าง"}),(0,t.jsx)("option",{value:"สุขภาพและการแพทย์",children:"สุขภาพและการแพทย์"}),(0,t.jsx)("option",{value:"การศึกษาและวิชาการ",children:"การศึกษาและวิชาการ"}),(0,t.jsx)("option",{value:"ธุรกิจ การเงิน และการบริหาร",children:"ธุรกิจ การเงิน และการบริหาร"}),(0,t.jsx)("option",{value:"ศิลปะ การออกแบบ และสถาปัตยกรรม",children:"ศิลปะ การออกแบบ และสถาปัตยกรรม"}),(0,t.jsx)("option",{value:"การบันเทิงและสื่อสารมวลชน",children:"การบันเทิงและสื่อสารมวลชน"}),(0,t.jsx)("option",{value:"บริการลูกค้าและการค้าปลีก",children:"บริการลูกค้าและการค้าปลีก"}),(0,t.jsx)("option",{value:"กฎหมายและการปกครอง",children:"กฎหมายและการปกครอง"}),(0,t.jsx)("option",{value:"การเกษตรและอุตสาหกรรมการผลิต",children:"การเกษตรและอุตสาหกรรมการผลิต"}),(0,t.jsx)("option",{value:"เทคโนโลยีสารสนเทศและการสื่อสาร",children:"เทคโนโลยีสารสนเทศและการสื่อสาร"}),(0,t.jsx)("option",{value:"ขนส่งและโลจิสติกส์",children:"ขนส่งและโลจิสติกส์"}),(0,t.jsx)("option",{value:"การท่องเที่ยวและการโรงแรม",children:"การท่องเที่ยวและการโรงแรม"}),(0,t.jsx)("option",{value:"อื่นๆ",children:"อื่นๆ"})]})]})]})}),(0,t.jsx)("div",{className:"col-lg-6",children:(0,t.jsxs)("div",{className:"apply-form",children:[(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["ประเภทเงินสินเชื่อ"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.loan_plan.status&&h.loan_plan.message]})]}),(0,t.jsxs)("select",{className:"form-select",value:c.loan_plan,name:"loan_plan",onChange:b,children:[(0,t.jsx)("option",{value:"ไม่ระบุ",children:"เลือกประเภทสินเชื่อ"}),d.map((s,a)=>(0,t.jsxs)("option",{value:s.name,children:[s.name," (สูงสุด:",e(s.maximum_amount),")"]},a))]})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["วงเงินสินเชื่อที่ต้องการ"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.amount.status&&h.amount.message]})]}),(0,t.jsx)("input",{type:"text",value:c.amount,name:"amount",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["วัตถุประสงค์ของการขอสินเชื่อ"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.objective.status&&h.objective.message]})]}),(0,t.jsx)("input",{type:"text",value:c.objective,name:"objective",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["รายได้ / เดือน"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.income.status&&h.income.message]})]}),(0,t.jsx)("input",{type:"text",value:c.income,name:"income",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["อีเมล"," ",(0,t.jsxs)("span",{style:{color:"#eb0000"},children:["* ",h.email.status&&h.email.message]})]}),(0,t.jsx)("input",{type:"email",value:c.email,name:"email",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsxs)("label",{children:["ที่อยู่อีเมลสํารอง"," ",(0,t.jsx)("span",{style:{color:"#eb0000"},children:h.email2.status&&""!=c.email2&&`* ${h.email2.message}`})]}),(0,t.jsx)("input",{type:"email",value:c.email2,name:"email2",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsx)("label",{children:"ชื่อบริษัท"}),(0,t.jsx)("input",{type:"text",value:c.job_company_name,name:"job_company_name",onChange:b,className:"form-control"})]}),(0,t.jsxs)("div",{className:"form-group",children:[(0,t.jsx)("label",{children:"ที่อยู่บริษัท"}),(0,t.jsx)("input",{type:"text",value:c.job_address,name:"job_address",onChange:b,className:"form-control"})]})]})})]}),(0,t.jsx)("div",{className:"form-group",children:(0,t.jsx)(l.Z,{sitekey:"6Lc7txMqAAAAAC5vw9jnP0Ga1G7A8Olh52rkP1eI",ref:s,onChange:e=>{g(e)},onExpired:function(){i(!1)}})}),(0,t.jsx)("div",{className:"apply-btn",children:(0,t.jsxs)("button",{disabled:!a,onClick:function(e){e.preventDefault();let s=0;if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(c.email)||(s+=1,o.email.status=!0),/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(c.email2)||(s+=1,o.email2.status=!0),""==c.loan_plan&&(s+=1,o.loan_plan.status=!0),c.amount<1e3&&(s+=1,o.amount.status=!0),""==c.firstname&&(s+=1,o.firstname.status=!0),""==c.lastname&&(s+=1,o.lastname.status=!0),""==c.objective&&(s+=1,o.lastname.status=!0),""==c.mobile&&(s+=1,o.mobile.status=!0),""==c.address&&(s+=1,o.adress.status=!0),""==c.email&&(s+=1,o.email.status=!0),""==c.email2&&(s+=1,o.email2.status=!0),c.income<1e3&&(s+=1,o.income.status=!0),s>0){j(o);return}fetch("https://api-member.moneyforyou.co.th/nonloan/apply-now",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({...c})}).then(async e=>{m(r),x({status:1,message:"การดำเนินการเสร็จสิ้น  ,ขอบคุณที่ร่วมเป็นส่วนหนึ่งของเรา"}),i(!1)}).catch(async e=>{x({status:2,message:"การดำเนินการผิดพลาด  ,กรุณาตรวจสอบความถูกต้องของข้อมูล"})})},type:"submit",className:"btn default-btn btn-lg",style:{width:"50%"},children:["ยื่นคำขอ ",(0,t.jsx)("span",{})]})})]})]})})})}},3044:(e,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>u});var t=a(9510);a(1159);var n=a(9174),l=a(889),r=a(2647),o=a(8570);let i=(0,o.createProxy)(String.raw`C:\Users\User\Documents\GitLab\p-loan\p-loan\landing\src\components\ApplyNow\ApplyNowForm.tsx`),{__esModule:c,$$typeof:m}=i;i.default;let d=(0,o.createProxy)(String.raw`C:\Users\User\Documents\GitLab\p-loan\p-loan\landing\src\components\ApplyNow\ApplyNowForm.tsx#default`);function u(){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.ZP,{}),(0,t.jsx)(l.Z,{pageTitle:"ขอสินเชื่อ",homePageUrl:"/",homePageText:"หน้าแรก",activePageText:"ขอสินเชื่อ",bgImage:"/images/page-title/bg-2.jpg"}),(0,t.jsx)(d,{}),(0,t.jsx)(r.ZP,{})]})}},889:(e,s,a)=>{"use strict";a.d(s,{Z:()=>l});var t=a(9510);a(1159);var n=a(7371);let l=({pageTitle:e,homePageUrl:s,homePageText:a,activePageText:l,bgImage:r})=>(0,t.jsx)(t.Fragment,{children:(0,t.jsx)("div",{className:"page-title-area",style:{backgroundImage:`url(${r})`},children:(0,t.jsx)("div",{className:"d-table",children:(0,t.jsx)("div",{className:"d-table-cell",children:(0,t.jsx)("div",{className:"container",children:(0,t.jsxs)("div",{className:"page-title-content",children:[(0,t.jsx)("h2",{children:e}),(0,t.jsxs)("ul",{children:[(0,t.jsx)("li",{children:(0,t.jsx)(n.default,{href:s,children:a})}),(0,t.jsx)("li",{className:"active",children:l})]})]})})})})})})},2647:(e,s,a)=>{"use strict";a.d(s,{ZP:()=>o});var t=a(8570);let n=(0,t.createProxy)(String.raw`C:\Users\User\Documents\GitLab\p-loan\p-loan\landing\src\components\Layouts\Footer.tsx`),{__esModule:l,$$typeof:r}=n;n.default;let o=(0,t.createProxy)(String.raw`C:\Users\User\Documents\GitLab\p-loan\p-loan\landing\src\components\Layouts\Footer.tsx#default`)},9174:(e,s,a)=>{"use strict";a.d(s,{ZP:()=>o});var t=a(8570);let n=(0,t.createProxy)(String.raw`C:\Users\User\Documents\GitLab\p-loan\p-loan\landing\src\components\Layouts\Navbar.tsx`),{__esModule:l,$$typeof:r}=n;n.default;let o=(0,t.createProxy)(String.raw`C:\Users\User\Documents\GitLab\p-loan\p-loan\landing\src\components\Layouts\Navbar.tsx#default`)}};var s=require("../../webpack-runtime.js");s.C(e);var a=e=>s(s.s=e),t=s.X(0,[534,816,311],()=>a(3773));module.exports=t})();