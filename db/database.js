const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida con la db.');
    } catch (error) {
        console.error('No se pudo conectar con la database:', error);
    }
};

module.exports = { sequelize, connectDB };
