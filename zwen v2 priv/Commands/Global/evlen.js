const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const fs = require('fs');
const path = './evlilikler.json';

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

function readData() {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
    name: "evlen",
    aliases: [],

    execute: async (client, message, args) => {
        const user = message.mentions.users.first();
        if (!user) return message.reply("Kiminle evlenmek istiyorsun? Birini etiketle.");

        if (user.id === message.author.id) return message.reply("Kendinle evlenemezsin 🙄");
        if (user.bot) return message.reply("Botlarla evlenemezsin 🤖");

        const data = readData();
        const alreadyMarried = Object.entries(data).find(([k, v]) =>
            (k === message.author.id || v === message.author.id || k === user.id || v === user.id)
        );

        if (alreadyMarried) return message.reply("Sen veya teklif ettiğin kişi zaten evli!");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('kabul').setLabel('✅ Kabul').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('reddet').setLabel('❌ Reddet').setStyle(ButtonStyle.Danger)
        );

        const teklif = await message.channel.send({
            content: `${user}, ${message.author} seninle evlenmek istiyor! Kabul ediyor musun?`,
            components: [row]
        });

        const collector = teklif.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async i => {
            if (i.user.id !== user.id) {
                return i.reply({ content: "Bu teklif sana yapılmadı!", ephemeral: true });
            }

            if (i.customId === 'kabul') {
                const data = readData();
                data[message.author.id] = user.id;
                writeData(data);

                await i.update({ content: `💍 Tebrikler! ${message.author} ve ${user} artık evli!`, components: [] });
            } else {
                await i.update({ content: `${user} teklifi reddetti. 😢`, components: [] });
            }

            collector.stop();
        });

        collector.on('end', () => {
            if (!teklif.deleted) teklif.edit({ components: [] }).catch(() => {});
        });
    }
};
