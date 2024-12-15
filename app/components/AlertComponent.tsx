import React from 'react';

type AlertProps = {
  message: string;
  onClose: () => void;
};

const AlertComponent: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-80 bg-red-500 text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 rounded-full px-2 py-1 text-sm focus:outline-none"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default AlertComponent;
