module.exports = {
    name: "ping",
    aliases: [],
    description: "Botun gecikme süresini gösterir.",
    execute: async (client, message, args) => {
        const msg = await message.channel.send("🏓 Ping hesaplanıyor...");
        const latency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        msg.edit(`🏓 Pong!\nMesaj Gecikmesi: **${latency}ms**\nAPI Gecikmesi: **${apiLatency}ms**`);
    }
};
