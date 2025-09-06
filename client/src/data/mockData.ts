import { MachineParameter, Category } from '../types';

export const mockParameters: MachineParameter[] = [
  // AT初当たり
  { category_name: 'AT初当たり', indicator_name: 'AT初当たり確率', setting_number: 1, theoretical_value: 0.0025, weight: 1.0 },
  { category_name: 'AT初当たり', indicator_name: 'AT初当たり確率', setting_number: 2, theoretical_value: 0.0027, weight: 1.0 },
  { category_name: 'AT初当たり', indicator_name: 'AT初当たり確率', setting_number: 3, theoretical_value: 0.0029, weight: 1.0 },
  { category_name: 'AT初当たり', indicator_name: 'AT初当たり確率', setting_number: 4, theoretical_value: 0.0031, weight: 1.0 },
  { category_name: 'AT初当たり', indicator_name: 'AT初当たり確率', setting_number: 5, theoretical_value: 0.0033, weight: 1.0 },
  { category_name: 'AT初当たり', indicator_name: 'AT初当たり確率', setting_number: 6, theoretical_value: 0.0035, weight: 1.0 },

  // 5枚役
  { category_name: '小役・5枚役', indicator_name: '5枚役出現率', setting_number: 1, theoretical_value: 0.020, weight: 1.0 },
  { category_name: '小役・5枚役', indicator_name: '5枚役出現率', setting_number: 2, theoretical_value: 0.021, weight: 1.0 },
  { category_name: '小役・5枚役', indicator_name: '5枚役出現率', setting_number: 3, theoretical_value: 0.022, weight: 1.0 },
  { category_name: '小役・5枚役', indicator_name: '5枚役出現率', setting_number: 4, theoretical_value: 0.023, weight: 1.0 },
  { category_name: '小役・5枚役', indicator_name: '5枚役出現率', setting_number: 5, theoretical_value: 0.024, weight: 1.0 },
  { category_name: '小役・5枚役', indicator_name: '5枚役出現率', setting_number: 6, theoretical_value: 0.025, weight: 1.0 },

  // 黒メダル（実測値）
  { category_name: '黒メダル', indicator_name: '黒メダル出現率', setting_number: 1, theoretical_value: 0.0125, weight: 2.0 },
  { category_name: '黒メダル', indicator_name: '黒メダル出現率', setting_number: 2, theoretical_value: 0.015, weight: 2.0 },
  { category_name: '黒メダル', indicator_name: '黒メダル出現率', setting_number: 3, theoretical_value: 0.025, weight: 2.0 },
  { category_name: '黒メダル', indicator_name: '黒メダル出現率', setting_number: 4, theoretical_value: 0.040, weight: 2.0 },
  { category_name: '黒メダル', indicator_name: '黒メダル出現率', setting_number: 5, theoretical_value: 0.045, weight: 2.0 },
  { category_name: '黒メダル', indicator_name: '黒メダル出現率', setting_number: 6, theoretical_value: 0.045, weight: 2.0 },

  // 即優出（実測値）
  { category_name: '即優出', indicator_name: '即優出確率', setting_number: 1, theoretical_value: 0.016, weight: 2.0 },
  { category_name: '即優出', indicator_name: '即優出確率', setting_number: 2, theoretical_value: 0.017, weight: 2.0 },
  { category_name: '即優出', indicator_name: '即優出確率', setting_number: 3, theoretical_value: 0.020, weight: 2.0 },
  { category_name: '即優出', indicator_name: '即優出確率', setting_number: 4, theoretical_value: 0.022, weight: 2.0 },
  { category_name: '即優出', indicator_name: '即優出確率', setting_number: 5, theoretical_value: 0.030, weight: 2.0 },
  { category_name: '即優出', indicator_name: '即優出確率', setting_number: 6, theoretical_value: 0.037, weight: 2.0 }
];

export const mockCategories: Category[] = [
  { category_name: 'AT初当たり', display_order: 1, is_visible: true },
  { category_name: '小役・5枚役', display_order: 2, is_visible: true },
  { category_name: '黒メダル', display_order: 3, is_visible: true },
  { category_name: '即優出', display_order: 4, is_visible: true }
];