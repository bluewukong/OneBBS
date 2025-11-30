const express = require('express');
const { Op } = require('sequelize');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const Reply = require('../models/Reply');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// 确保上传目录存在
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || 5242880) // 5MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'), false);
    }
  }
});

// 压缩并保存图片
const compressAndSaveImage = async (fileBuffer, filename) => {
  try {
    const uniqueFilename = `${Date.now()}_${filename}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // 压缩图片
    await sharp(fileBuffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(filePath);
    
    return `/uploads/${uniqueFilename}`;
  } catch (error) {
    throw new Error('Error processing image.');
  }
};

// 创建新回复
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content, post_id } = req.body;
    const userId = req.user.id;
    
    // 检查今天回复数量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const repliesToday = await Reply.count({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: today
        }
      }
    });
    
    const maxRepliesPerDay = parseInt(process.env.MAX_REPLIES_PER_DAY || 20);
    if (repliesToday >= maxRepliesPerDay) {
      return res.status(400).json({ 
        message: `You have reached the daily reply limit of ${maxRepliesPerDay}.` 
      });
    }
    
    // 检查帖子是否存在
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    // 处理图片
    let imageUrl = null;
    if (req.file) {
      imageUrl = await compressAndSaveImage(req.file.buffer, req.file.originalname);
    }
    
    // 创建回复
    const reply = await Reply.create({
      content,
      user_id: userId,
      post_id,
      image_url: imageUrl
    });
    
    // 更新帖子的回复数
    await post.update({
      reply_count: post.reply_count + 1,
      updated_at: new Date()
    });
    
    // 获取完整回复信息
    const fullReply = await Reply.findByPk(reply.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] }
      ]
    });
    
    res.status(201).json({
      message: 'Reply created successfully.',
      reply: fullReply
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reply.', error: error.message });
  }
});

// 获取帖子的所有回复
router.get('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    
    // 检查帖子是否存在
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    // 获取回复
    const replies = await Reply.findAll({
      where: { post_id: postId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] }
      ],
      order: [['created_at', 'ASC']]
    });
    
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching replies.', error: error.message });
  }
});

// 删除回复
router.delete('/:id', auth, async (req, res) => {
  try {
    const replyId = req.params.id;
    const userId = req.user.id;
    
    // 查找回复
    const reply = await Reply.findByPk(replyId);
    
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found.' });
    }
    
    // 检查是否是回复作者
    if (reply.user_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this reply.' });
    }
    
    // 删除图片文件
    if (reply.image_url) {
      const imagePath = path.join(__dirname, '..', reply.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // 获取帖子信息
    const post = await Post.findByPk(reply.post_id);
    
    // 删除回复
    await reply.destroy();
    
    // 更新帖子的回复数
    if (post) {
      await post.update({
        reply_count: Math.max(0, post.reply_count - 1),
        updated_at: new Date()
      });
    }
    
    res.json({ message: 'Reply deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reply.', error: error.message });
  }
});

module.exports = router;