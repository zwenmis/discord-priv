const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unlock",
  aliases: ["kilitaç", "kanalaç"],
  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply("❌ Bu komutu kullanmak için `Kanalları Yönet` yetkisine sahip olmalısın!");
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: true
      });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🔓 Kanal Açıldı")
        .setDescription(`${channel} kanalı artık mesaj gönderimine açık.`)
        .setFooter({ text: `Kanal: ${channel.name}` })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("Kanal açılırken hata oluştu:", err);
      message.reply("❌ Kanal açılırken bir hata oluştu.");
    }
  }
};
