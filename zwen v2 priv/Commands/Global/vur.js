module.exports = {
    name: "vur",
    aliases: ["kafasınavur", "tokat"],

    execute: async (client, message, args) => {
        const hedef = message.mentions.users.first();
        if (!hedef) {
            return message.reply("Kimin kafasına vurmak istiyorsun? Birini etiketle 😄");
        }

        if (hedef.id === message.author.id) {
            return message.reply("Kendi kafana vuramazsın 😅");
        }

        if (hedef.bot) {
            return message.reply("Botlara vuramazsın... onlar çipten yapılmış 🤖");
        }

        const gifler = [
            "https://media.tenor.com/Xq3XKf3-Ve0AAAAC/anime-hit.gif",
            "https://media.tenor.com/XgGmcUpiRa8AAAAC/anime-smack.gif",
            "https://media.tenor.com/JsRtEzYc4U4AAAAC/anime-girl.gif",
            "https://media.tenor.com/RgCOXwgd0BcAAAAC/anime-slap.gif",
            "https://media.tenor.com/PhzD9qzDkYoAAAAC/hit-anime.gif",
            "https://media.tenor.com/dBhkvdJzmmsAAAAC/anime-hit-head.gif"
        ];

        const rastgeleGif = gifler[Math.floor(Math.random() * gifler.length)];

        message.channel.send({
            content: `😆 ${message.author} ${hedef} kişisinin kafasına vurdu!`,
            files: [rastgeleGif]
        });
    }
};
