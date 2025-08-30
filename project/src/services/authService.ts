const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const loginWithGoogle = async (accessToken: string) => {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    throw new Error('Google authentication failed');
  }

  return response.json();
};

export const getProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get profile');
  }

  return response.json();
};

export const logout = async () => {
  // Clear any client-side state
  // In production, you might want to invalidate the token server-side
};