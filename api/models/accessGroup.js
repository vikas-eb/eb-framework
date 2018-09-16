module.exports = function (sequelize, DataTypes) {
    const accessGroup = sequelize.define('AccessGroup', {
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
        tableName: 'accessGroup',
        classMethods: {
          associate: function (Models) {
            // associations can be defined here
          }
        }
      });

    return accessGroup;
  };