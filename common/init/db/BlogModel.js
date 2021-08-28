module.exports = (sequelize, DataType) => {
  const Blog = sequelize.define(
    'blogs',
    {
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
      images: {
        type: DataType.TEXT('long'),
        allowNull: false,
      },
      categories: {
        type: DataType.TEXT('long'),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  return Blog;
};
