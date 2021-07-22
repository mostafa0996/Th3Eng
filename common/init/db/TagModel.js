module.exports = (sequelize, DataType) =>
  sequelize.define('tags', {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataType.STRING(50),
      allowNull: false,
    },
  });
