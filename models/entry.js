const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');

const Entry = sequelize.define('Entry', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    giveawayId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Entry;
