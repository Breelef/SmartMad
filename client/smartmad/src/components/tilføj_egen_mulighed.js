import React, { useState } from 'react';

export const AddCustomOption = ({ onAdd }) => {
  const [customOption, setCustomOption] = useState('');

  const handleAdd = () => {
    if (customOption) {
      onAdd(customOption);
      setCustomOption('');
    }
  };

  const handleKeyDown = (e) => {
    // Check if the "Enter" key was pressed (keyCode 13)
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex mb-4">
      <input
        type="text"
        placeholder="Tilføj din egen mulighed"
        value={customOption}
        onChange={(e) => setCustomOption(e.target.value)}
        onKeyDown={handleKeyDown} // Trigger handleAdd on "Enter"
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
