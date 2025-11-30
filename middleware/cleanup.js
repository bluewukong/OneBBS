const Post = require('../models/Post');

// 自动删除最不受欢迎的帖子
const cleanupPosts = async () => {
  try {
    // 获取当前帖子总数
    const totalPosts = await Post.count();
    const maxTotalPosts = parseInt(process.env.MAX_TOTAL_POSTS || 1000);
    
    if (totalPosts > maxTotalPosts) {
      // 需要删除的帖子数量
      const postsToDelete = totalPosts - maxTotalPosts;
      
      // 获取所有帖子
      let posts = await Post.findAll({
        order: [['created_at', 'DESC']]
      });
      
      // 计算每个帖子的分数
      posts = posts.map(post => {
        const postData = post.toJSON();
        postData.score = post.calculateScore();
        return postData;
      });
      
      // 按分数升序排序（分数最低的在前面）
      posts.sort((a, b) => a.score - b.score);
      
      // 获取需要删除的帖子ID
      const postsToDeleteIds = posts.slice(0, postsToDelete).map(post => post.id);
      
      // 删除帖子
      await Post.destroy({
        where: {
          id: {
            [Post.sequelize.Op.in]: postsToDeleteIds
          }
        }
      });
      
      console.log(`Cleaned up ${postsToDelete} posts. Total posts now: ${maxTotalPosts}`);
    }
  } catch (error) {
    console.error('Error cleaning up posts:', error);
  }
};

// 启动定时清理任务
const startCleanupTask = () => {
  // 每小时执行一次清理
  const cleanupInterval = 60 * 60 * 1000;
  
  // 立即执行一次
  cleanupPosts();
  
  // 设置定时任务
  setInterval(cleanupPosts, cleanupInterval);
  console.log('Post cleanup task started. Running every hour.');
};

module.exports = {
  startCleanupTask,
  cleanupPosts
};