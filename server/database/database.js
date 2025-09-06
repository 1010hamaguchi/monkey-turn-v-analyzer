const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'monkey_turn_v.db');
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('データベース接続エラー:', err.message);
          reject(err);
        } else {
          console.log('SQLiteデータベースに接続しました');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      this.db.exec(schema, (err) => {
        if (err) {
          console.error('テーブル作成エラー:', err.message);
          reject(err);
        } else {
          console.log('データベーステーブルを初期化しました');
          resolve();
        }
      });
    });
  }

  async getMachineParameters(machineName) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT category_name, indicator_name, setting_number, theoretical_value, weight
        FROM machine_parameters 
        WHERE machine_name = ?
        ORDER BY category_name, setting_number
      `;
      
      this.db.all(sql, [machineName], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getCategories(machineName) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT category_name, display_order, is_visible
        FROM categories 
        WHERE machine_name = ? AND is_visible = 1
        ORDER BY display_order
      `;
      
      this.db.all(sql, [machineName], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async updateMachineParameter(machineName, categoryName, indicatorName, settingNumber, theoreticalValue, weight) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE machine_parameters 
        SET theoretical_value = ?, weight = ?, updated_at = CURRENT_TIMESTAMP
        WHERE machine_name = ? AND category_name = ? AND indicator_name = ? AND setting_number = ?
      `;
      
      this.db.run(sql, [theoreticalValue, weight, machineName, categoryName, indicatorName, settingNumber], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('データベース切断エラー:', err.message);
        } else {
          console.log('データベース接続を切断しました');
        }
      });
    }
  }
}

module.exports = new Database();