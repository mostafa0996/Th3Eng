module.exports = (sequelize, DataType) =>
  sequelize.define('products', {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
  });
