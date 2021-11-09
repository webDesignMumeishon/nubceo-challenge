const { DataTypes } = require('sequelize');
// Exporting a function that defines the model
// Then, the model is added into the sequelize connection
module.exports = (sequelize) => {

    sequelize.define('genre', {
        name: {
            type: DataTypes.STRING,
        },
    });
};