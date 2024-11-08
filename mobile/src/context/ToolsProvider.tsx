import { ToolsContext } from "./Context";
import * as xlsx from "xlsx";

function ToolsProvider({ children }: { children: React.ReactNode }) {
  function getDaysInYear(year) {
    return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
  }
  const __export = {
    isDate: (dateString: any) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    },
    toFloat: (amount: any) => {
      if (isNaN(amount)) return "฿0.00";
      return Number(amount).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
      });
    },
    toTHB: (amount: any) => {
      if (isNaN(amount)) return "฿0.00";
      return Number(amount).toLocaleString("th-TH", {
        style: "currency",
        currency: "THB",
      });
    },
    toDate: (isoDateString: any, option: number = 0) => {
      if (!isoDateString) return "N/A";

      const dateObject = new Date(isoDateString);
      if (isNaN(dateObject.getTime())) return "N/A";

      const options: any = {
        day: option === 9 ? undefined : "2-digit",
        month: "short",
        year: option === 9 ? undefined : "numeric",
        hour: option === 0 ? "2-digit" : undefined,
        minute: option === 0 ? "2-digit" : undefined,
        timeZone: "UTC",
      };

      const formatter = new Intl.DateTimeFormat("th-TH", options);
      return formatter.format(dateObject);
    },
    calculateTimeLeft(expirationDate: number) {
      const now = new Date().getTime();
      const difference = expirationDate - now;

      let timeLeft = {};
      if (difference > 0) {
        timeLeft = {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeft = { hours: 0, minutes: 0, seconds: 0 };
      }

      return timeLeft;
    },
    calcurateAge: (birthDate: string) => {
      // แปลงวันเกิดเป็นวินาที
      const birthTimestamp = new Date(birthDate).getTime();

      // แปลง timestamp ปัจจุบัน
      const currentTimestamp = Date.now();

      // หาความแตกต่างของ timestamp ปัจจุบันและ timestamp วันเกิด (ในหน่วยมิลลิวินาที)
      const differenceInMilliseconds = currentTimestamp - birthTimestamp;

      // แปลงจำนวนมิลลิวินาทีเป็นปี
      const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
      const age = Math.floor(differenceInMilliseconds / millisecondsPerYear);
      if (isNaN(age)) return 0;
      return age;
    },
    NumberToThaiWords: (number: number) => {
      const words = [
        "",
        "หนึ่ง",
        "สอง",
        "สาม",
        "สี่",
        "ห้า",
        "หก",
        "เจ็ด",
        "แปด",
        "เก้า",
      ];
      const positions = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

      const integerPart = Math.floor(number);
      const decimalPart = Math.round((number - integerPart) * 100);

      const integerArray = [...integerPart.toString()].reverse();
      let integerResult = "";

      // ส่วนเติมที่เป็นจำนวนเต็ม
      for (let i = 0; i < integerArray.length; i++) {
        const digit = parseInt(integerArray[i]);
        if (digit !== 0) {
          if (digit === 2 && i === 1)
            integerResult = "ยี่" + positions[i] + integerResult;
          else integerResult = words[digit] + positions[i] + integerResult;
        }
      }

      let decimalResult = "";
      // ส่วนทศนิยม
      if (decimalPart > 0) {
        const decimalArray = [...decimalPart.toString()];
        for (let i = 0; i < decimalArray.length; i++) {
          const digit = parseInt(decimalArray[i]);
          decimalResult += words[digit];
        }
        decimalResult = "จุด" + decimalResult;
      }

      let result = integerResult + "บาท";
      if (integerResult === "") result = "";
      if (decimalResult !== "") {
        result += decimalResult;
      }
      return result;
    },
    paymentCalculator: (
      amount,
      remaining,
      interest_rate,
      total_installment,
      installment_date,
      payment_date,
      pay = 0,
      interest_stack = 0,
      installment = 1,
      pay_days = 30,
      delay_days = 15,
      delay_charge = 50
    ) => {
      const __rate = Number(interest_rate) / 100 / 12;
      const __diff = Number(amount) * __rate;
      const __pill = Math.pow(1 + __rate, total_installment);
      const __diff2 = __diff * __pill;
      const __pill2 = __pill - 1;
      const __installment_per_month = __diff2 / __pill2;

      let nextDate = new Date(installment_date || Date.now());
      let currentDate = new Date(payment_date || Date.now());
      const year = currentDate.getFullYear();
      const daysInYear = getDaysInYear(year);

      const timeDifference = currentDate.getTime() - nextDate.getTime();
      nextDate = currentDate;
      const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      let __interest =
        (Number(remaining) * (Number(interest_rate) / 100) * daysPassed) /
        daysInYear;
      if (__interest <= 0) __interest = 0;
      let __principle =
        __installment_per_month - __interest <= 0
          ? 0
          : __installment_per_month - __interest;
      if (Number(total_installment) <= Number(installment))
        __principle = Number(remaining);
      else if (__principle > Number(remaining)) __principle = Number(remaining);

      let __delay_times = Math.floor(
        (daysPassed - Number(pay_days)) / Number(delay_days)
      );
      __delay_times = __delay_times < 0 ? 0 : __delay_times;
      let __delay_charge = __delay_times * Number(delay_charge);
      let __delay_days = daysPassed - Number(pay_days);
      const __max =
        __principle + __interest + Number(interest_stack) + __delay_charge;
      const __min = __interest;
      const __nor = __max > Number(remaining) ? __max : __installment_per_month;
      const __close = Number(remaining) + __interest + Number(interest_stack);
      let __paid = 0;
      let __interest_stack = Number(interest_stack);
      let __paid_interest = 0;
      const _r = __max - Number(pay) <= 0 ? 0 : __max - Number(pay);
      if (_r === 0)
        __paid = Number(pay) - (__interest + Number(interest_stack));
      else if (_r > 0) {
        if (_r > __principle) {
          __interest_stack = _r - __principle;
          __paid_interest = Number(pay);
        } else {
          __paid = __principle - _r;
          __paid_interest = __interest + Number(interest_stack);
          __interest_stack = 0;
        }
      }

      let __remaining = Number(remaining) - __paid;

      return {
        days: daysPassed,
        daysInYear: daysInYear,
        principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
        interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
        max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
        mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
        nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
        close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
        installment: installment,
        total_installment: total_installment,
        paid_interest:
          Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
        paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
        principle_remaining:
          Math.round((__remaining + Number.EPSILON) * 100) / 100,
        interest_remaining:
          Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
        delay_charge: __delay_charge,
        delay_times: __delay_times,
        delay_days: __delay_days,
      };
    },
    parseExcelToObject: async (file: File): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (!event.target) {
            reject("Failed to read file");
            return;
          }

          const data = event.target.result;
          const workbook = xlsx.read(data, {
            type: "binary",
            cellText: false,
            cellDates: true,
          });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = xlsx.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
            dateNF: "yyyy-mm-dd",
          });

          if (jsonData.length < 2) {
            reject("No data found in the Excel file");
            return;
          }

          const headers: string[] = jsonData[0] as string[];
          const parsedData = jsonData.slice(1).map((row: any) => {
            const rowData: any = {};
            headers.forEach((header: string, index: number) => {
              rowData[header] = row[index];
            });
            return rowData;
          });

          resolve(parsedData);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsBinaryString(file);
      });
    },
    Download_Report: async (title: string, fields: any[], data: any[]) => {
      const dataList = [fields, ...data];
      const fileName = `${title}.xlsx`;
      const ws = xlsx.utils.json_to_sheet(dataList, { skipHeader: true });

      const wb = xlsx.utils.book_new();

      // คำนวณความกว้างของคอลัมน์อัตโนมัติ
      const maxLengths = dataList[0].map((_, colIndex) =>
        Math.max(
          ...dataList.map((row) => row[colIndex]?.toString().length || 0)
        )
      );
      const columnWidths = maxLengths.map((length) => ({ wch: length + 2 })); // เพิ่มความกว้างเผื่อเล็กน้อย

      ws["!cols"] = columnWidths;

      xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
      xlsx.writeFile(wb, fileName);
    },
  };

  return (
    <ToolsContext.Provider value={__export}>{children}</ToolsContext.Provider>
  );
}

export default ToolsProvider;
