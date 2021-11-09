const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('tvshow', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false
    });
};