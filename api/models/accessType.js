module.exports = function (sequelize, DataTypes) {
    const accessType = sequelize.define('AccessType', {
      Id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      Name: DataTypes.STRING,
      Active: DataTypes.INTEGER,
      CreatedBy: DataTypes.STRING,
      UpdatedBy: DataTypes.STRING,
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