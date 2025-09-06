import React, { useState, useEffect } from 'react';
import { MachineParameter, Category } from '../types';
import { apiService } from '../services/api';

const AdminPanel: React.FC = () => {
  const [parameters, setParameters] = useState<MachineParameter[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingParam, setEditingParam] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    theoreticalValue: '',
    weight: ''
  });

  useEffect(() => {
    loadParameters();
  }, []);

  const loadParameters = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMachineParameters('モンキーターンV');
      setParameters(data.parameters);
      setCategories(data.categories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (param: MachineParameter) => {
    const key = `${param.category_name}-${param.indicator_name}-${param.setting_number}`;
    setEditingParam(key);
    setFormData({
      theoreticalValue: param.theoretical_value.toString(),
      weight: param.weight.toString()
    });
  };

  const handleSave = async (param: MachineParameter) => {
    try {
      const theoreticalValue = parseFloat(formData.theoreticalValue);
      const weight = parseFloat(formData.weight);

      if (isNaN(theoreticalValue) || isNaN(weight)) {
        alert('数値を正しく入力してください');
        return;
      }

      if (theoreticalValue < 0 || theoreticalValue > 1) {
        alert('理論値は0から1の間で入力してください');
        return;
      }

      if (weight < 0 || weight > 10) {
        alert('重みは0から10の間で入力してください');
        return;
      }

      await apiService.updateMachineParameter(
        'モンキーターンV',
        param.category_name,
        param.indicator_name,
        param.setting_number,
        theoreticalValue,
        weight
      );

      await loadParameters();
      setEditingParam(null);
      alert('更新が完了しました');
    } catch (err) {
      alert('更新に失敗しました: ' + (err instanceof Error ? err.message : '不明なエラー'));
    }
  };

  const handleCancel = () => {
    setEditingParam(null);
    setFormData({ theoreticalValue: '', weight: '' });
  };

  const groupedParameters = parameters.reduce((acc, param) => {
    if (!acc[param.category_name]) {
      acc[param.category_name] = {};
    }
    if (!acc[param.category_name][param.indicator_name]) {
      acc[param.category_name][param.indicator_name] = [];
    }
    acc[param.category_name][param.indicator_name].push(param);
    return acc;
  }, {} as Record<string, Record<string, MachineParameter[]>>);

  if (loading) {
    return (
      <div className="admin-panel">
        <h2>管理画面</h2>
        <div className="loading">データを読み込んでいます...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h2>管理画面 - 機種パラメータ管理</h2>
      <p className="admin-description">
        各設定の理論値と重みを編集できます。理論値は0〜1、重みは0〜10の範囲で入力してください。
      </p>

      {error && (
        <div className="error-message">
          エラー: {error}
        </div>
      )}

      <button onClick={loadParameters} className="refresh-button">
        データを再読み込み
      </button>

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
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {params.sort((a, b) => a.setting_number - b.setting_number).map(param => {
                        const key = `${param.category_name}-${param.indicator_name}-${param.setting_number}`;
                        const isEditing = editingParam === key;
                        
                        return (
                          <tr key={key}>
                            <td>設定{param.setting_number}</td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.0001"
                                  min="0"
                                  max="1"
                                  value={formData.theoreticalValue}
                                  onChange={(e) => setFormData({...formData, theoreticalValue: e.target.value})}
                                  className="edit-input"
                                />
                              ) : (
                                `${(param.theoretical_value * 100).toFixed(2)}%`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  value={formData.weight}
                                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                  className="edit-input"
                                />
                              ) : (
                                param.weight.toFixed(1)
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <div className="edit-buttons">
                                  <button onClick={() => handleSave(param)} className="save-button">
                                    保存
                                  </button>
                                  <button onClick={handleCancel} className="cancel-button">
                                    キャンセル
                                  </button>
                                </div>
                              ) : (
                                <button onClick={() => handleEdit(param)} className="edit-button">
                                  編集
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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

export default AdminPanel;