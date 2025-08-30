export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  preferences: {
    currency: string;
    theme: 'light' | 'dark';
  };
}

export interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  originalInput: string;
  aiConfidence: number;
  date: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedTransaction {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  confidence: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  transactionCount: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  count: number;
}

export interface TrendData {
  [date: string]: {
    income: number;
    expenses: number;
  };
}