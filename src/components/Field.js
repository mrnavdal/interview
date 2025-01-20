import React, { useState, useEffect } from 'react';

const Field = ({ row, col, handleClick, initialize }) => {
  const [color, setColor] = useState('white');
  const [displayValue, setDisplayValue] = useState('');
  
  useEffect(() => {
    initialize?.(row, col, {
      changeColor: setColor,
      changeValue: setDisplayValue,
      value: displayValue,
    });
  }, []);

  const handleFieldClick = () => {
    handleClick?.(row, col, {
      changeColor: setColor,
      changeValue: setDisplayValue,
      value: displayValue,
    });
  };

  return (
    <div 
      className='field'
      style={{ backgroundColor: color }}
      onClick={handleFieldClick}
    >
      {displayValue}
    </div>
  );
};

export default Field;
