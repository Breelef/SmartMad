import React from 'react';

const RecipeButton = ({ onClick, children }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      style={{
        backgroundColor: hover ? '#34C759' : '#8BC34A',
        border: '1px solid #2F4F2F', // dark green
        borderRadius: '5px', // rounded edges
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#000', // black text
        cursor: 'pointer',
      }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      Find opskrifter
    </button>
  );
};

export default RecipeButton;