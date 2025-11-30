const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'likes',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'post_id']
    }
  ]
});

// 关联用户
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 关联帖子
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

module.exports = Like;