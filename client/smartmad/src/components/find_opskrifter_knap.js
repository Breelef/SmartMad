import React, { Children } from 'react';

export const RecipeButton = ({ onClick, children, type = 'button' }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type={type} // Use the type prop, default to 'button'
      onClick={onClick}
      className={`border border-green-900 rounded-md px-5 py-2 text-lg font-bold text-black cursor-pointer ${
        hover ? 'bg-lime-500' : 'bg-emerald-500'
      }`}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      {children}
    </button>
  );
};
