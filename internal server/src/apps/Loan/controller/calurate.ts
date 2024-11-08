import { pillComponent } from "../../../components/payment";
import { orm } from "../../../data-source";
import { Installment } from "../entities/loan_installment";

export function getDaysInYear(year) {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}
// วิธีการเรียกใช้
// const test = paymentCalculator(50000,50000,36,24,'2024-09-22','2024-09-23');
// console.log(test)
// paymentCalculator(จำนวนยอดกู้,ยอดกู้คงเหลือ,อัตราดอกเบี้ย (%),จำนวนงวดรวม,วันเริ่มนับชำระ,วันชำระจริง);
// export const paymentCalculator = ({
//   amount,
//   remaining,
//   interest_rate,
//   total_installment,
//   installment_start,
//   installment_due = null,
//   payment_date,
//   pay = 0,
//   interest_stack = 0,
//   installment = 1,
//   pay_days = 30,
//   delay_days = 15,
//   delay_charge = 50,
// }) => {
//   const __rate = Number(interest_rate) / 100 / 12;
//   const __diff = Number(amount) * __rate;
//   const __pill = Math.pow(1 + __rate, total_installment);
//   const __diff2 = __diff * __pill;
//   const __pill2 = __pill - 1;
//   const __installment_per_month = __diff2 / __pill2;

//   let startDate = new Date(installment_start || Date.now());
//   let currentDate = new Date(payment_date || Date.now());
//   let dueDate = installment_due ? new Date(installment_due) : currentDate;

//   const year = currentDate.getFullYear();
//   const daysInYear = getDaysInYear(year);

//   const timeDifference = currentDate.getTime() - startDate.getTime();
//   const dueDifference = dueDate.getTime() - startDate.getTime();
//   // nextDate = currentDate;
//   const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//   const daysDue = Math.floor(dueDifference / (1000 * 60 * 60 * 24));
//   let __delay_times = Math.floor(
//     (daysPassed - Number(pay_days)) / Number(delay_days)
//   );
//   __delay_times = __delay_times < 0 ? 0 : __delay_times;

//   let __delay_charge = __delay_times * Number(delay_charge);
//   let __delay_days = daysPassed - Number(pay_days);
//   let __interest =
//     (Number(remaining) * (Number(interest_rate) / 100) * daysPassed) /
//     daysInYear;

//   let __interest_due =
//     (Number(remaining) * (Number(interest_rate) / 100) * daysDue) / daysInYear;
//   if (__interest <= 0) __interest = 0;
//   let __principle =
//     __installment_per_month - (__interest + __delay_charge) <= 0
//       ? 0
//       : __installment_per_month - (__interest + __delay_charge);
//   if (Number(total_installment) <= Number(installment))
//     __principle = Number(remaining);
//   else if (__principle > Number(remaining)) __principle = Number(remaining);

//   const __max =
//     __principle + __interest + Number(interest_stack) + __delay_charge;
//   const __min = __interest;
//   const __nor = __max > Number(remaining) ? __max : __installment_per_month;
//   const __close = Number(remaining) + __interest + Number(interest_stack);
//   let __paid = 0;
//   let __interest_stack = Number(interest_stack);
//   let __paid_interest = 0;
//   const _r = __max - Number(pay) <= 0 ? 0 : __max - Number(pay);

//   if (_r === 0) {
//     __paid = Number(pay) - (__interest + Number(interest_stack));
//     __paid_interest = __interest + Number(interest_stack) - __delay_charge;
//     __interest_stack = 0;
//   } else if (_r > 0) {
//     if (_r > __principle) {
//       __interest_stack = _r - __principle;
//       __paid_interest = Number(pay) - __delay_charge;
//     } else {
//       __paid = __principle - _r;
//       __paid_interest = __interest + Number(interest_stack) - __delay_charge;
//       __interest_stack = 0;
//     }
//   }

//   let __remaining = Number(remaining) - __paid;

//   return {
//     days: daysPassed,
//     daysInYear: daysInYear,
//     principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
//     interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
//     interest_due: Math.round((__interest_due + Number.EPSILON) * 100) / 100,
//     max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
//     mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
//     nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
//     close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
//     installment: installment,
//     total_installment: total_installment,
//     paid_interest: Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
//     paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
//     principle_remaining: Math.round((__remaining + Number.EPSILON) * 100) / 100,
//     interest_remaining:
//       Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
//     delay_charge: __delay_charge,
//     delay_times: __delay_times,
//     delay_days: __delay_days,
//   };
// };

export const ApiCalcurator = async (req, res) => {
  const {
    amount,
    remaining,
    interest_rate,
    total_installment,
    installment_date,
    payment_date,
    pay,
    interest_stack,
    installment,
    type_interest = "effectiverate",
    pay_days,
    delay_value,
    delay_charge,
  } = req.body;


  const _calurate = type_interest === 'effectiverate' ? effectiverateCalculator({
    amount,
    remaining,
    interest_rate,
    total_installment,
    installment_start: installment_date,
    payment_date,
    pay,
    interest_stack,
    installment,
    pay_days: pay_days,
    delay_days: delay_value,
    delay_charge: delay_charge,
  }) : flatrateCalculator({
    amount,
    remaining,
    interest_rate,
    total_installment,
    installment_start: installment_date,
    payment_date,
    pay,
    interest_stack,
    installment,
    pay_days: pay_days,
    delay_days: delay_value,
    delay_charge: delay_charge,
  });
  return res.success("Success", _calurate);
};

// export const calcurator = async (req, res) => {
//   const { amount, rate, installment, start, created } = req.body;
//   const { t } = req.query;

//   const __rate = Number(rate) / 100 / 12;
//   const __diff =  Number(amount) * __rate;
//   const __pill =  Math.pow(1 + __rate, installment);
//   const __diff2 = __diff * __pill;
//   const __pill2 = __pill - 1;
//   const __installment_per_month =  __diff2 / __pill2;
//   let __totalInstallment = __installment_per_month * installment;

//   let totalAmount = Number(amount);
//   let nextDate = new Date(created || Date.now());
//   let __array = Array.from({ length: Number(installment) }).map((_, i) => {
//     let currentDate = new Date(start || Date.now());
//     currentDate.setMonth(currentDate.getMonth() + i);

//     const timeDifference = currentDate.getTime() - nextDate.getTime();
//     nextDate = currentDate;
//     const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//     const year = currentDate.getFullYear();
//     const daysInYear = getDaysInYear(year);

//     const __interest =
//       (totalAmount * (Number(rate) / 100) * daysPassed) / daysInYear;

//     let __principle =
//       __installment_per_month - __interest <= 0
//         ? 0
//         : __installment_per_month - __interest;
//     if (i === Number(installment) - 1) {
//       __principle = totalAmount;
//     } else if (__principle > totalAmount) __principle = totalAmount;
//     else if (totalAmount === 0)
//       return {
//         date: currentDate,
//         amount: 0,
//         interest: 0,
//         principle: 0,
//         remaining: 0,
//         receive: totalAmount,
//         days: 0,
//       };
//     totalAmount = totalAmount - __principle;
//     const __receive = Number(amount) - totalAmount;
//     const __amount = __principle + __interest;

//     return {
//       date: currentDate,
//       amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
//       interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
//       principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
//       remaining: Math.round((totalAmount + Number.EPSILON) * 100) / 100,
//       receive: Math.round((__receive + Number.EPSILON) * 100) / 100,
//       days: daysPassed,
//     };
//   });
//   if (t && !isNaN(t)) __array = __array.splice(t);
//   const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
//   __totalInstallment = __array.reduce((a, b) => a + b.principle + b.interest, 0);
//   return res.success("คำนวนสำเร็จ", {
//     amount: Math.round((amount + Number.EPSILON) * 100) / 100,
//     interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
//     total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
//     pay_per_month:
//       Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
//     total_receive:
//       Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
//     total_interest:
//       Math.round((interestRemaining + Number.EPSILON) * 100) /
//       100,
//     installment: __array,
//   });
// };

// export const remainingCalcurate = ({ amount, rate, installment, start, created,given_at }) => {

//   const __rate = Number(rate) / 100 / 12;
//   const __diff =  Number(amount) * __rate;
//   const __pill =  Math.pow(1 + __rate, installment);
//   const __diff2 = __diff * __pill;
//   const __pill2 = __pill - 1;
//   const __installment_per_month =  __diff2 / __pill2;
//   let __totalInstallment = __installment_per_month * installment;

//   let totalAmount = Number(amount);
//   let nextDate = new Date(created || Date.now());
//   let __array = Array.from({ length: Number(installment) }).map((_, i) => {
//     let currentDate = new Date(start || Date.now());
//     currentDate.setMonth(currentDate.getMonth() + i);

//     const timeDifference = currentDate.getTime() - nextDate.getTime();
//     nextDate = currentDate;
//     const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//     const year = currentDate.getFullYear();
//     const daysInYear = getDaysInYear(year);

//     const __interest =
//       (totalAmount * (Number(rate) / 100) * daysPassed) / daysInYear;

//     let __principle =
//       __installment_per_month - __interest <= 0
//         ? 0
//         : __installment_per_month - __interest;
//     if (i === Number(installment) - 1) {
//       __principle = totalAmount;
//     } else if (__principle > totalAmount) __principle = totalAmount;
//     else if (totalAmount === 0)
//       return {
//         date: currentDate,
//         amount: 0,
//         interest: 0,
//         principle: 0,
//         remaining: 0,
//         receive: totalAmount,
//         days: 0,
//       };
//     totalAmount = totalAmount - __principle;
//     const __receive = Number(amount) - totalAmount;
//     const __amount = __principle + __interest;

//     return {
//       date: currentDate,
//       amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
//       interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
//       principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
//       remaining: Math.round((totalAmount + Number.EPSILON) * 100) / 100,
//       receive: Math.round((__receive + Number.EPSILON) * 100) / 100,
//       days: daysPassed,
//     };
//   });
//   if (given_at && !isNaN(given_at)) __array = __array.splice(given_at);
//   const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
//   __totalInstallment = __array.reduce((a, b) => a + b.principle + b.interest, 0);
//   return {
//     amount: Math.round((amount + Number.EPSILON) * 100) / 100,
//     interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
//     total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
//     pay_per_month:
//       Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
//     total_receive:
//       Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
//     total_interest:
//       Math.round((interestRemaining + Number.EPSILON) * 100) /
//       100,
//     installment: __array,
//   }
// };

function getDaysInYears(year) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 === 0 ? 366 : 365;
}

export const paymentCalculator = ({
  type_interest = "effectiverate",
  amount,
  remaining,
  interest_rate,
  total_installment,
  installment_start,
  installment_due = null,
  payment_date,
  pay = 0,
  interest_stack = 0,
  installment = 1,
  pay_days = 30,
  delay_days = 15,
  delay_charge = 50,
}) => {
  const __amount = Number(amount);
  let _remaining = Number(remaining);
  const __rate = Number(interest_rate) / 100 / 12;
  let __installment_per_month = 0;
  let __interest = 0;
  let __principle = 0;
  let __interest_due = 0;
  let total_principle = 0;

  if (type_interest === "flatrate") {
    // คำนวณดอกเบี้ยคงที่ (Flat Rate)
    const totalInterest =
      __amount * (Number(interest_rate) / 100) * (total_installment / 12);
    const totalAmount = __amount;
    __interest = totalInterest / total_installment;
    if (Number(installment) < Number(total_installment)) {
      __principle = totalAmount / total_installment;
    }
    __installment_per_month = Math.round((((totalAmount + totalInterest) / total_installment) + Number.EPSILON) * 100) /
      100;

    if (Number(pay) > 0 && Number(pay) < __interest) {
      __interest = Number(pay);  // หักดอกเบี้ยเท่าที่จ่ายจริง
    }

    // คำนวณเงินต้นคงเหลือ
    const monthlyPrinciple = Math.round(((totalAmount / total_installment) + Number.EPSILON) * 100) / 100;
    const installmentPaid = installment - 1;
    const totalPrinciplePaid = installmentPaid * monthlyPrinciple;
    total_principle = Math.round(((totalAmount - totalPrinciplePaid) + Number.EPSILON) * 100) / 100;

    // งวดสุดท้าย
    if (
      installment === total_installment ||
      __installment_per_month > _remaining
    )
      __installment_per_month =
        Math.round((_remaining + Number.EPSILON) * 100) /
        100;
    // if(__installment_per_month >= _remaining) __interest = __interest*(Number(total_installment)-(Number(installment)-1))
    __principle = __installment_per_month - __interest;
  } else {
    __installment_per_month = pillComponent(
      __amount,
      __rate,
      total_installment
    );
  }

  let startDate = new Date(
    installment_start || new Date().toISOString().split("T")[0]
  );
  let currentDate = new Date(
    new Date(payment_date).toISOString().split("T")[0] || new Date().toISOString().split("T")[0]
  );
  let dueDate = installment_due ? new Date(installment_due) : currentDate;

  // ใช้ UTC เพื่อตัดเวลาออก
  // const timeDifference = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())
  //                      - Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  // const dueDifference = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate())
  //                     - Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());

  const timeDifference = currentDate.getTime() - startDate.getTime();
  const dueDifference = dueDate.getTime() - startDate.getTime();

  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const daysDue = Math.floor(dueDifference / (1000 * 60 * 60 * 24));

  const year = currentDate.getFullYear();
  const daysInYear = getDaysInYear(year);

  // คำนวณค่าปรับล่าช้า
  let __delay_times = Math.floor(
    (daysPassed - Number(pay_days)) / Number(delay_days)
  );
  __delay_times = __delay_times < 0 ? 0 : __delay_times;

  let __delay_charge = __delay_times * Number(delay_charge);
  let __delay_days = daysPassed - Number(pay_days);

  if (type_interest === "effectiverate") {
    // คำนวณดอกเบี้ยลดต้นลดดอก (Effective Rate)
    const __dailyInterestRate = Number(interest_rate) / 100 / daysInYear;
    __interest = Number(remaining) * __dailyInterestRate * daysPassed;
    __interest_due = Number(remaining) * __dailyInterestRate * daysDue;
    if (__interest <= 0) __interest = 0;
    __principle = __installment_per_month - __interest - __delay_charge;
    if (__principle <= 0) __principle = 0;
    if (
      Number(total_installment) <= Number(installment) ||
      __principle > Number(remaining)
    ) {
      __principle = Number(remaining);
    }
  }

  const __max =
    __principle + __interest + Number(interest_stack) + __delay_charge;
  const __min = __interest;
  let __nor = Math.min(__max, __installment_per_month);
  let __close = _remaining + __interest + Number(interest_stack);

  if (type_interest === "flatrate" && _remaining <= __installment_per_month) {
    __close = _remaining + Number(interest_stack);
  }

  if (
    Number(total_installment) <= Number(installment) ||
    __principle > Number(remaining)
  ) {
    __nor = __close
  }

  let __paid = 0;
  let __interest_stack = Number(interest_stack);
  let __paid_interest = 0;
  const _r = Math.max(0, __max - Number(pay));

  if (_r === 0) {
    __paid = Number(pay) - (__interest + Number(interest_stack));
    __paid_interest = __interest + Number(interest_stack) - __delay_charge;
    __interest_stack = 0;
  } else if (_r > 0) {
    if (_r > __principle) {
      __interest_stack = _r - __principle;
      __paid_interest = Number(pay) - __delay_charge;
    } else {
      __paid = __principle - _r;
      __paid_interest = __interest + Number(interest_stack) - __delay_charge;
      __interest_stack = 0;
    }
  }

  let __remaining = _remaining - __paid;
  if (type_interest === "flatrate" && Number(pay) > 0) {
    __remaining = _remaining - (__paid + __interest)
    total_principle = total_principle - __paid;
  }

  // ปัดเศษผลลัพธ์สุดท้ายก่อนส่งคืน
  return {
    days: daysPassed,
    daysInYear: daysInYear,
    principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
    interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
    interest_due: Math.round((__interest_due + Number.EPSILON) * 100) / 100,
    max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
    mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
    nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
    close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
    installment: installment,
    total_installment: total_installment,
    paid_interest: Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
    paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
    total_principle: Math.round((total_principle + Number.EPSILON) * 100) / 100,
    principle_remaining: Math.round((__remaining + Number.EPSILON) * 100) / 100,
    interest_remaining:
      Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
    delay_charge: Math.round((__delay_charge + Number.EPSILON) * 100) / 100,
    delay_times: __delay_times,
    delay_days: __delay_days,
  };
};


export const calcurator = async (req, res) => {
  const {
    amount,
    rate,
    installment,
    start,
    created,
    type_interest,
    given_at,
    paid,
  } = req.body;
  const { t, loan_id } = req.query;

  const __rate = Number(rate) / 100 / 12;
  const __amount = Number(amount);

  if (loan_id) {
    const result = type_interest === 'effectiverate' ? await effevtiverateInstallment({
      loan_id: loan_id,
      amount: __amount,
      rate: Number(rate),
      installment: installment,
      start: start,
      created: created,
      given_at: Number(given_at),
      lastPaid: paid,
    }) : await flatrateInstallment({
      loan_id: loan_id,
      amount: __amount,
      rate: Number(rate),
      installment: installment,
      start: start,
      created: created,
      given_at: Number(given_at),
      lastPaid: paid,
    });
    return res.success("คำนวณสำเร็จ", result);
  }

  let __installment_per_month;
  let __array;

  if (type_interest == "flatrate") {
    // คำนวณดอกเบี้ยแบบคงที่ (Flat Rate)
    const totalInterest = __amount * (Number(rate) / 100) * (installment / 12);
    const totalAmount = __amount + totalInterest;
    __installment_per_month =
      Math.round((totalAmount / installment + Number.EPSILON) * 100) / 100;

    let remainingAmount = totalAmount;
    let nextDate = new Date(created || Date.now());

    __array = Array.from({ length: Number(installment) }).map((_, i) => {
      let currentDate = new Date(start || Date.now());
      currentDate.setMonth(currentDate.getMonth() + i);

      // const timeDifference =
      //   Date.UTC(
      //     currentDate.getUTCFullYear(),
      //     currentDate.getUTCMonth(),
      //     currentDate.getUTCDate()
      //   ) -
      //   Date.UTC(
      //     nextDate.getUTCFullYear(),
      //     nextDate.getUTCMonth(),
      //     nextDate.getUTCDate()
      //   );

      const timeDifference = currentDate.getTime() - nextDate.getTime();

      nextDate = currentDate;
      const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      let __principle, __interest, __amount_per_month;

      if (i === Number(installment) - 1) {
        // งวดสุดท้าย
        __amount_per_month =
          Math.round((remainingAmount + Number.EPSILON) * 100) / 100;
        __interest =
          Math.round((totalInterest / installment + Number.EPSILON) * 100) /
          100;
        __principle =
          Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
          100;
      } else {
        __amount_per_month = __installment_per_month;
        __interest =
          Math.round((totalInterest / installment + Number.EPSILON) * 100) /
          100;
        __principle =
          Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
          100;
      }

      remainingAmount =
        Math.round(
          (remainingAmount - __amount_per_month + Number.EPSILON) * 100
        ) / 100;

      return {
        date: currentDate,
        amount: __amount_per_month,
        interest: __interest,
        principle: __principle,
        remaining: Math.max(0, remainingAmount),
        receive:
          Math.round((totalAmount - remainingAmount + Number.EPSILON) * 100) /
          100,
        days: daysPassed,
      };
    });
  } else {
    // คำนวณดอกเบี้ยแบบลดต้นลดดอก (Effective Rate)
    __installment_per_month = pillComponent(__amount, __rate, installment);

    let totalAmount = __amount;
    let nextDate = new Date(created || Date.now());

    __array = Array.from({ length: Number(installment) }).map((_, i) => {
      let currentDate = new Date(start || Date.now());
      currentDate.setMonth(currentDate.getMonth() + i);

      const timeDifference = currentDate.getTime() - nextDate.getTime();
      nextDate = currentDate;
      const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      const year = currentDate.getFullYear();
      const daysInYear = getDaysInYear(year);

      const __dailyInterestRate = Number(rate) / 100 / daysInYear;
      const __interest =
        Math.round(
          (totalAmount * __dailyInterestRate * daysPassed + Number.EPSILON) *
          100
        ) / 100;

      let __principle, __amount_per_month;

      if (i === Number(installment) - 1) {
        __principle = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
        __amount_per_month =
          Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
      } else {
        __principle =
          Math.round(
            (__installment_per_month - __interest + Number.EPSILON) * 100
          ) / 100;
        __amount_per_month = __installment_per_month;
      }

      if (__principle > totalAmount) __principle = totalAmount;
      totalAmount =
        Math.round((totalAmount - __principle + Number.EPSILON) * 100) / 100;
      const __receive =
        Math.round((__amount - totalAmount + Number.EPSILON) * 100) / 100;

      return {
        date: currentDate,
        amount: __amount_per_month,
        interest: __interest,
        principle: __principle,
        remaining: Math.max(0, totalAmount),
        receive: __receive,
        days: daysPassed,
      };
    });
  }

  if (t && !isNaN(t)) __array = __array.splice(t);
  const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
  const principalRemaining = __array.reduce((a, b) => a + b.principle, 0);
  const __totalInstallment =
    Math.round(
      (principalRemaining + interestRemaining + Number.EPSILON) * 100
    ) / 100;

  return res.success("คำนวณสำเร็จ", {
    amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
    interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
    total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
    pay_per_month: __installment_per_month,
    total_receive: __totalInstallment,
    total_interest:
      Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
    installment: __array,
    interest_type: type_interest || "effectiverate",
  });
};

// export const remainingCalcurate = ({
//   amount,
//   rate,
//   installment,
//   start,
//   created,
//   given_at,
//   type_interest = "effectiverate",
// }) => {
//   const __rate = Number(rate) / 100 / 12;
//   const __amount = Number(amount);

//   let __installment_per_month;
//   let __array;

//   if (type_interest === "flatrate") {
//     // คำนวณดอกเบี้ยแบบคงที่ (Flat Rate)
//     const totalInterest = __amount * (Number(rate) / 100) * (installment / 12);
//     const totalAmount = __amount + totalInterest;
//     __installment_per_month =
//       Math.round((totalAmount / installment + Number.EPSILON) * 100) / 100;

//     let remainingAmount = totalAmount;

//     __array = Array.from({ length: Number(installment) }).map((_, i) => {
//       let currentDate = new Date(start || Date.now());
//       currentDate.setMonth(currentDate.getMonth() + i);

//       let __principle, __interest, __amount_per_month;

//       if (i === Number(installment) - 1) {
//         // งวดสุดท้าย
//         __amount_per_month =
//           Math.round((remainingAmount + Number.EPSILON) * 100) / 100;
//         __interest =
//           Math.round((totalInterest / installment + Number.EPSILON) * 100) /
//           100;
//         __principle =
//           Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
//           100;
//       } else {
//         __amount_per_month = __installment_per_month;
//         __interest =
//           Math.round((totalInterest / installment + Number.EPSILON) * 100) /
//           100;
//         __principle =
//           Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
//           100;
//       }

//       remainingAmount =
//         Math.round(
//           (remainingAmount - __amount_per_month + Number.EPSILON) * 100
//         ) / 100;

//       return {
//         date: currentDate,
//         amount: __amount_per_month,
//         interest: __interest,
//         principle: __principle,
//         remaining: Math.max(0, remainingAmount),
//         receive:
//           Math.round((totalAmount - remainingAmount + Number.EPSILON) * 100) /
//           100,
//         days: 30,
//       };
//     });
//   } else {
//     // คำนวณดอกเบี้ยแบบลดต้นลดดอก (Effective Rate)
//     const __diff = __amount * __rate;
//     const __pill = Math.pow(1 + __rate, installment);
//     const __diff2 = __diff * __pill;
//     const __pill2 = __pill - 1;
//     __installment_per_month =
//       Math.round((__diff2 / __pill2 + Number.EPSILON) * 100) / 100;

//     let totalAmount = __amount;
//     let nextDate = new Date(created || Date.now());

//     __array = Array.from({ length: Number(installment) }).map((_, i) => {
//       let currentDate = new Date(start || Date.now());
//       currentDate.setMonth(currentDate.getMonth() + i);

//       const timeDifference =
//         Date.UTC(
//           currentDate.getUTCFullYear(),
//           currentDate.getUTCMonth(),
//           currentDate.getUTCDate()
//         ) -
//         Date.UTC(
//           nextDate.getUTCFullYear(),
//           nextDate.getUTCMonth(),
//           nextDate.getUTCDate()
//         );
//       nextDate = currentDate;
//       const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//       const year = currentDate.getFullYear();
//       const daysInYear = getDaysInYears(year);

//       const __dailyInterestRate = Number(rate) / 100 / daysInYear;
//       const __interest =
//         Math.round(
//           (totalAmount * __dailyInterestRate * daysPassed + Number.EPSILON) *
//           100
//         ) / 100;

//       let __principle, __amount_per_month;

//       if (i === Number(installment) - 1) {
//         __principle = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
//         __amount_per_month =
//           Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
//       } else {
//         __principle =
//           Math.round(
//             (__installment_per_month - __interest + Number.EPSILON) * 100
//           ) / 100;
//         __amount_per_month = __installment_per_month;
//       }

//       if (__principle > totalAmount) __principle = totalAmount;
//       totalAmount =
//         Math.round((totalAmount - __principle + Number.EPSILON) * 100) / 100;
//       const __receive =
//         Math.round((__amount - totalAmount + Number.EPSILON) * 100) / 100;

//       return {
//         date: currentDate,
//         amount: __amount_per_month,
//         interest: __interest,
//         principle: __principle,
//         remaining: Math.max(0, totalAmount),
//         receive: __receive,
//         days: daysPassed,
//       };
//     });
//   }

//   if (given_at && !isNaN(given_at)) __array = __array.splice(given_at);
//   const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
//   const principalRemaining = __array.reduce((a, b) => a + b.principle, 0);
//   const __totalInstallment =
//     Math.round(
//       (principalRemaining + interestRemaining + Number.EPSILON) * 100
//     ) / 100;

//   return {
//     amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
//     interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
//     total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
//     pay_per_month: __installment_per_month,
//     total_receive: __totalInstallment,
//     total_interest:
//       Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
//     installment: __array,
//   };
// };

export const installmentRemaining = async ({
  loan_id = -1,
  amount,
  rate,
  installment,
  start,
  created,
  given_at,
  lastPaid = 0,
  paidDate = null,
  type_interest = "effectiverate",
}) => {
  const __rate = Number(rate) / 100 / 12;
  const __amount = Number(amount);
  let _installment = await orm(Installment).find({
    where: { isPaid: true, loan_id: loan_id },
    order: { created_at: "ASC" },
  });

  let __installment_per_month, __array;
  if (type_interest == "flatrate") {
    // คำนวณดอกเบี้ยแบบคงที่ (Flat Rate)
    const totalInterest = __amount * (Number(rate) / 100) * (installment / 12);
    const totalAmount = __amount + totalInterest;
    __installment_per_month =
      Math.round((totalAmount / installment + Number.EPSILON) * 100) / 100;

    let remainingAmount = totalAmount;
    let nextDate = new Date(
      new Date(created).toISOString().split("T")[0] ||
      new Date().toISOString().split("T")[0]
    );

    __array = Array.from({ length: Number(installment) }).map((_, i) => {
      let currentDate = new Date(
        start.split("T")[0] || new Date().toISOString().split("T")[0]
      );
      currentDate.setMonth(currentDate.getMonth() + i);

      let timeDifference = currentDate.getTime() - nextDate.getTime();
      const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));


      let __principle, __interest, __amount_per_month;
      __interest =
        Math.round((totalInterest / installment + Number.EPSILON) * 100) / 100;
      let pay = __installment_per_month;
      if (i == given_at - 1 && lastPaid > 0) {
        if (lastPaid > 0) pay = Number(lastPaid);
      } else if (_installment[i]) {
        pay = Number(_installment[i].paid);
      }
      // งวดสุดท้าย
      if (
        i === Number(installment) - 1
      ) {
        __amount_per_month =
          Math.round((remainingAmount + Number.EPSILON) * 100) /
          100;
      } else if (pay > remainingAmount) {
        __amount_per_month =
          Math.round((remainingAmount + Number.EPSILON) * 100) /
          100;
        // __interest = __interest + (__interest*(installment-given_at-1))
      }
      else __amount_per_month = pay;

      __principle =
        Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
        100;
      if (__principle < 0) {
        __principle = 0;
        __interest = 0
      }
      remainingAmount =
        Math.round((remainingAmount - __amount_per_month + Number.EPSILON) * 100) /
        100;

      return {
        date: currentDate,
        amount: __amount_per_month,
        interest: __interest,
        principle: __principle,
        remaining: Math.max(0, remainingAmount),
        receive:
          Math.round((totalAmount - remainingAmount + Number.EPSILON) * 100) /
          100,
        days: daysPassed,
      };
    });
  } else {
    __installment_per_month = pillComponent(__amount, __rate, installment);

    let totalAmount = __amount;
    let nextDate = new Date(
      new Date(created).toISOString().split("T")[0] ||
      new Date().toISOString().split("T")[0]
    );

    __array = Array.from({ length: Number(installment) }).map((_, i) => {
      let pay = __installment_per_month;

      let currentDate = new Date(
        start.split("T")[0] || new Date().toISOString().split("T")[0]
      );
      currentDate.setMonth(currentDate.getMonth() + i);

      let timeDifference = currentDate.getTime() - nextDate.getTime();

      if (i == given_at - 1 && lastPaid > 0) {
        if (lastPaid > 0) pay = Number(lastPaid);
        if (paidDate) {
          const pd = new Date(paidDate.split("T")[0]).getTime();
          timeDifference = pd - nextDate.getTime();
        }
      } else if (_installment[i]) {
        pay = Number(_installment[i].paid);
        const pd = new Date(
          new Date(_installment[i].given_at).toISOString().split("T")[0]
        ).getTime();
        timeDifference = pd - nextDate.getTime();
      }
      nextDate = currentDate;
      const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      const year = currentDate.getFullYear();
      const daysInYear = getDaysInYear(year);
      const __dailyInterestRate = Number(rate) / 100 / daysInYear;
      const __interest =
        Math.round(
          (totalAmount * __dailyInterestRate * daysPassed + Number.EPSILON) *
          100
        ) / 100;

      let __principle, __amount_per_month;

      if (i === Number(installment) - 1) {
        __principle = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
        if (__principle <= 0) __principle = 0;
        __amount_per_month =
          Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
      } else {
        __principle =
          Math.round((pay - __interest + Number.EPSILON) * 100) / 100;
        if (__principle <= 0) __principle = 0;
        __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
      }

      if (__principle > totalAmount) {
        __principle = totalAmount;
        __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
        // if (__amount_per_month <= 0) __amount_per_month = 0;
      }
      totalAmount =
        Math.round((totalAmount - __principle + Number.EPSILON) * 100) / 100;
      const __receive =
        Math.round((__amount - totalAmount + Number.EPSILON) * 100) / 100;
      console.log(
        currentDate,
        __amount_per_month,
        totalAmount,
        __receive,
        daysPassed,
        Number(rate) / 100,
        daysInYear,
        __interest
      );

      return {
        date: currentDate,
        amount: __amount_per_month,
        interest: __interest,
        principle: __principle,
        remaining: Math.max(0, totalAmount),
        receive: __receive,
        days: daysPassed,
      };
    });
  }

  if (given_at && !isNaN(given_at)) __array = __array.splice(given_at);
  const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
  const __totalInstallment = __array.reduce(
    (a, b) => a + b.principle + b.interest,
    0
  );
  return {
    amount: Math.round((amount + Number.EPSILON) * 100) / 100,
    interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
    total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
    pay_per_month:
      Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
    total_receive:
      Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
    total_interest:
      Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
    installment: __array,
  };
};


export const effectiverateCalculator = ({
  amount,
  remaining,
  interest_rate,
  total_installment,
  installment_start,
  installment_due = null,
  payment_date,
  pay = 0,
  interest_stack = 0,
  installment = 1,
  pay_days = 30,
  delay_days = 15,
  delay_charge = 50,
}) => {
  const __amount = Number(amount);
  let _remaining = Number(remaining);
  const __rate = Number(interest_rate) / 100 / 12;
  let __installment_per_month = 0;
  let __interest = 0;
  let __principle = 0;
  let __interest_due = 0;
  let total_principle = 0;

  __installment_per_month = pillComponent(
    __amount,
    __rate,
    total_installment
  );

  let startDate = new Date(
    installment_start || new Date().toISOString().split("T")[0]
  );
  let currentDate = new Date(
    new Date(payment_date).toISOString().split("T")[0] || new Date().toISOString().split("T")[0]
  );
  let dueDate = installment_due ? new Date(installment_due) : currentDate;


  const timeDifference = currentDate.getTime() - startDate.getTime();
  const dueDifference = dueDate.getTime() - startDate.getTime();

  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const daysDue = Math.floor(dueDifference / (1000 * 60 * 60 * 24));

  const year = currentDate.getFullYear();
  const daysInYear = getDaysInYear(year);

  // คำนวณค่าปรับล่าช้า
  let __delay_times = Math.floor(
    (daysPassed - Number(pay_days)) / Number(delay_days)
  );
  __delay_times = __delay_times < 0 ? 0 : __delay_times;

  let __delay_charge = __delay_times * Number(delay_charge);
  let __delay_days = daysPassed - Number(pay_days);

  // คำนวณดอกเบี้ยลดต้นลดดอก (Effective Rate)
  const __dailyInterestRate = Number(interest_rate) / 100 / daysInYear;
  __interest = Number(remaining) * __dailyInterestRate * daysPassed;
  __interest_due = Number(remaining) * __dailyInterestRate * daysDue;
  if (__interest <= 0) __interest = 0;
  __principle = __installment_per_month - __interest;
  if (__principle <= 0) __principle = 0;
  if (
    Number(total_installment) <= Number(installment) ||
    __principle > Number(remaining)
  ) {
    __principle = Number(remaining);
  }


  const __max =
    __principle + __interest + Number(interest_stack) + __delay_charge;
  const __min = __interest;
  let __nor = Math.min(__max, __installment_per_month);
  let __close = _remaining + __interest + Number(interest_stack) + __delay_charge;


  if (
    Number(total_installment) <= Number(installment) ||
    __principle > Number(remaining)
  ) {
    __nor = __close
  }

  let __paid = 0;
  let __interest_stack = Number(interest_stack);
  let __paid_interest = 0;
  const _r = Math.max(0, __max - Number(pay));

  if (_r === 0) {
    __paid = Number(pay) - (__interest + Number(interest_stack)) - __delay_charge;
    // __paid_interest = __interest + Number(interest_stack) - __delay_charge;
    __paid_interest = __interest + Number(interest_stack);
    __interest_stack = 0;
  } else if (_r > 0) {
    if (_r > __principle) {
      __interest_stack = _r - __principle;
      __paid_interest = Number(pay);
    } else {
      __paid = __principle - _r;
      __paid_interest = __interest + Number(interest_stack);
      __interest_stack = 0;
    }
  }

  let __remaining = _remaining - __paid;

  // ปัดเศษผลลัพธ์สุดท้ายก่อนส่งคืน
  return {
    days: daysPassed,
    daysInYear: daysInYear,
    principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
    interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
    interest_due: Math.round((__interest_due + Number.EPSILON) * 100) / 100,
    max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
    mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
    nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
    close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
    installment: installment,
    total_installment: total_installment,
    paid_interest: Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
    paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
    total_principle: Math.round((total_principle + Number.EPSILON) * 100) / 100,
    principle_remaining: Math.round((__remaining + Number.EPSILON) * 100) / 100,
    interest_remaining:
      Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
    delay_charge: Math.round((__delay_charge + Number.EPSILON) * 100) / 100,
    delay_times: __delay_times,
    delay_days: __delay_days,
  };
};


export const effevtiverateInstallment = async ({
  loan_id = -1,
  amount,
  rate,
  installment,
  start,
  created,
  given_at,
  lastPaid = 0,
  delay_charge = 0,
  paidDate = null,
}) => {
  const __rate = Number(rate) / 100 / 12;
  const __amount = Number(amount);
  let _installment = await orm(Installment).find({
    where: { isPaid: true, loan_id: loan_id },
    order: { created_at: "ASC" },
  });

  let __installment_per_month, __array;
  __installment_per_month = pillComponent(__amount, __rate, installment);

  let totalAmount = __amount - delay_charge;
  let nextDate = new Date(
    new Date(created).toISOString().split("T")[0] ||
    new Date().toISOString().split("T")[0]
  );

  __array = Array.from({ length: Number(installment) }).map((_, i) => {
    let pay = __installment_per_month;

    let currentDate = new Date(
      start.split("T")[0] || new Date().toISOString().split("T")[0]
    );
    currentDate.setMonth(currentDate.getMonth() + i);

    let timeDifference = currentDate.getTime() - nextDate.getTime();

    if (i == given_at - 1 && lastPaid > 0) {
      if (lastPaid > 0) pay = Number(lastPaid) - Number(_installment[i].delay_charge_paid);
      if (paidDate) {
        const pd = new Date(paidDate.split("T")[0]).getTime();
        timeDifference = pd - nextDate.getTime();
      }
    } else if (_installment[i]) {
      pay = Number(_installment[i].paid) - Number(_installment[i].delay_charge_paid);
      const pd = new Date(
        new Date(_installment[i].given_at).toISOString().split("T")[0]
      ).getTime();
      timeDifference = pd - nextDate.getTime();
    }
    nextDate = currentDate;
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const year = currentDate.getFullYear();
    const daysInYear = getDaysInYear(year);
    const __dailyInterestRate = Number(rate) / 100 / daysInYear;
    const __interest =
      Math.round(
        (totalAmount * __dailyInterestRate * daysPassed + Number.EPSILON) *
        100
      ) / 100;

    let __principle, __amount_per_month;

    if (i === Number(installment) - 1) {
      __principle = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
      if (__principle <= 0) __principle = 0;
      __amount_per_month =
        Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
    } else {
      __principle =
        Math.round((pay - __interest + Number.EPSILON) * 100) / 100;
      if (__principle <= 0) __principle = 0;
      __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
    }

    if (__principle > totalAmount) {
      __principle = totalAmount;
      __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
      // if (__amount_per_month <= 0) __amount_per_month = 0;
    }
    totalAmount =
      Math.round((totalAmount - __principle + Number.EPSILON) * 100) / 100;
    const __receive =
      Math.round((__amount - totalAmount + Number.EPSILON) * 100) / 100;
    console.log(
      currentDate,
      __amount_per_month,
      totalAmount,
      __receive,
      daysPassed,
      Number(rate) / 100,
      daysInYear,
      __interest
    );

    return {
      date: currentDate,
      amount: __amount_per_month,
      interest: __interest,
      principle: __principle,
      remaining: Math.max(0, totalAmount),
      receive: __receive,
      days: daysPassed,
    };
  });


  if (given_at && !isNaN(given_at)) __array = __array.splice(given_at);
  const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
  const __totalInstallment = __array.reduce(
    (a, b) => a + b.principle + b.interest,
    0
  );
  return {
    amount: Math.round((amount + Number.EPSILON) * 100) / 100,
    interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
    total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
    pay_per_month:
      Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
    total_receive:
      Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
    total_interest:
      Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
    installment: __array,
  };
};



export const flatrateCalculator = ({
  amount,
  remaining,
  interest_rate,
  total_installment,
  installment_start,
  installment_due = null,
  payment_date,
  pay = 0,
  interest_stack = 0,
  installment = 1,
  pay_days = 30,
  delay_days = 15,
  delay_charge = 50,
}) => {
  const __amount = Number(amount);
  let _remaining = Number(remaining);
  const __rate = Number(interest_rate) / 100 / 12;
  let __installment_per_month = 0;
  let __interest = 0;
  let __principle = 0;
  let __interest_due = 0;
  let total_principle = 0;
  let __paid = 0;
  let __interest_stack = Number(interest_stack);
  let __paid_interest = 0;

  // คำนวณดอกเบี้ยคงที่ (Flat Rate)
  const totalInterest =
    __amount * (Number(interest_rate) / 100) * (total_installment / 12);
  const totalAmount = __amount;
  // __interest = totalInterest / total_installment;

  if (installment >= total_installment) {
    // คำนวณดอกเบี้ยที่ชำระไปแล้ว
    const paidInterest = (totalInterest / total_installment) * (installment -1);

    if (paidInterest >= totalInterest) {
      // ถ้าดอกเบี้ยชำระครบแล้ว
      __paid_interest = 0
      __interest = 0
    } else {
      __interest = totalInterest - paidInterest;
    }
  } else {
    __interest = totalInterest / total_installment;
  }

  if (Number(installment) < Number(total_installment)) {
    __principle = totalAmount / total_installment;
  }
  __installment_per_month = Math.round((((totalAmount + totalInterest) / total_installment) + Number.EPSILON) * 100) /
    100;

  

  // คำนวณเงินต้นคงเหลือ
  const monthlyPrinciple = Math.round(((totalAmount / total_installment) + Number.EPSILON) * 100) / 100;
  const installmentPaid = installment - 1;
  const totalPrinciplePaid = installmentPaid * monthlyPrinciple;
  total_principle = Math.round(((totalAmount - totalPrinciplePaid) + Number.EPSILON) * 100) / 100;

  // งวดสุดท้าย
  if (
    installment === total_installment ||
    __installment_per_month > _remaining
  )
    __installment_per_month =
      Math.round((_remaining + Number.EPSILON) * 100) /
      100;
  __principle = __installment_per_month - __interest;


  let startDate = new Date(
    installment_start || new Date().toISOString().split("T")[0]
  );
  let currentDate = new Date(
    new Date(payment_date).toISOString().split("T")[0] || new Date().toISOString().split("T")[0]
  );
  let dueDate = installment_due ? new Date(installment_due) : currentDate;


  const timeDifference = currentDate.getTime() - startDate.getTime();
  const dueDifference = dueDate.getTime() - startDate.getTime();

  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const daysDue = Math.floor(dueDifference / (1000 * 60 * 60 * 24));

  const year = currentDate.getFullYear();
  const daysInYear = getDaysInYear(year);

  // คำนวณค่าปรับล่าช้า
  let __delay_times = Math.floor(
    (daysPassed - Number(pay_days)) / Number(delay_days)
  );
  __delay_times = __delay_times < 0 ? 0 : __delay_times;

  let __delay_charge = __delay_times * Number(delay_charge);
  let __delay_days = daysPassed - Number(pay_days);


  const __max =
    __principle + __interest + Number(interest_stack) + __delay_charge;
  const __min = __interest;
  let __nor = Math.min(__max, __installment_per_month);
  let __close = _remaining + __interest + Number(interest_stack) + __delay_charge;

  if (_remaining <= __installment_per_month) {
    __close = _remaining + Number(interest_stack) + __delay_charge;
  }

  if (
    Number(total_installment) <= Number(installment) ||
    __principle > Number(remaining)
  ) {
    __nor = __close
  }

  if (Number(pay) > 0 && Number(pay) < __min) {
    __interest = Number(pay);  // หักดอกเบี้ยเท่าที่จ่ายจริง
  }

  
  const _r = Math.max(0, __max - Number(pay));

  if (_r === 0) {
    __paid = Number(pay) - (__interest + Number(interest_stack)) - __delay_charge;
    // __paid_interest = __interest + Number(interest_stack) - __delay_charge;
    __paid_interest = __interest + Number(interest_stack);
    __interest_stack = 0;
  } else if (_r > 0) {
    if (_r > __principle) {
      __interest_stack = _r - __principle;
      __paid_interest = Number(pay);
    } else {
      __paid = __principle - _r;
      __paid_interest = __interest + Number(interest_stack);
      __interest_stack = 0;
    }
  }

  let __remaining = _remaining - __paid;
  if (Number(pay) > 0) {
    __remaining = _remaining - (__paid + __interest)
    total_principle = total_principle - __paid;
  }

  

  // ปัดเศษผลลัพธ์สุดท้ายก่อนส่งคืน
  return {
    days: daysPassed,
    daysInYear: daysInYear,
    principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
    interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
    interest_due: Math.round((__interest_due + Number.EPSILON) * 100) / 100,
    max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
    mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
    nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
    close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
    installment: installment,
    total_installment: total_installment,
    paid_interest: Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
    paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
    total_principle: Math.round((total_principle + Number.EPSILON) * 100) / 100,
    principle_remaining: Math.round((__remaining + Number.EPSILON) * 100) / 100,
    interest_remaining:
      Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
    delay_charge: Math.round((__delay_charge + Number.EPSILON) * 100) / 100,
    delay_times: __delay_times,
    delay_days: __delay_days,
  };
};


export const flatrateInstallment = async ({
  loan_id = -1,
  amount,
  rate,
  installment,
  start,
  created,
  given_at,
  lastPaid = 0,
  delay_charge = 0,
  paidDate = null,
}) => {
  const __rate = Number(rate) / 100 / 12;
  const __amount = Number(amount);
  let _installment = await orm(Installment).find({
    where: { isPaid: true, loan_id: loan_id },
    order: { created_at: "ASC" },
  });

  let __installment_per_month, __array;
  // คำนวณดอกเบี้ยแบบคงที่ (Flat Rate)
  const totalInterest = __amount * (Number(rate) / 100) * (installment / 12);
  const totalAmount = __amount + totalInterest;
  __installment_per_month =
    Math.round((totalAmount / installment + Number.EPSILON) * 100) / 100;

  let remainingAmount = totalAmount - delay_charge;
  let nextDate = new Date(
    new Date(created).toISOString().split("T")[0] ||
    new Date().toISOString().split("T")[0]
  );

  __array = Array.from({ length: Number(installment) }).map((_, i) => {
    let currentDate = new Date(
      start.split("T")[0] || new Date().toISOString().split("T")[0]
    );
    currentDate.setMonth(currentDate.getMonth() + i);

    let timeDifference = currentDate.getTime() - nextDate.getTime();
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));


    let __principle, __interest, __amount_per_month;
    __interest =
      Math.round((totalInterest / installment + Number.EPSILON) * 100) / 100;
    let pay = __installment_per_month;
    if (i == given_at - 1 && lastPaid > 0) {
      if (lastPaid > 0) pay = Number(lastPaid) - Number(_installment[i].delay_charge_paid);
    } else if (_installment[i]) {
      pay = Number(_installment[i].paid) - Number(_installment[i].delay_charge_paid);
    }
    // งวดสุดท้าย
    if (
      i === Number(installment) - 1
    ) {
      __amount_per_month =
        Math.round((remainingAmount + Number.EPSILON) * 100) /
        100;
    } else if (pay > remainingAmount) {
      __amount_per_month =
        Math.round((remainingAmount + Number.EPSILON) * 100) /
        100;
      // __interest = __interest + (__interest*(installment-given_at-1))
    }
    else __amount_per_month = pay;

    __principle =
      Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
      100;
    if (__principle < 0) {
      __principle = 0;
      __interest = 0
    }

    remainingAmount =
      Math.round((remainingAmount - __amount_per_month + Number.EPSILON) * 100) /
      100;

    return {
      date: currentDate,
      amount: __amount_per_month,
      interest: __interest,
      principle: __principle,
      remaining: Math.max(0, remainingAmount),
      receive:
        Math.round((totalAmount - remainingAmount + Number.EPSILON) * 100) /
        100,
      days: daysPassed,
    };
  });


  if (given_at && !isNaN(given_at)) __array = __array.splice(given_at);
  const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
  const __totalInstallment = __array.reduce(
    (a, b) => a + b.principle + b.interest,
    0
  );
  return {
    amount: Math.round((amount + Number.EPSILON) * 100) / 100,
    interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
    total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
    pay_per_month:
      Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
    total_receive:
      Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
    total_interest:
      Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
    installment: __array,
  };
};