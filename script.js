// TODO: input validation
// currency formatter
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "DOP",

  minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
});

// yearly changing variables (2022)
const UPTO_CASE1 = 416220; // up to 416,220
const UPTO_CASE2 = 624329; // from 416,220.01 to 624,329
const UPTO_CASE3 = 867123; // from 624,329.01 to 867,123
// from 867,123.01 onwards

// input values
const monthlySalary = document.getElementById("monthly-salary");
const bonifications = document.getElementById("bonifications");
const extraHours = document.getElementById("extra-hours");

// results
const afpDiscountField = document.getElementById("afp-discount");
const sfsDiscountField = document.getElementById("sfs-discount");
const isrDiscountField = document.getElementById("isr-discount");
const totalDiscountsField = document.getElementById("total-discounts");
const netSalaryField = document.getElementById("net-salary");

let monthlyIncome;

function getNetIncome() {
  // Convert to Float
  const monthlySalaryNum = parseFloat(monthlySalary.value);
  let bonificationsNum = parseFloat(bonifications.value);
  let extraHoursNum = parseFloat(extraHours.value);

  // Typecheck
  // if = NaN -> convert to 0
  bonificationsNum = isNaN(bonificationsNum) ? 0 : bonificationsNum;
  extraHoursNum = isNaN(extraHoursNum) ? 0 : extraHoursNum;
  // if negative number -> same number but positive
  bonificationsNum =
    bonificationsNum < 0 ? bonificationsNum * -1 : bonificationsNum;
  extraHoursNum = extraHoursNum < 0 ? extraHoursNum * -1 : extraHoursNum;

  // Calculate
  const afpDiscount = calculateAFP(monthlySalaryNum + bonificationsNum);
  const sfsDiscount = calculateSFS(monthlySalaryNum + bonificationsNum);

  const anualIncome =
    (monthlySalaryNum -
      afpDiscount -
      sfsDiscount +
      bonificationsNum +
      extraHoursNum) *
    12;

  const isrDiscount = calculateISR(anualIncome);

  // Modify HTML
  afpDiscountField.innerHTML = formatter.format(afpDiscount);
  sfsDiscountField.innerHTML = formatter.format(sfsDiscount);
  isrDiscountField.innerHTML = formatter.format(isrDiscount);
  totalDiscountsField.innerHTML = formatter.format(
    afpDiscount + sfsDiscount + isrDiscount
  );
  netSalaryField.innerHTML = formatter.format(
    monthlySalaryNum - afpDiscount - sfsDiscount - isrDiscount
  );
}

function calculateAFP(monthlySalary) {
  return monthlySalary * 0.0287;
}

function calculateSFS(monthlySalary) {
  return monthlySalary * 0.0304;
}

function calculateISR(anualIncome) {
  if (anualIncome <= UPTO_CASE1) {
    return 0;
  } else if (anualIncome <= UPTO_CASE2) {
    return ((anualIncome - UPTO_CASE1 + 0.1) * 0.15) / 12;
  } else if (anualIncome <= UPTO_CASE3) {
    return (31216 + (anualIncome - UPTO_CASE2 + 0.1) * 0.2) / 12;
  } else {
    return (79776 + (anualIncome - UPTO_CASE3 + 0.1) * 0.25) / 12;
  }
}
