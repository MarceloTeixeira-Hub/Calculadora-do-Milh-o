import { CalculationInput, CalculationType, PeriodType, CalculationResult, MonthlyData, YearlyData } from '../types';

const TARGET_AMOUNT = 1000000;

export const calculateCompoundInterest = (input: CalculationInput): CalculationResult => {
  const { type, initialValue, interestRate, ratePeriod } = input;

  // Convert rate to monthly decimal
  let monthlyRate = 0;
  if (ratePeriod === PeriodType.ANNUAL) {
    monthlyRate = Math.pow(1 + interestRate / 100, 1 / 12) - 1;
  } else {
    monthlyRate = interestRate / 100;
  }

  let currentAmount = initialValue;
  let totalInvested = initialValue;
  let months = 0;
  const monthlyData: MonthlyData[] = [];
  
  // Setup for Mode 1: Calculate Time
  if (type === CalculationType.TIME_TO_MILLION) {
    const monthlyContribution = input.monthlyContribution || 0;
    
    // Safety break to prevent infinite loops
    const MAX_MONTHS = 1200; // 100 years

    // Initial state (Month 0)
    monthlyData.push({
      month: 0,
      year: 0,
      invested: initialValue,
      interest: 0,
      total: initialValue
    });

    while (currentAmount < TARGET_AMOUNT && months < MAX_MONTHS) {
      months++;
      const interestEarned = currentAmount * monthlyRate;
      currentAmount += interestEarned + monthlyContribution;
      totalInvested += monthlyContribution;

      monthlyData.push({
        month: months,
        year: Math.floor(months / 12),
        invested: totalInvested,
        interest: currentAmount - totalInvested,
        total: currentAmount,
      });
    }

    return processResults(monthlyData, months, currentAmount, totalInvested, undefined);
  } 
  
  // Setup for Mode 2: Calculate Contribution Needed
  else {
    const years = input.targetYears || 1;
    const totalMonths = years * 12;
    
    // Formula: PMT = (FV - PV*(1+r)^n) / ( ((1+r)^n - 1) / r )
    // FV = Target, PV = Initial, r = monthlyRate, n = totalMonths
    
    const futureValueExisting = initialValue * Math.pow(1 + monthlyRate, totalMonths);
    const remainingTarget = TARGET_AMOUNT - futureValueExisting;

    let requiredMonthlyContribution = 0;

    if (remainingTarget > 0) {
       if (monthlyRate === 0) {
         requiredMonthlyContribution = remainingTarget / totalMonths;
       } else {
         const factor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
         requiredMonthlyContribution = remainingTarget / factor;
       }
    }

    // Now generate the projection based on this calculated contribution
    currentAmount = initialValue;
    totalInvested = initialValue;
    
    monthlyData.push({
      month: 0,
      year: 0,
      invested: initialValue,
      interest: 0,
      total: initialValue
    });

    for (let i = 1; i <= totalMonths; i++) {
      const interestEarned = currentAmount * monthlyRate;
      currentAmount += interestEarned + requiredMonthlyContribution;
      totalInvested += requiredMonthlyContribution;

      monthlyData.push({
        month: i,
        year: Math.floor(i / 12),
        invested: totalInvested,
        interest: currentAmount - totalInvested,
        total: currentAmount,
      });
    }

    return processResults(monthlyData, totalMonths, currentAmount, totalInvested, requiredMonthlyContribution);
  }
};

const processResults = (
  monthlyData: MonthlyData[], 
  totalMonths: number, 
  finalAmount: number, 
  totalInvested: number,
  requiredMonthlyContribution?: number
): CalculationResult => {
  
  const totalInterest = finalAmount - totalInvested;

  // Aggregate Yearly Data
  const yearlyData: YearlyData[] = [];
  const distinctYears = Array.from(new Set(monthlyData.map(d => d.year)));

  distinctYears.forEach(year => {
    // Get the last month of this year (or the very last month of data if it's the final partial year)
    const recordsInYear = monthlyData.filter(d => d.year === year);
    if (recordsInYear.length === 0) return;

    const lastRecord = recordsInYear[recordsInYear.length - 1];
    const firstRecord = recordsInYear[0];
    
    // Invested THIS year = Total Invested at end of year - Total Invested at start of year (approx)
    // Actually better to sum contributions, but calculating diff of totals works for clean continuous data
    const prevYearLastRecord = monthlyData.filter(d => d.year === year - 1).pop();
    const investedAtStartOfYear = prevYearLastRecord ? prevYearLastRecord.invested : (year === 0 ? 0 : 0);
    
    const interestAtStartOfYear = prevYearLastRecord ? prevYearLastRecord.interest : 0;

    yearlyData.push({
      year: year,
      investedAnnual: lastRecord.invested - investedAtStartOfYear,
      interestAnnual: lastRecord.interest - interestAtStartOfYear,
      totalInvested: lastRecord.invested,
      totalInterest: lastRecord.interest,
      totalAccumulated: lastRecord.total
    });
  });

  // Filter out year 0 if it's just the starting point and nothing happened
  const finalYearlyData = yearlyData.filter(y => y.year > 0 || totalMonths === 0);

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  let message = "";
  if (requiredMonthlyContribution !== undefined) {
    message = `Para atingir R$ 1 milhão em ${years} anos, você precisa investir mensalmente:`;
  } else {
    message = `Você atingirá R$ 1 milhão em ${years} anos e ${remainingMonths} meses!`;
  }

  return {
    success: true,
    totalMonths,
    finalAmount,
    totalInvested,
    totalInterest,
    requiredMonthlyContribution,
    monthlyData,
    yearlyData: finalYearlyData,
    message
  };
};
