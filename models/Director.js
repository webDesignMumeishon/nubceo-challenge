const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('director', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false
    });
};