const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "yardım",
    aliases: ["help", "komutlar"],

    execute: async (client, message) => {
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("yardim_menu")
                .setPlaceholder("📂 Komut kategorisi seç")
                .addOptions([
                    {
                        label: "👤 Üye Komutları",
                        description: "Üyelerin kullanabileceği komutlar",
                        value: "uye"
                    },
                    {
                        label: "🛠️ Yetkili Komutları",
                        description: "Yetkililere özel komutlar",
                        value: "yetkili"
                    }
                ])
        );

        const anaEmbed = new EmbedBuilder()
            .setTitle("📘 Yardım Menüsü")
            .setDescription("Aşağıdan bir kategori seçerek detaylı komut listesini görebilirsin.")
            .setColor("Blue");

        const msg = await message.channel.send({
            embeds: [anaEmbed],
            components: [row]
        });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async interaction => {
            let value = interaction.values[0];
            const uyeEmbed = new EmbedBuilder()
                .setTitle("👤 Üye Komutları")
                .setDescription(`
📸 \`.avatar\` - Kullanıcının avatarını göster  
🖼️ \`.banner\` - Banner'ını göster   
💍 \`.evlen @kişi\` - Evlilik teklifi gönder  
💑 \`.evlilik\` - Evlilik durumunu göster  
🧮 \`.hesap\` - Hesap makinesi  
🗣️ \`.itiraf\` - Rastgele itiraf  
❤️ \`.ship @1 @2\` - Uyumluluk hesaplar  
👋 \`.vur @kişi\` - Anime tokat gif  
ℹ️ \`.yardım\` - Yardım menüsünü göster
🏓 \`.ping\` - Botun pingini ögren
❤️ \`.hoslandigim\` - aşk  
                `)
                .setColor("Green");

            const yetkiliEmbed = new EmbedBuilder()
                .setTitle("🛠️ Yetkili Komutları")
                .setDescription(`
🔨 \`.ban @kullanıcı\` - Sunucudan banlar  
🔓 \`.unban ID\` - Ban kaldırır  
🗣️ \`.mute @kullanıcı\` - Susturur  
🔊 \`.say\` - Sunucu istatistiklerini göster  
📤 \`.nuke\` - Kanalı sıfırlar (DİKKATLİ!) 
🔓 \`.unlock\` - Kanalı acar
🔐 \`.Vip @rol\` - VİP rolü ekler  
📋 \`.registerbuton\` - Kayıt sistemi  
💬 \`.ozel-oda\` - Özel oda oluşturur  
🧹 \`.sil [sayı]\` - Mesaj siler
📢 \`.duyuru\` - Embedli duyuru yapar
🔒\`.lock\` - Kanalı kitler
                `)
                .setColor("Red");

            if (value === "uye") {
                await interaction.update({ embeds: [uyeEmbed], components: [row] });
            } else if (value === "yetkili") {
                await interaction.update({ embeds: [yetkiliEmbed], components: [row] });
            }
        });

        collector.on("end", () => {
            msg.edit({ components: [] }).catch(() => {});
        });
    }
};
