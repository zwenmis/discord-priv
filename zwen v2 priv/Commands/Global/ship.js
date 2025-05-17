module.exports = {
  name: "ship",
  aliases: [],
  execute(client, message, args) {
    const shipper = message.author; // Komutu yazan kişi

    // Sunucudan bot olmayan üyeleri alalım
    const members = message.guild.members.cache.filter(member => !member.user.bot && member.id !== shipper.id);

    let user2;

    if (message.mentions.users.size > 0) {
      user2 = message.mentions.users.first();
    } else {
      // Etiket yoksa random biri seç
      if (members.size === 0) return message.reply("Sunucuda başka kullanıcı yok.");
      user2 = members.random().user;
    }

    const percent = Math.floor(Math.random() * 101);
    const bar = "❤️".repeat(Math.floor(percent / 10)) + "🖤".repeat(10 - Math.floor(percent / 10));

    let yorum = "Olmaz bu iş ❌";
    if (percent > 80) yorum = "Gerçek aşk bu 💍";
    else if (percent > 60) yorum = "Tatlı çift 😍";
    else if (percent > 40) yorum = "Belki bir şans 🤔";
    else if (percent > 20) yorum = "Zor gibi 🙄";

    message.channel.send(`💘 **${shipper.username}** + **${user2.username}** = **%${percent}** uyum!\n${bar}\n${yorum}`);
  }
};
