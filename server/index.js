const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const basicAuth = require('express-basic-auth');
const path = require('path');
require('dotenv').config();

const database = require('./database/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    error: 'リクエストが多すぎます。しばらく待ってから再試行してください。'
  }
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', limiter);
app.use('/api', apiRoutes);

const adminAuth = basicAuth({
  users: {
    'admin': process.env.ADMIN_PASSWORD || 'password123'
  },
  challenge: true,
  realm: 'モンキーターンV設定判別ツール管理画面'
});

app.use('/admin', adminAuth);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('サーバーエラー:', err.stack);
  res.status(500).json({
    success: false,
    error: 'サーバー内部エラーが発生しました'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'ページが見つかりません'
  });
});

async function startServer() {
  try {
    await database.initialize();
    
    app.listen(PORT, () => {
      console.log(`サーバーがポート${PORT}で起動しました`);
      console.log(`開発環境: http://localhost:${PORT}`);
      console.log(`管理画面: http://localhost:${PORT}/admin`);
    });
  } catch (error) {
    console.error('サーバー起動エラー:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('サーバーを終了しています...');
  database.close();
  process.exit(0);
});

startServer();