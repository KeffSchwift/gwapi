const express = require('express');
const router = express.Router();
const giveawayController = require('../controllers/giveawayController');

router.post('/', giveawayController.createGiveaway);
router.post('/:id/enter', giveawayController.enterGiveaway);
router.put('/:id', giveawayController.updateGiveaway);
router.post('/:id/end', giveawayController.endGiveaway);

module.exports = router;
