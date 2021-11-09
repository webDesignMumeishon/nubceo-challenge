const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {

    sequelize.define('movie', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            //Se desactiva el allownull para aquellos usuarios que ingresan con facebook, no se les requeire contraseña
            // allowNull: false,
        },
    },
    {
        timestamps: false
    });
};