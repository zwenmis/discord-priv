const fs = require('fs');
const path = './evlilikler.json';

function readData() {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

module.exports = {
    name: "evlilik",
    aliases: ["eşim", "evlimiyim"],

    execute: async (client, message) => {
        const data = readData();
        const eşID = data[message.author.id] || Object.keys(data).find(k => data[k] === message.author.id);

        if (!eşID) {
            return message.reply("Şu anda kimseyle evli değilsin.");
        }

        const eş = await client.users.fetch(eşID);
        message.reply(`💞 Şu anda ${eş} ile evlisin!`);
    }
};
