import React from 'react';
import { mockParameters } from '../data/mockData';

const StaticAdminPanel: React.FC = () => {
  const groupedParameters = mockParameters.reduce((acc, param) => {
    if (!acc[param.category_name]) {
      acc[param.category_name] = {};
    }
    if (!acc[param.category_name][param.indicator_name]) {
      acc[param.category_name][param.indicator_name] = [];
    }
    acc[param.category_name][param.indicator_name].push(param);
    return acc;
  }, {} as Record<string, Record<string, typeof mockParameters>>);

  return (
    <div className="admin-panel">
      <h2>機種パラメータ一覧（表示のみ）</h2>
      <div className="admin-description">
        <p><strong>注意:</strong> GitHub Pages版では編集機能は利用できません。</p>
        <p>パラメータの編集が必要な場合は、ローカル環境でサーバーを起動してください。</p>
      </div>

      <div className="parameters-container">
        {Object.entries(groupedParameters).map(([categoryName, indicators]) => (
          <div key={categoryName} className="category-group">
            <h3>{categoryName}</h3>
            
            {Object.entries(indicators).map(([indicatorName, params]) => (
              <div key={indicatorName} className="indicator-group">
                <h4>{indicatorName}</h4>
                
                <div className="parameter-table">
                  <table>
                    <thead>
                      <tr>
                        <th>設定</th>
                        <th>理論値</th>
                        <th>重み</th>
                      </tr>
                    </thead>
                    <tbody>
                      {params.sort((a, b) => a.setting_number - b.setting_number).map(param => (
                        <tr key={`${param.category_name}-${param.indicator_name}-${param.setting_number}`}>
                          <td>設定{param.setting_number}</td>
                          <td>{(param.theoretical_value * 100).toFixed(2)}%</td>
                          <td>{param.weight.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaticAdminPanel;