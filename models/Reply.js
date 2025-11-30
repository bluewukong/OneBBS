const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const Reply = sequelize.define('Reply', {
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
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: 'id'
    }
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'replies',
  indexes: [
    {
      fields: ['post_id', 'created_at']
    }
  ]
});

// 关联用户和帖子
Reply.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
Reply.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// 关联回复到帖子
Post.hasMany(Reply, { foreignKey: 'post_id', as: 'replies' });

module.exports = Reply;