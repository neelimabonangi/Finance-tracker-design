import React, { useState } from 'react';
import { Wallet, TrendingUp, Shield } from 'lucide-react';
import GoogleLoginButton from '../GoogleLoginButton';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleGoogleSuccess = async (accessToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(accessToken);
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: any) => {
    setError('Google authentication failed. Please try again.');
    console.error('Google auth error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-xl mb-6 shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FinanceAI</h1>
          <p className="text-slate-300 text-lg">Smart spending tracking with AI insights</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to continue managing your finances</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isLoading}
          />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Smart Analytics</p>
              </div>
              <div>
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Secure & Private</p>
              </div>
              <div>
                <Wallet className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">AI Powered</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Your financial data is encrypted and private
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;