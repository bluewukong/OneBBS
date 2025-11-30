const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#FFEB3B'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reply_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'posts',
  indexes: [
    {
      fields: ['created_at']
    }
  ]
});

// 关联用户
Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// 关联点赞（在需要时动态引入Like模型）
Post.associate = function(models) {
  Post.hasMany(models.Like, { foreignKey: 'post_id', as: 'likes' });
};

// 计算帖子分数（时间衰减算法）
Post.prototype.calculateScore = function() {
  const now = new Date();
  const postTime = new Date(this.created_at);
  const hours = (now - postTime) / (1000 * 60 * 60);
  const decayFactor = parseFloat(process.env.DECAY_FACTOR || 0.01);
  
  // 分数计算公式：(回复数 * 2 + 喜欢数 * 3 + 阅读数 * 0.1) * e^(-decayFactor * hours)
  const baseScore = (this.reply_count * 2) + (this.like_count * 3) + (this.view_count * 0.1);
  const score = baseScore * Math.exp(-decayFactor * hours);
  
  return score;
};

module.exports = Post;