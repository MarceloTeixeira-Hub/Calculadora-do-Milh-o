export enum CalculationType {
  TIME_TO_MILLION = 'TIME_TO_MILLION',
  CONTRIBUTION_NEEDED = 'CONTRIBUTION_NEEDED',
}

export enum PeriodType {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export interface CalculationInput {
  type: CalculationType;
  initialValue: number;
  monthlyContribution?: number; // Used for TIME_TO_MILLION
  targetYears?: number; // Used for CONTRIBUTION_NEEDED
  interestRate: number;
  ratePeriod: PeriodType;
}

export interface MonthlyData {
  month: number;
  year: number;
  invested: number;
  interest: number;
  total: number;
}

export interface YearlyData {
  year: number;
  investedAnnual: number;
  interestAnnual: number;
  totalInvested: number;
  totalInterest: number;
  totalAccumulated: number;
}

export interface CalculationResult {
  success: boolean;
  totalMonths: number;
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  requiredMonthlyContribution?: number; // Only for CONTRIBUTION_NEEDED
  monthlyData: MonthlyData[];
  yearlyData: YearlyData[];
  message: string;
}
