const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 认证中间件
const auth = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    // 将用户和token添加到请求对象
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

module.exports = auth;