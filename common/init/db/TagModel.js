module.exports = (sequelize, DataType) => {
  const Tag = sequelize.define('tags', {
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

  Tag.associate = (models) => {
    Tag.belongsToMany(models.products, {
      through: 'product_tag',
      foreignKey: 'tagId',
      otherKey: 'productId',
    });
  };

  return Tag;
};
