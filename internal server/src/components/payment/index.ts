export const pillComponent = (__amount,__rate,installment) =>{
  const __diff = __amount * __rate;
  const __pill = Math.pow(1 + __rate, installment);
  const __diff2 = __diff * __pill;
  const __pill2 = __pill - 1;
  return Math.round((__diff2 / __pill2 + Number.EPSILON) * 100) / 100;
}