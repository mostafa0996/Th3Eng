module.exports = (sequelize, DataType) =>
  sequelize.define('blogs', {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
  });
