module.exports = (sequelize, DataType) =>
  sequelize.define('users', {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
  });
