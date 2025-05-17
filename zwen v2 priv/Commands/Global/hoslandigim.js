module.exports = {
    name: "hoslandigim",
    aliases: ["hoşlandığım", "aşk", "aşkım", "sevgili"],
    description: "Bot senin hoşlandığın biri olduğunu söylesin 🥰",
    execute(client, message, args) {
        const cevaplar = [
            "💘 Şey... sanırım birinden hoşlanıyorum  simay",
            "🥺 Hoşlandığım biri var ama söyleyemem simay",
            "🙈 Kalbim pıt pıt atıyor... çünkü birinden hoşlanıyorum simay",
            "😳 Galiba âşık oldum simay",
            "❤️‍🔥 Hoşlandığım kişi şu an bu sunucuda olabilir simay"
        ];

        const random = cevaplar[Math.floor(Math.random() * cevaplar.length)];

        message.channel.send(`${message.author} ${random}`);
    }
};
