import React from 'react';

export const SelectedOptionsBox = ({ selectedOptions, onDeselect }) => {
  return (
    <div className="flex flex-wrap">
      {selectedOptions.map((option, index) => (
        <div
          key={index}
          className="flex items-center px-3 py-1 mb-2 mr-2 text-sm text-white bg-blue-500 rounded-md"
        >
          {option}
          <button
            onClick={() => onDeselect(option)}
            className="ml-2 text-white hover:text-red-500"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
