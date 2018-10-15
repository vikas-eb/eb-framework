module.exports = function (sequelize, DataTypes) {
	const user = sequelize.define('User', {
		Id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		Email: DataTypes.STRING,
		Password: DataTypes.STRING,
		Title: DataTypes.STRING,
		FirstName: DataTypes.STRING,
		MiddleName: DataTypes.STRING,
		LastName: DataTypes.STRING,
		Phone1: DataTypes.STRING,
		Phone2: DataTypes.STRING,
		Address: DataTypes.STRING,
		City: DataTypes.STRING,
		State: DataTypes.STRING,
		Zip: DataTypes.STRING,
		DOB: DataTypes.DATE,
		Gender: DataTypes.STRING,
		ActivationHash: DataTypes.STRING,
		PasswordHash: DataTypes.STRING,
		PasswordHashValidTill: DataTypes.DATE,
		Active: DataTypes.BOOLEAN,
		ProfilePic: DataTypes.STRING,
		CreatedBy: DataTypes.STRING,
		UpdatedBy: DataTypes.STRING,
	},
		{
			tableName: 'user',
			classMethods: {
				associate: function (Models) {
					// associations can be defined here
				}
			}
		});

	return user;
};