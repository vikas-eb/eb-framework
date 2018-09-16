module.exports = function (sequelize, DataTypes) {
    const accessType = sequelize.define('AccessType', {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      Name: DataTypes.STRING,
      Active: DataTypes.INTEGER,
      CreatedBy: DataTypes.INTEGER,
      UpdatedBy: DataTypes.INTEGER,
    },
      {
        tableName: 'accessType',
        classMethods: {
          associate: function (Models) {
            // associations can be defined here
          }
        }
      });

    return accessType;
  };