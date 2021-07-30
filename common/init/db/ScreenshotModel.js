module.exports = (sequelize, DataType) => {
    const Screenshot = sequelize.define(
      'screenshots',
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
        productId: {
          type: DataType.INTEGER,
          allowNull: false,
        },
      },
      {
        indexes: [
          {
            name: 'productId',
            unique: false,
            fields: ['productId'],
          },
        ],
      }
    );
  
    Screenshot.associate = (models) => {
      Screenshot.belongsTo(models.products, {
        foreignKey: 'productId',
      });
    };
  
    return Screenshot;
  };
  