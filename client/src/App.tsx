import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import AdminPanel from './components/AdminPanel';
import { InputData, AnalysisResult } from './types';
import { apiService } from './services/api';
import './App.css';

function MainPage() {
  const [inputData, setInputData] = useState<InputData>({});
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (category: string, indicator: string, field: 'observed' | 'trials', value: number) => {
    setInputData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [indicator]: {
          ...prev[category]?.[indicator],
          [field]: value
        }
      }
    }));
  };

  useEffect(() => {
    const analyzeData = async () => {
      const hasData = Object.values(inputData).some(category =>
        Object.values(category).some(indicator =>
          indicator.trials > 0
        )
      );

      if (!hasData) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const analysisResult = await apiService.analyzeSettings('モンキーターンV', inputData);
        setResults(analysisResult);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '解析中にエラーが発生しました';
        setError(errorMessage);
        console.error('Analysis error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(analyzeData, 500);
    return () => clearTimeout(debounceTimer);
  }, [inputData]);

  return (
    <>
      {error && (
        <div className="error-banner">
          <p>エラー: {error}</p>
        </div>
      )}
      
      <div className="content-container">
        <div className="input-column">
          <InputSection 
            inputData={inputData}
            onInputChange={handleInputChange}
          />
        </div>
        
        <div className="results-column">
          <ResultsSection 
            results={results}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <nav className="navigation">
          <Link to="/" className="nav-link">設定判別</Link>
          <Link to="/admin" className="nav-link">管理画面</Link>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 モンキーターンV設定判別ツール - 責任あるギャンブルを心がけましょう</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;