import { FC } from 'react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Система заявок</h1>
        <button 
          onClick={onLogout}
          className="bg-white text-blue-500 px-4 py-2 rounded"
        >
          Выйти
        </button>
      </div>
    </header>
  );
};

export default Header;