import { Transaction, ParsedTransaction, FinancialSummary, CategoryData, TrendData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const parseTransaction = async (input: string): Promise<ParsedTransaction & { originalInput: string; aiParsed: boolean }> => {
  const response = await fetch(`${API_URL}/api/transactions/parse`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error('Failed to parse transaction');
  }

  return response.json();
};

export const createTransaction = async (transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  const response = await fetch(`${API_URL}/api/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  return response.json();
};

export const getTransactions = async (filters?: {
  category?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<Transaction[]> => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
  }

  const response = await fetch(`${API_URL}/api/transactions?${queryParams}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get transactions');
  }

  return response.json();
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
  const response = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }

  return response.json();
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }
};

export const getFinancialSummary = async (filters?: { startDate?: string; endDate?: string }): Promise<FinancialSummary> => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
  }

  const response = await fetch(`${API_URL}/api/analytics/summary?${queryParams}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get financial summary');
  }

  return response.json();
};

export const getCategoryData = async (filters?: { startDate?: string; endDate?: string }): Promise<CategoryData[]> => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
  }

  const response = await fetch(`${API_URL}/api/analytics/categories?${queryParams}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get category data');
  }

  return response.json();
};

export const getTrendData = async (days: number = 30): Promise<TrendData> => {
  const response = await fetch(`${API_URL}/api/analytics/trends?days=${days}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get trend data');
  }

  return response.json();
};