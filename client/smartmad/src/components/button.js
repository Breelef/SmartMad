import React from 'react';

const Button = () => {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      style={{
        backgroundColor: hover ? '#87CEEB' : '#ADD8E6', // light blue
        border: '1px solid #03055B', // dark blue
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
      Opret
    </button>
  );
};

export default Button;