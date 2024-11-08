import { createContext, useContext } from "react";

export interface AuthType {
  status: boolean;
  mobile: any;
  remember: boolean;
  employee_id: string;
  fullname: string;
  username: string;
  sidebars: any[];
  user_role: string;
  sv: string;
}

interface ImageType {
  preview: string;
  data: File | null;
  name: string;
}

export interface RouteType {
  id: number;
  name: string;
  name_th: string;
  path: string;
  link: string;
  type: string;
  index: number;
  icon: string;
  component: string;
  details: string;
}

export interface ContextValueType {
  ThemePrimary: string;
  setThemePrimary: React.Dispatch<React.SetStateAction<string>>;
  auth: any;
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
  setRoute: React.Dispatch<React.SetStateAction<any[]>>;
  AddAlert: (msg: string, variant?: string) => void;
  lang: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  useLang: (a: string, b?: string) => string;
  privacy: { version: string; message: string };
  setPrivacy: React.Dispatch<React.SetStateAction<any>>;
}

export const MainContext = createContext<ContextValueType>({
  // ThemePrimary: "#1976d2",
  ThemePrimary: "#071251",
  setThemePrimary: () => {},
  auth: {},
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
  lang: "th",
  setLanguage: () => {},
  useLang(a, b) {
    return a;
  },
  privacy: {
    version: "0.0",
    message: "",
  },
  setPrivacy: () => {},
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
  MessageResponse: (response: any) => response?.data.system_response.message,
});

interface ToolsContextType {
  isDate: (dateString: any) => boolean;
  toFloat: (amount: any) => string;
  toTHB: (amount: any) => string;
  toDate: (isoDateString: any, option?: number) => string;
  parseExcelToObject: (file: File) => Promise<any[]>;
  Download_Report: (title: string, fields: any[], data: any[]) => Promise<void>;
  calcurateAge: (birthDate: string) => number;
  NumberToThaiWords: (number: number) => string;
  calculateTimeLeft: (expirationDate: number) => object;
  paymentCalculator: (
    amount: number | string,
    remaining: number | string,
    interest_rate: number | string,
    total_installment: number | string,
    installment_date: string,
    payment_date: string,
    pay: number | undefined,
    interest_stack: number | undefined,
    installment: number | undefined,
    pay_days: number | undefined,
    delay_days: number | undefined,
    delay_charge: number | undefined
  ) => object;
}
export const ToolsContext = createContext<ToolsContextType | undefined>(
  undefined
);
