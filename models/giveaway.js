const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');

const Giveaway = sequelize.define('Giveaway', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    prize: {
        type: DataTypes.STRING,
        allowNull: false
    },
    winnersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    webhookUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Giveaway;
