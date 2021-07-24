module.exports = (sequelize, DataType) => {
  const Image = sequelize.define(
    'images',
    {
      id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      image: {
        type: DataType.TEXT('long'),
        allowNull: false,
      },
      blogId: {
        type: DataType.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          name: 'blogId',
          unique: false,
          fields: ['blogId'],
        },
      ],
    }
  );

  Image.associate = (models) => {
    Image.belongsTo(models.blogs, {
      foreignKey: 'blogId',
    });
  };

  return Image;
};
