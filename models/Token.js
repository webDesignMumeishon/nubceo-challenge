const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {

    sequelize.define('token', {
        token: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    });
};