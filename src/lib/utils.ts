export const getTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const setTokenToStorage = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

export const removeTokenFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('ru-RU');
};