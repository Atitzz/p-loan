import { createContext, useContext } from "react";

export interface AuthType {
  status: boolean;
  remember: boolean;
  employee_id: string;
  fullname: string;
  username: string;
  sidebars:any[];
  user_role:string;
  firstname:string;
  lastname:string;
}

interface ImageType {
  preview: string;
  data: File | null;
  name: string;
}

export interface RouteType {
  id: number,
  name: string,
  name_th: string,
  path: string,
  link:string,
  type:string,
  index:number,
  icon: string,
  component: string,
  details: string,
}

export interface ContextValueType {
  ThemePrimary: string;
  setThemePrimary: React.Dispatch<React.SetStateAction<string>>;
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
  config: {
    hospital_name: string;
    tel: string;
    tax_id: string;
    address: string;
  };
  setConfig: React.Dispatch<
    React.SetStateAction<{
      hospital_name: string;
      tel: string;
      tax_id: string;
      address: string;
    }>
  >;
  logo: ImageType;
  setLogo: React.Dispatch<React.SetStateAction<ImageType>>;
  component: any[]; // ปรับให้เป็นประเภทข้อมูลที่ถูกต้องตามที่คุณใช้
  setComponent: React.Dispatch<React.SetStateAction<any[]>>; // ปรับให้เป็นประเภทข้อมูลที่ถูกต้องตามที่คุณใช้
  dataRoute: RouteType[]; // ปรับให้เป็นประเภทข้อมูลที่ถูกต้องตามที่คุณใช้
  setRoute:React.Dispatch<React.SetStateAction<any[]>>;
  AddAlert: (msg: string, variant?: string) => void;
  lang:string;
  setLanguage:React.Dispatch<React.SetStateAction<string>>;
  useLang:(a:string,b?:string)=>string
  badge: any;
  setBadge: React.Dispatch<React.SetStateAction<any>>;
}

export const MainContext = createContext<ContextValueType>({
  // ThemePrimary: "#1976d2",
  ThemePrimary: "#071251",
  setThemePrimary: () => {},
  auth: {
    status: false,
    remember: false,
    employee_id: "",
    fullname: "",
    username: "",
    sidebars:[],
    user_role:"user",
    firstname:'',
    lastname:''
  },
  setAuth: () => {},
  config: {
    hospital_name: "",
    tel: "",
    tax_id: "",
    address: "",
  },
  setConfig: () => {},
  logo: {
    preview: "",
    data: null,
    name: "",
  },
  setLogo: () => {},
  component: [],
  setComponent: () => {},
  dataRoute: [],
  setRoute: () => [],
  AddAlert: () => {},
  lang:'th',
  setLanguage: () => {
  },
  useLang(a,b) {
    return a
  },
  badge:{},
  setBadge: () => {},
});

export interface HttpContextInterface {
  Get: (path: string) => Promise<any>;
  Post: (path: string, data: object) => Promise<any>;
  Put: (path: string, data: object) => Promise<any>;
  Patch: (path: string) => Promise<any>;
  Delete: (path: string, data: object) => Promise<any>;
  Picture: (path: string) => Promise<any>;
  ErrorResponse: (error: any) => any;
  MessageResponse: (Response: any) => any;
}

export const HttpContext = createContext<HttpContextInterface>({
  Get: () => Promise.resolve(undefined),
  Post: () => Promise.resolve(undefined),
  Put: () => Promise.resolve(undefined),
  Patch: () => Promise.resolve(undefined),
  Delete: () => Promise.resolve(undefined),
  Picture: () => Promise.resolve(undefined),
  ErrorResponse: (error: any) => error.response?.data.system_response.message,
  MessageResponse: (response: any) => response?.data.system_response.message
  

});

interface ToolsContextType {
  isDate: (dateString: any) => boolean;
  calcurateAge:(birthDate:any) => string;
  NumberToThaiWords: (number: number) => string;
  toFloat: (amount: any) => string;
  toTHB: (amount: any) => string;
  toDate: (isoDateString: any, option?: number) => string;
  parseExcelToObject: (file: File) => Promise<any[]>;
  paymentCalculator:(
    amount,
    remaining,
    interest_rate,
    total_installment,
    installment_date,
    payment_date,
    pay,
    interest_stack ,
    installment,
    pay_days ,
    delay_days ,
    delay_charge ,
  )=> any;
  Download_Report: (
    title: string,
    fields: any[],
    data: any[]
  ) => Promise<void>;
  randomNumber:(length:number) => string;
}
export const ToolsContext = createContext<ToolsContextType | undefined>(
  undefined
);
