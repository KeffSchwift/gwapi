const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./db/database');
const giveawayRoutes = require('./routes/giveaways');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/giveaways', giveawayRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server iniciado en el puerto ${PORT}`);
    });
});
