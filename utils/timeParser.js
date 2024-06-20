exports.parseTime = (duration) => {
    const units = {
        'm': 60000,
        'h': 3600000,
        'd': 86400000
    };

    const match = duration.match(/(\d+)([mhd])/);
    if (!match) throw new Error('Invalid duration format');

    const value = parseInt(match[1]);
    const unit = match[2];

    return value * units[unit];
};
