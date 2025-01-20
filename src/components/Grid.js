import React, { useRef, useEffect } from 'react';
import Field from './Field';
import { GridLogic } from '../utils/gridLogic';
import { generateFibNeighborsMap } from '../utils/fib';

const Grid = ({ sideSize }) => {
  const gridLogic = useRef(new GridLogic(sideSize, generateFibNeighborsMap(sideSize)));

  const onFieldInitialize = (row, col, fieldData) => {
    gridLogic.current.initializeField(row, col, fieldData);
  };

  const onFieldClick = (row, col, fieldData) => {
    gridLogic.current.handleFieldClick(row, col);
  };

  // Generate grid fields
  const renderFields = () => {
    const fields = [];
    
    for (let row = 0; row < sideSize; row++) {
      for (let col = 0; col < sideSize; col++) {
        fields.push(
          <Field
            key={`${row}-${col}`}
            row={row}
            col={col}
            initialColor="white"
            initialDisplayValue=""
            handleClick={onFieldClick}
            initialize={onFieldInitialize}
          />
        );
      }
    }
    return fields;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${sideSize}, 1fr)`,
      gap: '2px',
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {renderFields()}
    </div>
  );
};

export default Grid;
