import React, { useState, useRef, useEffect } from 'react';

export const DropdownWithSearch = ({ items, onSelect, isDropdownVisible, setIsDropdownVisible }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    // Add event listener to handle clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsDropdownVisible]);

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Søg eller vælg en mulighed"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsDropdownVisible(true)} // Show dropdown on focus
        className="w-full px-3 py-2 border rounded-md text-black"
      />
      {isDropdownVisible && (
        <div className="absolute z-10 w-full mt-1 bg-white text-black border rounded-md max-h-40 overflow-y-auto">
          {items
            .filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item, index) => (
              <div
                key={index}
                onClick={() => onSelect(item)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
              >
                {item}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
