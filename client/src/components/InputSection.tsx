import React from 'react';
import { InputData } from '../types';

interface InputSectionProps {
  inputData: InputData;
  onInputChange: (category: string, indicator: string, field: 'observed' | 'trials', value: number) => void;
}

const categories = [
  { name: 'AT初当たり', indicators: ['AT初当たり確率'], trialsLabel: '通常時総回転数' },
  { name: '小役・5枚役', indicators: ['5枚役出現率'], trialsLabel: '総回転数' },
  { name: '黒メダル', indicators: ['黒メダル出現率'], trialsLabel: 'AT終了回数' },
  { name: '即優出', indicators: ['即優出確率'], trialsLabel: 'AT終了回数' }
];

const InputSection: React.FC<InputSectionProps> = ({ inputData, onInputChange }) => {
  const handleIncrement = (category: string, indicator: string, field: 'observed' | 'trials') => {
    const currentValue = inputData[category]?.[indicator]?.[field] || 0;
    onInputChange(category, indicator, field, currentValue + 1);
  };

  const handleDecrement = (category: string, indicator: string, field: 'observed' | 'trials') => {
    const currentValue = inputData[category]?.[indicator]?.[field] || 0;
    if (currentValue > 0) {
      onInputChange(category, indicator, field, currentValue - 1);
    }
  };

  const handleDirectInput = (category: string, indicator: string, field: 'observed' | 'trials', value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0) {
      onInputChange(category, indicator, field, numValue);
    }
  };

  return (
    <div className="input-section">
      <h2>データ入力</h2>
      {categories.map(category => (
        <div key={category.name} className="category-section">
          <h3>{category.name}</h3>
          {category.indicators.map(indicator => (
            <div key={indicator} className="indicator-section">
              <h4>{indicator}</h4>
              
              <div className="input-group">
                <label>
                  {category.name === 'AT初当たり' ? 'AT初当たり回数:' :
                   category.name === '小役・5枚役' ? '5枚役回数:' :
                   category.name === '黒メダル' ? '黒メダル回数:' :
                   category.name === '即優出' ? '即優出回数:' : '成功回数:'}
                </label>
                <div className="counter-controls">
                  <button 
                    onClick={() => handleDecrement(category.name, indicator, 'observed')}
                    className="btn-decrement"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={inputData[category.name]?.[indicator]?.observed || 0}
                    onChange={(e) => handleDirectInput(category.name, indicator, 'observed', e.target.value)}
                    className="input-number"
                  />
                  <button 
                    onClick={() => handleIncrement(category.name, indicator, 'observed')}
                    className="btn-increment"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>{category.trialsLabel}:</label>
                <div className="counter-controls">
                  <button 
                    onClick={() => handleDecrement(category.name, indicator, 'trials')}
                    className="btn-decrement"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={inputData[category.name]?.[indicator]?.trials || 0}
                    onChange={(e) => handleDirectInput(category.name, indicator, 'trials', e.target.value)}
                    className="input-number"
                  />
                  <button 
                    onClick={() => handleIncrement(category.name, indicator, 'trials')}
                    className="btn-increment"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="rate-display">
                {inputData[category.name]?.[indicator]?.trials > 0 && (
                  <span>
                    出現率: {((inputData[category.name][indicator].observed / inputData[category.name][indicator].trials) * 100).toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InputSection;