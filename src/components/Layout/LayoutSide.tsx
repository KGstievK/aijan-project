import { FC, ReactNode } from 'react';
import Header from './Header/Header';
import { useLogoutMutation } from '@/redux/api/auth';

interface LayoutSideProps {
  children: ReactNode;
}

const LayoutSide: FC<LayoutSideProps> = ({ children }) => {
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogout={handleLogout} />
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default LayoutSide;