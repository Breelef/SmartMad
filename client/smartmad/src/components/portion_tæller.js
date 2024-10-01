import React, { useState } from 'react';

export const PeopleCounter = ({ value, onChange }) => {
  // Handle increment and decrement
  const increment = () => {
    onChange(value + 1);
  };

  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center mt-4">
      <button
        onClick={decrement}
        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        -
      </button>
      <span className="mx-4 text-lg">{value}</span>
      <button
        onClick={increment}
        className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        +
      </button>
    </div>
  );
};
