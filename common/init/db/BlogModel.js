module.exports = (sequelize, DataType) => {
  const Blog = sequelize.define('blogs', {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataType.STRING,
      allowNull: false,
    },
    description: {
      type: DataType.TEXT('long'),
      allowNull: false,
    },
    cover: {
      type: DataType.TEXT('long'),
      allowNull: false,
    },
    visibility: {
      type: DataType.BOOLEAN,
      defaultValue: true,
    },
  });

  Blog.associate = (models) => {
    Blog.belongsToMany(models.categories, {
      through: 'blog_category',
      foreignKey: 'blogId',
      otherKey: 'categoryId',
    });
    Blog.hasMany(models.images, {
      foreignKey: 'blogId',
    });
  };

  return Blog;
};
