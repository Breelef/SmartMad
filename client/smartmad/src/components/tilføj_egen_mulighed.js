import React, { useState } from 'react';

export const AddCustomOption = ({ onAdd }) => {
  const [customOption, setCustomOption] = useState('');

  const handleAdd = () => {
    if (customOption) {
      onAdd(customOption);
      setCustomOption('');
    }
  };

  return (
    <div className="flex mb-4">
      <input
        type="text"
        placeholder="Tilføj din egen mulighed"
        value={customOption}
        onChange={(e) => setCustomOption(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-black"
      />
      <button
        onClick={handleAdd}
        className="ml-2 px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Add
      </button>
    </div>
  );
};
