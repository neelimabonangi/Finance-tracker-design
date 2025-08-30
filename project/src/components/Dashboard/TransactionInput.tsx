import React, { useState } from 'react';
import { Send, Loader2, Check, X } from 'lucide-react';
import { parseTransaction, createTransaction } from '../../services/transactionService';
import { ParsedTransaction } from '../../types';

interface TransactionInputProps {
  onTransactionAdded: () => void;
}

const TransactionInput: React.FC<TransactionInputProps> = ({ onTransactionAdded }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<(ParsedTransaction & { originalInput: string; aiParsed: boolean }) | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const result = await parseTransaction(input.trim());
      setParsedData(result);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Parse error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!parsedData) return;

    try {
      setIsLoading(true);
      await createTransaction({
        amount: parsedData.amount,
        type: parsedData.type,
        category: parsedData.category,
        description: parsedData.description,
        originalInput: parsedData.originalInput,
        aiConfidence: parsedData.confidence,
        date: new Date().toISOString(),
        verified: true
      });
      
      // Reset form
      setInput('');
      setParsedData(null);
      setShowConfirmation(false);
      onTransactionAdded();
    } catch (error) {
      console.error('Create transaction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = () => {
    setParsedData(null);
    setShowConfirmation(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Transaction</h2>
      
      {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="transaction-input" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your transaction
            </label>
            <div className="relative">
              <input
                id="transaction-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Coffee at Starbucks $6.50"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 transition-colors duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: "Bought groceries $85", "Got paid $3000", "Netflix subscription $15.99"
            </p>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h3 className="font-medium text-emerald-900 mb-3">AI Parsed Transaction</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">${parsedData?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className={`font-medium capitalize ${parsedData?.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {parsedData?.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{parsedData?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="font-medium">{parsedData?.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AI Confidence:</span>
                <span className="font-medium">{Math.round((parsedData?.confidence || 0) * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Confirm
            </button>
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionInput;