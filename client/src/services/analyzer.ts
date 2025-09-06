import { InputData, AnalysisResult, MachineParameter } from '../types';

class SettingAnalyzer {
  private parameters: Record<string, Record<string, Record<number, { theoretical: number; weight: number }>>>;

  constructor(machineParameters: MachineParameter[]) {
    this.parameters = this.groupParametersByCategory(machineParameters);
  }

  private groupParametersByCategory(parameters: MachineParameter[]) {
    const grouped: Record<string, Record<string, Record<number, { theoretical: number; weight: number }>>> = {};
    parameters.forEach(param => {
      if (!grouped[param.category_name]) {
        grouped[param.category_name] = {};
      }
      if (!grouped[param.category_name][param.indicator_name]) {
        grouped[param.category_name][param.indicator_name] = {};
      }
      grouped[param.category_name][param.indicator_name][param.setting_number] = {
        theoretical: param.theoretical_value,
        weight: param.weight
      };
    });
    return grouped;
  }

  calculateSettingProbabilities(inputData: InputData): AnalysisResult {
    const settings = [1, 2, 3, 4, 5, 6];
    const likelihoods: Record<number, number> = {};
    const contributions: Record<number, Record<string, Record<string, any>>> = {};

    settings.forEach(setting => {
      likelihoods[setting] = 1.0;
      contributions[setting] = {};
    });

    Object.keys(inputData).forEach(category => {
      const categoryData = inputData[category];
      if (!this.parameters[category]) return;

      Object.keys(categoryData).forEach(indicator => {
        const indicatorData = categoryData[indicator];
        if (!this.parameters[category][indicator]) return;

        const observed = indicatorData.observed;
        const trials = indicatorData.trials;
        
        if (trials === 0 || observed < 0) return;

        const observedRate = observed / trials;

        settings.forEach(setting => {
          const paramData = this.parameters[category][indicator][setting];
          if (!paramData) return;

          const theoretical = paramData.theoretical;
          const weight = paramData.weight;

          const likelihood = this.calculateBinomialLikelihood(observed, trials, theoretical);
          const weightedLikelihood = Math.pow(likelihood, weight);

          likelihoods[setting] *= weightedLikelihood;
          
          if (!contributions[setting][category]) {
            contributions[setting][category] = {};
          }
          contributions[setting][category][indicator] = {
            observedRate,
            theoretical,
            deviation: Math.abs(observedRate - theoretical),
            likelihood: weightedLikelihood
          };
        });
      });
    });

    const totalLikelihood = Object.values(likelihoods).reduce((sum, val) => sum + val, 0);
    
    if (totalLikelihood === 0) {
      const uniformProb = 1 / settings.length;
      const probabilities: Record<number, number> = {};
      settings.forEach(setting => {
        probabilities[setting] = uniformProb;
      });
      return { 
        probabilities, 
        contributions, 
        sampleSufficiency: this.checkSampleSufficiency(inputData) 
      };
    }

    const probabilities: Record<number, number> = {};
    settings.forEach(setting => {
      probabilities[setting] = likelihoods[setting] / totalLikelihood;
    });

    return {
      probabilities,
      contributions,
      sampleSufficiency: this.checkSampleSufficiency(inputData)
    };
  }

  private calculateBinomialLikelihood(observed: number, trials: number, probability: number): number {
    if (trials === 0) return 1.0;
    if (probability === 0 && observed === 0) return 1.0;
    if (probability === 0 && observed > 0) return 0.0;
    if (probability === 1 && observed === trials) return 1.0;
    if (probability === 1 && observed < trials) return 0.0;

    const p = Math.max(0.001, Math.min(0.999, probability));
    const observedRate = observed / trials;
    
    const variance = p * (1 - p) / trials;
    const standardError = Math.sqrt(variance);
    
    if (standardError === 0) return 1.0;
    
    const zScore = (observedRate - p) / standardError;
    
    return Math.exp(-0.5 * zScore * zScore);
  }

  private checkSampleSufficiency(inputData: InputData) {
    const recommendations: Record<string, Record<string, any>> = {};
    let overallSufficient = true;

    Object.keys(inputData).forEach(category => {
      const categoryData = inputData[category];
      recommendations[category] = {};

      Object.keys(categoryData).forEach(indicator => {
        const indicatorData = categoryData[indicator];
        const trials = indicatorData.trials;

        let requiredSamples = 100;
        if (category === '黒メダル' || category === '即優出') {
          requiredSamples = 50;
        } else if (category === 'AT初当たり') {
          requiredSamples = 200;
        }

        const sufficient = trials >= requiredSamples;
        if (!sufficient) overallSufficient = false;

        recommendations[category][indicator] = {
          current: trials,
          required: requiredSamples,
          sufficient
        };
      });
    });

    return {
      overall: overallSufficient,
      details: recommendations
    };
  }
}

export default SettingAnalyzer;