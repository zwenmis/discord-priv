const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ban",
  aliases: [],
  description: "Belirtilen kullanıcıyı sunucudan banlar.",
  usage: ".ban @kullanıcı sebep",
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("Lütfen banlamak istediğiniz kullanıcıyı etiketleyin!");

    if (!user.bannable) return message.reply("Bu kullanıcıyı banlayamam!");

    const reason = args.slice(1).join(" ") || "Belirtilmedi";

    await user.ban({ reason }).catch(err => {
      return message.reply("Kullanıcı banlanırken bir hata oluştu.");
    });

    message.channel.send(`${user.user.tag} kullanıcısı banlandı. Sebep: ${reason}`);
  }
};
