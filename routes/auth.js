const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const User = require('../models/User');
const router = express.Router();

// 注册路由
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, email, password } = req.body;
    
    // 验证输入数据
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username, email, password });
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    // 检查用户名是否已存在
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      console.log('User already exists:', existingUser.username);
      return res.status(400).json({ message: 'Username or email already exists.' });
    }
    
    // 创建新用户
    console.log('Creating new user...');
    const user = await User.create({
      username,
      email,
      password
    });
    
    console.log('User created successfully:', user.id);
    
    // 生成token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error registering user.', error: error.message });
  }
});

// 登录路由
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({
      where: { email }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    
    // 验证密码
    const isMatch = await user.validPassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    
    // 生成token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error: error.message });
  }
});

// 修改密码路由
router.put('/change-password', async (req, res) => {
  try {
    console.log('=== 修改密码请求开始 ===');
    console.log('请求头 Authorization:', req.headers.authorization);
    console.log('请求体:', req.body);
    
    const { currentPassword, newPassword } = req.body;
    
    // 验证输入数据
    if (!currentPassword || !newPassword) {
      console.log('❌ 缺少必要字段:', { currentPassword, newPassword });
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }
    
    if (newPassword.length < 6) {
      console.log('❌ 新密码长度不足:', newPassword.length);
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }
    
    // 获取用户ID从token
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token:', token ? '存在' : '不存在');
    
    if (!token) {
      console.log('❌ 未提供认证token');
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token验证成功，用户ID:', decoded.id);
    } catch (jwtError) {
      console.log('❌ Token验证失败:', jwtError.message);
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    const user = await User.findByPk(decoded.id);
    console.log('用户查询结果:', user ? `找到用户 ${user.username}` : '未找到用户');
    
    if (!user) {
      console.log('❌ 用户不存在');
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // 验证当前密码
    console.log('开始验证当前密码...');
    const isMatch = await user.validPassword(currentPassword);
    console.log('当前密码验证结果:', isMatch ? '✅ 正确' : '❌ 错误');
    
    if (!isMatch) {
      console.log('❌ 当前密码不正确');
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    
    // 更新密码
    console.log('开始更新密码...');
    const salt = await bcrypt.genSalt(10);
    console.log('盐值生成成功');
    
    user.password = await bcrypt.hash(newPassword, salt);
    console.log('密码哈希完成');
    
    await user.save();
    console.log('✅ 用户密码更新成功');
    
    res.json({ message: 'Password changed successfully.' });
    console.log('=== 修改密码请求完成 ===');
  } catch (error) {
    console.error('❌ 修改密码过程中发生错误:');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    
    if (error.name === 'JsonWebTokenError') {
      console.log('❌ JWT错误');
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    res.status(500).json({ message: 'Error changing password.', error: error.message });
  }
});

// 修改用户信息路由
router.put('/profile', async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // 验证输入数据
    if (!username && !email) {
      return res.status(400).json({ message: 'Username or email is required.' });
    }
    
    if (username && (username.length < 3 || username.length > 20)) {
      return res.status(400).json({ message: 'Username must be between 3 and 20 characters.' });
    }
    
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    
    // 获取用户ID从token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // 检查用户名或邮箱是否已被使用
    if (username || email) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            username ? { username } : null,
            email ? { email } : null
          ].filter(Boolean),
          id: { [Op.ne]: user.id }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists.' });
      }
    }
    
    // 更新用户信息
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    
    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    res.status(500).json({ message: 'Error updating profile.', error: error.message });
  }
});

module.exports = router;