const Giveaway = require('../models/giveaway');
const Entry = require('../models/entry');
const { parseTime } = require('../utils/timeParser');
const { sendWebhook } = require('../utils/webhookSender');

exports.createGiveaway = async (req, res) => {
    const { duration, prize, winnersCount, webhookUrl } = req.body;
    const endTime = new Date(Date.now() + parseTime(duration));
    
    try {
        const giveaway = await Giveaway.create({ endTime, prize, winnersCount, webhookUrl });
        res.status(201).json({
            id: giveaway.id,
            endTime: Math.floor(giveaway.endTime.getTime() / 1000),
            prize: giveaway.prize,
            winnersCount: giveaway.winnersCount,
            webhookUrl: giveaway.webhookUrl,
            createdAt: Math.floor(giveaway.createdAt.getTime() / 1000),
            updatedAt: Math.floor(giveaway.updatedAt.getTime() / 1000)
        });
        console.log(`Giveaway created: ${JSON.stringify(giveaway.toJSON())}`);
    } catch (error) {
        console.error('Error creating giveaway:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.enterGiveaway = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    
    try {
        const entry = await Entry.create({ giveawayId: id, userId });
        res.status(201).json({
            id: entry.id,
            giveawayId: entry.giveawayId,
            userId: entry.userId,
            createdAt: Math.floor(entry.createdAt.getTime() / 1000),
            updatedAt: Math.floor(entry.updatedAt.getTime() / 1000)
        });
        console.log(`Entry created: ${JSON.stringify(entry.toJSON())}`);
    } catch (error) {
        console.error('Error creating entry:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.updateGiveaway = async (req, res) => {
    const { id } = req.params;
    const { duration, prize, winnersCount, webhookUrl } = req.body;
    const endTime = new Date(Date.now() + parseTime(duration));

    try {
        await Giveaway.update({ endTime, prize, winnersCount, webhookUrl }, { where: { id } });
        res.status(200).json({ message: 'Giveaway updated' });
        console.log(`Giveaway updated: ${id}`);
    } catch (error) {
        console.error('Error updating giveaway:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.endGiveaway = async (req, res) => {
    const { id } = req.params;
    
    try {
        const giveaway = await Giveaway.findByPk(id);
        if (!giveaway) {
            console.error(`Giveaway not found: ${id}`);
            return res.status(404).json({ message: 'Giveaway not found' });
        }

        const entries = await Entry.findAll({ where: { giveawayId: id } });
        const winners = [];

        if (entries.length === 0) {
            console.log(`No participants for giveaway ${id}`);
            await sendWebhook(giveaway.webhookUrl, `El sorteo ${id} (${giveaway.prize}) ha terminado sin participantes.`);
        } else {
            for (let i = 0; i < giveaway.winnersCount; i++) {
                if (entries.length === 0) break;
                const winnerIndex = Math.floor(Math.random() * entries.length);
                const winner = entries.splice(winnerIndex, 1)[0];
                winners.push(winner.userId);
            }
            console.log(`Winners for giveaway ${id}: ${winners.join(', ')}`);
            await sendWebhook(giveaway.webhookUrl, `Los ganadores del sorteo ${id} (${giveaway.prize}) son: ${winners.join(', ')}`);
        }

        await Giveaway.destroy({ where: { id } });
        await Entry.destroy({ where: { giveawayId: id } });

        res.status(200).json({ message: 'Giveaway ended', winners });
        console.log(`Giveaway ended: ${id}`);
    } catch (error) {
        console.error(`Error ending giveaway ${id}:`, error.message);
        res.status(500).json({ error: error.message });
    }
};
