const express = require('express');
const bodyParser = require('body-parser');
const { connectDB, sequelize } = require('./db/database');
const giveawayRoutes = require('./routes/giveaways');

// Importar los modelos para sincronizarlos
const Giveaway = require('./models/giveaway');
const Entry = require('./models/entry');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/giveaways', giveawayRoutes);

connectDB().then(() => {
    // Sincronizar los modelos con la db
    sequelize.sync({ force: true }) 
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Unable to synchronize the database:', error);
        });
});
