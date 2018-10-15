module.exports = function (sequelize, DataTypes) {
    const module = sequelize.define('Module', {
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
        tableName: 'module',
        classMethods: {
          associate: function (Models) {
            // associations can be defined here
          }
        }
      });

    return module;
  };