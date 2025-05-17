const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "duyuru",
  aliases: ["announce"],
  description: "Belirtilen kanala duyuru yapar.",
  usage: ".duyuru #kanal mesajınız",
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız.");
    }

    const channel = message.mentions.channels.first();
    if (!channel) return message.reply("Lütfen bir kanal etiketleyin! Örnek: `.duyuru #genel Duyuru mesajı`");

    const duyuruMesaji = args.slice(1).join(" ");
    if (!duyuruMesaji) return message.reply("Lütfen duyuru mesajını yazın.");

    const embed = new EmbedBuilder()
      .setTitle("📢 Duyuru")
      .setDescription(duyuruMesaji)
      .setColor("#FF0000")
      .setFooter({ text: `Duyuru: ${message.author.tag}` })
      .setTimestamp();

    channel.send({ embeds: [embed] });
    message.channel.send("Duyuru gönderildi!");
  }
};
