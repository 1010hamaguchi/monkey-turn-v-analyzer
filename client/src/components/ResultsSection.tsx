import React from 'react';
import { AnalysisResult } from '../types';

interface ResultsSectionProps {
  results: AnalysisResult | null;
  isLoading: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="results-section">
        <h2>設定推定結果</h2>
        <div className="loading">解析中...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-section">
        <h2>設定推定結果</h2>
        <div className="no-results">データを入力すると結果が表示されます</div>
      </div>
    );
  }

  const settings = [1, 2, 3, 4, 5, 6];
  const sortedSettings = settings.sort((a, b) => results.probabilities[b] - results.probabilities[a]);

  return (
    <div className="results-section">
      <h2>設定推定結果</h2>
      
      {!results.sampleSufficiency.overall && (
        <div className="warning-banner">
          <h3>⚠️ サンプル不足</h3>
          <p>正確な判別には更なるデータが必要です</p>
        </div>
      )}

      <div className="probability-display">
        <h3>設定確率</h3>
        {sortedSettings.map(setting => {
          const probability = results.probabilities[setting];
          const percentage = (probability * 100).toFixed(1);
          
          return (
            <div key={setting} className="setting-row">
              <div className="setting-label">設定{setting}</div>
              <div className="probability-bar">
                <div 
                  className="probability-fill"
                  style={{ width: `${probability * 100}%` }}
                ></div>
                <span className="probability-text">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sample-info">
        <h3>サンプル状況</h3>
        {Object.entries(results.sampleSufficiency.details).map(([category, indicators]) => (
          <div key={category} className="category-samples">
            <h4>{category}</h4>
            {Object.entries(indicators).map(([indicator, info]) => (
              <div key={indicator} className="sample-row">
                <span className="indicator-name">{indicator}</span>
                <span className={`sample-status ${info.sufficient ? 'sufficient' : 'insufficient'}`}>
                  {info.current}/{info.required} {info.sufficient ? '✓' : '⚠️'}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="contributions">
        <h3>寄与度詳細</h3>
        <div className="contribution-table">
          <table>
            <thead>
              <tr>
                <th>指標</th>
                <th>実測値</th>
                <th>設定1理論値</th>
                <th>設定6理論値</th>
                <th>乖離度</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results.contributions[1] || {}).map(([category, indicators]) =>
                Object.entries(indicators).map(([indicator, data]) => {
                  const setting6Data = results.contributions[6]?.[category]?.[indicator];
                  return (
                    <tr key={`${category}-${indicator}`}>
                      <td>{indicator}</td>
                      <td>{(data.observedRate * 100).toFixed(2)}%</td>
                      <td>{(data.theoretical * 100).toFixed(2)}%</td>
                      <td>{setting6Data ? (setting6Data.theoretical * 100).toFixed(2) : 'N/A'}%</td>
                      <td>{(data.deviation * 100).toFixed(2)}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;