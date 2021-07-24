module.exports = (sequelize, DataType) => {
  const Category = sequelize.define('categories', {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
  });

  Category.associate = (models) => {
    Category.belongsToMany(models.blogs, {
      through: 'blog_category',
      foreignKey: 'categoryId',
      otherKey: 'blogId',
    });
  };

  return Category;
};
