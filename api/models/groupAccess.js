module.exports = function (sequelize, DataTypes) {
    const groupAccess = sequelize.define('GroupAccess', {
      Id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      ModuleId: DataTypes.STRING,
      HasAccess: DataTypes.INTEGER,
      Active: DataTypes.INTEGER,
      CreatedBy: DataTypes.STRING,
      UpdatedBy: DataTypes.STRING,
    },
      {
        tableName: 'groupAccess',
        classMethods: {
          associate: function (Models) {
            // associations can be defined here
          }
        }
      });

    return groupAccess;
  };