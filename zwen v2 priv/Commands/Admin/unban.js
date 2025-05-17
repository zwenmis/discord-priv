const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "unban",
  aliases: [],
  description: "Belirtilen ID'ye sahip kullanıcıyı sunucudan banını kaldırır.",
  usage: ".unban kullanıcıID",
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız.");
    }

    const userId = args[0];
    if (!userId) return message.reply("Lütfen banını kaldırmak istediğiniz kullanıcının ID'sini yazın!");

    try {
      await message.guild.bans.remove(userId);
      message.channel.send(`Banı kaldırıldı: \`${userId}\``);
    } catch (error) {
      message.reply("Banı kaldırırken bir hata oluştu veya kullanıcı banlı değil.");
    }
  }
};
