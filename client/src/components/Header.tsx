import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1>スマスロ モンキーターン V</h1>
      <h2>設定判別ツール</h2>
      
      <div className="disclaimer">
        <div className="warning-text">
          <p>⚠️ 18歳未満の利用は禁止されています</p>
          <p>📞 ギャンブル依存でお悩みの方: <a href="https://www.rcgdaikokucho.com/consultation/" target="_blank" rel="noopener noreferrer">リカバリーサポート・ネットワーク</a></p>
          <p>⚖️ 本ツールの結果は参考情報であり、成果を保証するものではありません</p>
        </div>
      </div>
    </header>
  );
};

export default Header;