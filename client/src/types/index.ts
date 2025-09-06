export interface InputData {
  [category: string]: {
    [indicator: string]: {
      observed: number;
      trials: number;
    }
  }
}

export interface SettingProbability {
  [setting: number]: number;
}

export interface Contribution {
  [setting: number]: {
    [category: string]: {
      [indicator: string]: {
        observedRate: number;
        theoretical: number;
        deviation: number;
        likelihood: number;
      }
    }
  }
}

export interface SampleSufficiency {
  overall: boolean;
  details: {
    [category: string]: {
      [indicator: string]: {
        current: number;
        required: number;
        sufficient: boolean;
      }
    }
  }
}

export interface AnalysisResult {
  probabilities: SettingProbability;
  contributions: Contribution;
  sampleSufficiency: SampleSufficiency;
}

export interface MachineParameter {
  category_name: string;
  indicator_name: string;
  setting_number: number;
  theoretical_value: number;
  weight: number;
}

export interface Category {
  category_name: string;
  display_order: number;
  is_visible: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}