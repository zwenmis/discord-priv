module.exports = {
    name: "itiraf",
    aliases: ["confess", "itiraftar"],

    execute: async (client, message) => {
        const itiraflar = [
            "Aslında gizlice sınıf arkadaşımı seviyorum ama hiç söyleyemedim.",
            "Bir keresinde arkadaşımın ödevini kendi ödevim diye verdim.",
            "Annemin yemeğini beğenmeyip gizlice çöpe attım...",
            "Yalnızken ayna karşısında konuşma provaları yapıyorum.",
            "Geceleri gizlice çikolata yiyorum ama kimse bilmiyor 😅",
            "Bir keresinde yanlışlıkla patronuma kalp emojisi attım...",
            "Telefonumu düşürüp ekranı kırdım, ama kardeşimin üstüne attım.",
            "Sırf hava atmak için aslında gitmediğim bir yere gitmiş gibi yaptım.",
            "Bazen arkadaşlarıma yalan söylüyorum, sırf yalnız kalmamak için.",
            "Bir keresinde okuldan kaçıp bütün gün evde yattım 😴"
        ];

        const random = itiraflar[Math.floor(Math.random() * itiraflar.length)];

        return message.channel.send({
            content: `🗣️ **İtiraf:** ${random}`
        });
    }
};
