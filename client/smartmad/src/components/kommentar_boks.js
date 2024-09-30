import React from 'react';

export const CommentsBox = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tiløj din kommentar her"
        className="w-full px-3 py-2 border rounded-md text-black h-24 resize-none"
      />
    </div>
  );
};
