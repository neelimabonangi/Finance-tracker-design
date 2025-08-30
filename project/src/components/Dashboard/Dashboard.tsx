import React, { useState, useEffect } from 'react';
import { LogOut, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SummaryCards from './SummaryCards';
import TransactionInput from './TransactionInput';
import CategoryPieChart from '../Charts/CategoryPieChart';
import TrendChart from '../Charts/TrendChart';
import TransactionList from '../Transactions/TransactionList';
import {
  getFinancialSummary,
  getCategoryData,
  getTrendData,
  getTransactions
} from '../../services/transactionService';
import { FinancialSummary, CategoryData, TrendData, Transaction } from '../../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    transactionCount: 0
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<TrendData>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [summaryData, categoriesData, trendsData, transactionsData] = await Promise.all([
        getFinancialSummary(),
        getCategoryData(),
        getTrendData(30),
        getTransactions({ limit: 20 })
      ]);

      setSummary(summaryData);
      setCategoryData(categoriesData);
      setTrendData(trendsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      setIsLoading(true);
      await loadDashboardData();
      setIsLoading(false);
    };

    initDashboard();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleTransactionUpdate = async () => {
    await loadDashboardData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FinanceAI</h1>
                <p className="text-sm text-gray-500">Track your spending</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <div className="flex items-center gap-2">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <SummaryCards summary={summary} isLoading={isLoading} />

          {/* Transaction Input */}
          <TransactionInput onTransactionAdded={handleTransactionUpdate} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CategoryPieChart data={categoryData} isLoading={isLoading} />
            <TrendChart data={trendData} isLoading={isLoading} />
          </div>

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            onTransactionUpdated={handleTransactionUpdate}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;