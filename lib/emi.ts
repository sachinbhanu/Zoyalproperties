export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[];
}

/** Standard reducing-balance EMI. rate is annual %, years is tenure. */
export function calculateEmi(principal: number, annualRate: number, years: number): EmiResult {
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRate / 12 / 100;
  const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;

  const schedule: EmiResult["schedule"] = [];
  let balance = principal;
  let principalPaid = 0;
  let interestPaid = 0;
  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    const princ = emi - interest;
    balance -= princ;
    principalPaid += princ;
    interestPaid += interest;
    if (m % 12 === 0 || m === n) {
      schedule.push({ year: Math.ceil(m / 12), principalPaid, interestPaid, balance: Math.max(0, balance) });
    }
  }
  return { emi, totalInterest: totalPayment - principal, totalPayment, schedule };
}
