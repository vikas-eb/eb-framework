module.exports = function (sequelize, DataTypes) {
    const accessGroup = sequelize.define('AccessGroup', {
      Id: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      Name: DataTypes.STRING,
      Active: DataTypes.INTEGER,
      CreatedBy: DataTypes.STRING,
      UpdatedBy: DataTypes.STRING,
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