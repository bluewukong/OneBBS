const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Reply = require('../models/Reply');
const Like = require('../models/Like');
const router = express.Router();

// 获取所有帖子（带时间衰减排序）
router.get('/', async (req, res) => {
  try {
    // 获取所有帖子
    let posts = await Post.findAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // 获取当前用户ID（如果有的话）
    const userId = req.user ? req.user.id : null;
    
    // 计算每个帖子的分数并添加用户点赞状态
    posts = await Promise.all(posts.map(async (post) => {
      const postData = post.toJSON();
      postData.score = post.calculateScore();
      
      // 检查当前用户是否已点赞该帖子
      if (userId) {
        const userLike = await Like.findOne({
          where: {
            user_id: userId,
            post_id: post.id
          }
        });
        postData.user_liked = !!userLike;
      } else {
        postData.user_liked = false;
      }
      
      return postData;
    }));
    
    // 按分数降序排序
    posts.sort((a, b) => b.score - a.score);
    
    // 只返回首页需要的帖子数量
    const homePagePosts = parseInt(process.env.HOME_PAGE_POSTS || 100);
    posts = posts.slice(0, homePagePosts);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts.', error: error.message });
  }
});

// 创建新帖子
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const userId = req.user.id;
    
    // 检查今天发帖数量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const postsToday = await Post.count({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: today
        }
      }
    });
    
    const maxPostsPerDay = parseInt(process.env.MAX_POSTS_PER_DAY || 10);
    if (postsToday >= maxPostsPerDay) {
      return res.status(400).json({ 
        message: `You have reached the daily post limit of ${maxPostsPerDay}.` 
      });
    }
    
    // 创建帖子
    const post = await Post.create({
      title,
      content,
      user_id: userId,
      color: color || '#FFEB3B'
    });
    
    // 获取完整帖子信息
    const fullPost = await Post.findByPk(post.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] }
      ]
    });
    
    res.status(201).json({
      message: 'Post created successfully.',
      post: fullPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post.', error: error.message });
  }
});

// 获取单个帖子
router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // 获取帖子
    const post = await Post.findByPk(postId, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        {
          model: Reply, 
          as: 'replies',
          include: [
            { model: User, as: 'author', attributes: ['id', 'username'] }
          ],
          order: [['created_at', 'ASC']]
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    // 增加阅读数
    await post.update({
      view_count: post.view_count + 1
    });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post.', error: error.message });
  }
});

// 删除帖子
router.delete('/:id', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    // 查找帖子
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    // 检查是否是帖子作者
    if (post.user_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }
    
    // 删除帖子
    await post.destroy();
    
    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post.', error: error.message });
  }
});

// 给帖子点赞/取消点赞
router.post('/:id/like', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    
    console.log(`点赞请求: 用户 ${userId} 对帖子 ${postId} 执行点赞操作`);
    
    // 查找帖子
    const post = await Post.findByPk(postId);
    
    if (!post) {
      console.error(`帖子不存在: ${postId}`);
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    // 检查用户是否已经点过赞
    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        post_id: postId
      }
    });
    
    let newLikeCount = post.like_count;
    let action = '';
    
    if (existingLike) {
      // 取消点赞
      console.log(`取消点赞: 用户 ${userId} 对帖子 ${postId} 取消点赞`);
      await existingLike.destroy();
      newLikeCount = Math.max(0, newLikeCount - 1);
      action = 'unliked';
    } else {
      // 点赞
      console.log(`点赞: 用户 ${userId} 对帖子 ${postId} 点赞`);
      await Like.create({
        user_id: userId,
        post_id: postId
      });
      newLikeCount = newLikeCount + 1;
      action = 'liked';
    }
    
    // 更新帖子的点赞数
    await post.update({
      like_count: newLikeCount
    });
    
    console.log(`点赞操作完成: 帖子 ${postId} 的新点赞数为 ${newLikeCount}`);
    
    res.json({ 
      message: `Post ${action} successfully.`,
      action: action,
      like_count: newLikeCount,
      is_liked: action === 'liked'
    });
  } catch (error) {
    console.error(`点赞操作错误: ${error.message}`);
    res.status(500).json({ message: 'Error processing like action.', error: error.message });
  }
});

module.exports = router;