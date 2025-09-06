-- 機種パラメータテーブル
CREATE TABLE IF NOT EXISTS machine_parameters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  machine_name TEXT NOT NULL,
  category_name TEXT NOT NULL,
  indicator_name TEXT NOT NULL,
  setting_number INTEGER NOT NULL,
  theoretical_value REAL NOT NULL,
  weight REAL DEFAULT 1.0,
  threshold REAL DEFAULT 0.1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 判別カテゴリテーブル
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  machine_name TEXT NOT NULL,
  category_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初期データの挿入
INSERT INTO categories (machine_name, category_name, display_order, is_visible) VALUES
('モンキーターンV', 'AT初当たり', 1, 1),
('モンキーターンV', 'AT直撃', 2, 1),
('モンキーターンV', '小役・5枚役', 3, 1),
('モンキーターンV', '黒メダル', 4, 1),
('モンキーターンV', '即優出', 5, 1);

-- 機種パラメータ初期データ（実測値に基づく）
INSERT INTO machine_parameters (machine_name, category_name, indicator_name, setting_number, theoretical_value, weight) VALUES
-- AT初当たり（仮値）
('モンキーターンV', 'AT初当たり', 'AT初当たり確率', 1, 0.0025, 1.0),
('モンキーターンV', 'AT初当たり', 'AT初当たり確率', 2, 0.0027, 1.0),
('モンキーターンV', 'AT初当たり', 'AT初当たり確率', 3, 0.0029, 1.0),
('モンキーターンV', 'AT初当たり', 'AT初当たり確率', 4, 0.0031, 1.0),
('モンキーターンV', 'AT初当たり', 'AT初当たり確率', 5, 0.0033, 1.0),
('モンキーターンV', 'AT初当たり', 'AT初当たり確率', 6, 0.0035, 1.0),

-- 5枚役（仮値）
('モンキーターンV', '小役・5枚役', '5枚役出現率', 1, 0.020, 1.0),
('モンキーターンV', '小役・5枚役', '5枚役出現率', 2, 0.021, 1.0),
('モンキーターンV', '小役・5枚役', '5枚役出現率', 3, 0.022, 1.0),
('モンキーターンV', '小役・5枚役', '5枚役出現率', 4, 0.023, 1.0),
('モンキーターンV', '小役・5枚役', '5枚役出現率', 5, 0.024, 1.0),
('モンキーターンV', '小役・5枚役', '5枚役出現率', 6, 0.025, 1.0),

-- 黒メダル（実測値）
('モンキーターンV', '黒メダル', '黒メダル出現率', 1, 0.0125, 2.0),
('モンキーターンV', '黒メダル', '黒メダル出現率', 2, 0.015, 2.0),
('モンキーターンV', '黒メダル', '黒メダル出現率', 3, 0.025, 2.0),
('モンキーターンV', '黒メダル', '黒メダル出現率', 4, 0.040, 2.0),
('モンキーターンV', '黒メダル', '黒メダル出現率', 5, 0.045, 2.0),
('モンキーターンV', '黒メダル', '黒メダル出現率', 6, 0.045, 2.0),

-- 即優出（実測値）
('モンキーターンV', '即優出', '即優出確率', 1, 0.016, 2.0),
('モンキーターンV', '即優出', '即優出確率', 2, 0.017, 2.0),
('モンキーターンV', '即優出', '即優出確率', 3, 0.020, 2.0),
('モンキーターンV', '即優出', '即優出確率', 4, 0.022, 2.0),
('モンキーターンV', '即優出', '即優出確率', 5, 0.030, 2.0),
('モンキーターンV', '即優出', '即優出確率', 6, 0.037, 2.0);