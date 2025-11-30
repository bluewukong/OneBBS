const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 导入模型
const User = require('./models/User');
const Post = require('./models/Post');
const Reply = require('./models/Reply');
const Like = require('./models/Like');

// 设置模型关联关系
const models = { User, Post, Reply, Like };
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// 同步数据库
sequelize.sync({
  alter: true,
  force: false
}).then(() => {
  console.log('Database tables have been created/updated.');
  
  // 启动定时清理任务
  const { startCleanupTask } = require('./middleware/cleanup');
  startCleanupTask();
}).catch(err => {
  console.error('Error syncing database:', err);
});

// 导入路由
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const replyRoutes = require('./routes/replies');

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/replies', replyRoutes);

// 主路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Using PostgreSQL database.');
});

module.exports = app;