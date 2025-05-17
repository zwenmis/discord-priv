const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
} = require('discord.js');

module.exports = {
    name: "sil",
    aliases: ["temizle"],

    execute: async (client, message) => {
        // Yetki kontrolü
        if (
            !message.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
            !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
        ) {
            return message.reply({ content: "Bu komutu kullanmak için yetkin yok." }).then(msg =>
                setTimeout(() => msg.delete().catch(() => {}), 5000)
            );
        }

        // Butonlar
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('delete_10')
                .setLabel('10 Mesaj')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('delete_20')
                .setLabel('20 Mesaj')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('delete_30')
                .setLabel('30 Mesaj')
                .setStyle(ButtonStyle.Danger)
        );

        const sentMessage = await message.channel.send({
            content: "Kaç mesaj silmek istiyorsun?",
            components: [row]
        });

        const collector = sentMessage.createMessageComponentCollector({
            time: 15000
        });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: "Bu butonları sadece komutu kullanan kişi kullanabilir.", ephemeral: true });
            }

            let amount = 0;
            if (interaction.customId === 'delete_10') amount = 10;
            else if (interaction.customId === 'delete_20') amount = 20;
            else if (interaction.customId === 'delete_30') amount = 30;

            await message.channel.bulkDelete(amount, true).catch(err => {
                return interaction.reply({ content: "Mesajlar silinirken bir hata oluştu." });
            });

            await interaction.reply({ content: `Başarıyla **${amount}** mesaj silindi.`, ephemeral: true });
            collector.stop(); // butonları devre dışı bırak
        });

        collector.on('end', () => {
            // Süre dolunca butonları devre dışı bırak
            sentMessage.edit({ components: [] }).catch(() => {});
        });
    }
};
