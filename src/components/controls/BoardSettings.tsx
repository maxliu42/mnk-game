import React from 'react';
import { MIN_BOARD_DIMENSION, MIN_WIN_LENGTH } from '../../constants';

interface BoardSettingsProps {
  m: number;
  n: number;
  k: number;
  onChange: (field: 'm' | 'n' | 'k', value: number) => void;
}

interface FieldConfig {
  id: 'm' | 'n' | 'k';
  label: string;
  value: number;
  min: number;
  max?: number;
}

const BoardSettings: React.FC<BoardSettingsProps> = ({ m, n, k, onChange }) => {
  const handleChange = (field: 'm' | 'n' | 'k', value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) onChange(field, numValue);
  };

  const fields: FieldConfig[] = [
    { id: 'm', label: 'Rows', value: m, min: MIN_BOARD_DIMENSION },
    { id: 'n', label: 'Columns', value: n, min: MIN_BOARD_DIMENSION },
    { id: 'k', label: 'Win Length', value: k, min: MIN_WIN_LENGTH, max: Math.max(m, n) },
  ];

  return (
    <div className="game-controls">
      {fields.map(({ id, label, value, min, max }) => (
        <div key={id} className="input-group">
          <label htmlFor={`${id}-input`}>{label} <span>({id})</span></label>
          <input
            id={`${id}-input`}
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => handleChange(id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default BoardSettings;
