const { PRODUCT_TYPE } = require('../../../modules/product/helpers/constants');

module.exports = (sequelize, DataType) => {
  const Product = sequelize.define('products', {
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
    secondName: {
      type: DataType.STRING,
      allowNull: false,
    },
    version: {
      type: DataType.STRING,
      allowNull: false,
    },
    price: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataType.ENUM({
        values: [Object.values(PRODUCT_TYPE)],
      }),
      allowNull: false,
    },
    description: {
      type: DataType.TEXT('long'),
      allowNull: false,
    },
    file: {
      type: DataType.TEXT('long'),
      allowNull: false,
    },
    visibility: {
      type: DataType.BOOLEAN,
      defaultValue: true,
    },
  });

  Product.associate = (models) => {
    Product.belongsToMany(models.tags, {
      through: 'product_tag',
      foreignKey: 'productId',
      otherKey: 'tagId',
    });
    Product.hasMany(models.screenshots, {
      foreignKey: 'productId',
    });
  };

  return Product;
};
