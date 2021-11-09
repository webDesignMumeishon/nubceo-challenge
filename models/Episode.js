const { DataTypes } = require('sequelize');
// Exporting a function that defines the model
// Then, the model is added into the sequelize connection

module.exports = (sequelize) => {

    sequelize.define('episode', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false
    });
};