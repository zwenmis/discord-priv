const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');

module.exports = {
  name: "mute",
  description: "Kullanıcıyı metin kanallarında mute veya unmute eder.",
  usage: ".mute @kullanıcı",
  async execute(client, message, args) {
    if (!message.member.permissions.has('ModerateMembers')) 
      return message.reply("Yeterli yetkin yok!");

    const user = message.mentions.members.first();
    if (!user) return message.reply("Lütfen bir kullanıcı etiketle!");

    // Muted rolünü bul (sunucunda mutlaka olmalı)
    const mutedRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === "muted");
    if (!mutedRole) return message.reply("Sunucuda 'Muted' rolü yok!");

    const embed = new EmbedBuilder()
      .setTitle("Mute Sistemi")
      .setDescription(`Butonlardan metin kanallarında kullanıcıyı sustur veya susturmayı kaldır.`)
      .setColor("Orange");

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('text_mute')
          .setLabel('Metin Kanallarında Sustur')
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId('text_unmute')
          .setLabel('Metin Kanallarında Susturmayı Kaldır')
          .setStyle(ButtonStyle.Success)
      );

    const msg = await message.channel.send({ embeds: [embed], components: [buttons] });

    const collector = msg.createMessageComponentCollector({ time: 15000 });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: "Bu butonu sadece komutu kullanan kişi kullanabilir.", ephemeral: true });
      }

      if (interaction.customId === 'text_mute') {
        if (user.roles.cache.has(mutedRole.id)) {
          await interaction.reply({ content: "Kullanıcı zaten susturulmuş.", ephemeral: true });
        } else {
          await user.roles.add(mutedRole);
          await interaction.reply({ content: `${user} metin kanallarında susturuldu.` });
        }
      }

      if (interaction.customId === 'text_unmute') {
        if (!user.roles.cache.has(mutedRole.id)) {
          await interaction.reply({ content: "Kullanıcı zaten susturulmamış.", ephemeral: true });
        } else {
          await user.roles.remove(mutedRole);
          await interaction.reply({ content: `${user} metin kanallarındaki susturması kaldırıldı.` });
        }
      }
    });

    collector.on('end', () => {
      msg.edit({ components: [] });
    });
  }
};
