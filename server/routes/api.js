const express = require('express');
const router = express.Router();
const database = require('../database/database');
const SettingAnalyzer = require('../analyzer');

router.get('/parameters/:machineName', async (req, res) => {
  try {
    const machineName = req.params.machineName;
    const parameters = await database.getMachineParameters(machineName);
    const categories = await database.getCategories(machineName);
    
    res.json({
      success: true,
      data: {
        parameters,
        categories
      }
    });
  } catch (error) {
    console.error('パラメータ取得エラー:', error);
    res.status(500).json({
      success: false,
      error: 'パラメータの取得に失敗しました'
    });
  }
});

router.post('/analyze/:machineName', async (req, res) => {
  try {
    const machineName = req.params.machineName;
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return res.status(400).json({
        success: false,
        error: '入力データが不正です'
      });
    }

    const parameters = await database.getMachineParameters(machineName);
    const analyzer = new SettingAnalyzer(parameters);
    const result = analyzer.calculateSettingProbabilities(inputData);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('解析エラー:', error);
    res.status(500).json({
      success: false,
      error: '設定解析に失敗しました'
    });
  }
});

router.put('/parameters/:machineName', async (req, res) => {
  try {
    const machineName = req.params.machineName;
    const { categoryName, indicatorName, settingNumber, theoreticalValue, weight } = req.body;

    if (!categoryName || !indicatorName || !settingNumber || theoreticalValue === undefined) {
      return res.status(400).json({
        success: false,
        error: '必須パラメータが不足しています'
      });
    }

    const changes = await database.updateMachineParameter(
      machineName,
      categoryName,
      indicatorName,
      settingNumber,
      theoreticalValue,
      weight || 1.0
    );

    if (changes === 0) {
      return res.status(404).json({
        success: false,
        error: '更新対象のパラメータが見つかりません'
      });
    }

    res.json({
      success: true,
      message: 'パラメータを更新しました'
    });
  } catch (error) {
    console.error('パラメータ更新エラー:', error);
    res.status(500).json({
      success: false,
      error: 'パラメータの更新に失敗しました'
    });
  }
});

module.exports = router;