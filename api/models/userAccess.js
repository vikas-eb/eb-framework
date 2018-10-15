module.exports = function (sequelize, DataTypes) {
    const userAccess = sequelize.define('UserAccess', {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ModuleName: DataTypes.STRING,
      MyRecordsAccess: DataTypes.INTEGER,
      OtherRecordsAccess: DataTypes.INTEGER,
      Active: DataTypes.INTEGER,
      CreatedBy: DataTypes.INTEGER,
      UpdatedBy: DataTypes.INTEGER,
    },
      {
        tableName: 'useraccess',
        classMethods: {
          associate: function (Models) {
            // associations can be defined here
          }
        }
      });

    return userAccess;
  };