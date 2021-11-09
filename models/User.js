const { DataTypes } = require('sequelize');
// Exporting a function that defines the model
// Then, the model is added into the sequelize connection
module.exports = (sequelize) => {

    sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};