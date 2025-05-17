const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "lock",
  aliases: ["kilitle", "kanalkilit"],
  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply("❌ Bu komutu kullanmak için `Kanalları Yönet` yetkisine sahip olmalısın!");
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false
      });

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🔒 Kanal Kilitlendi")
        .setDescription(`${channel} kanalı mesaj gönderimine kapatıldı.`)
        .setFooter({ text: `Kanal: ${channel.name}` })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("Kanal kilitlenemedi:", err);
      message.reply("❌ Kanal kilitlenirken bir hata oluştu.");
    }
  }
};
