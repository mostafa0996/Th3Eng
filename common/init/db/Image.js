module.exports = (sequelize, DataType) => {
  const Image = sequelize.define('images', {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uniqueId: {
      type: DataType.STRING,
      unique: true,
    },
    value: {
      type: DataType.TEXT('long'),
      allowNull: false,
    },
  });

  return Image;
};
