const axios = require('axios');

exports.sendWebhook = async (webhookUrl, message) => {
    try {
        await axios.post(webhookUrl, { content: message });
    } catch (error) {
        console.error('Error al enviar el webhook:', error);
    }
};
