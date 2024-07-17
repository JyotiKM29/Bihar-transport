import React from "react";

const Modal = ({ title, children, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onCancel} className="text-black close-button">
            &times;
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
        <div className="border-t px-4 py-2 flex justify-end">
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
