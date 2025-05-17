    const { Client, Partials, GatewayIntentBits, Events, EmbedBuilder, ActivityType, Collection, ChannelType, PermissionsBitField } = require('discord.js');
    const { joinVoiceChannel } = require('@discordjs/voice');
    const system = require('./System');
    const { readdir } = require('fs');
    const room = require('./Schema/Room');

    const linkCooldowns = new Map();
    const reklamCooldowns = new Map();

    const client = global.client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });

    const commands = client.commands = new Collection();
    const aliases = client.aliases = new Collection();
    readdir("./Commands/", (err, folders) => {
        if (err) console.error(err);
        folders.forEach(f => {
            readdir(`./Commands/${f}`, (err2, files) => {
                if (err2) console.error(err2);
                files.forEach(file => {
                    let ertucum = require(`./Commands/${f}/${file}`);
                    if (!ertucum?.name) {
                        console.log(`[KOMUT] ${file} YÜKLENEMEDİ! (name eksik)`);
                        return;
                    }
                    console.log(`[KOMUT] ${ertucum.name} Yüklendi!`);
                    commands.set(ertucum.name, ertucum);
                    if (Array.isArray(ertucum.aliases)) {
                        ertucum.aliases.forEach(alias => aliases.set(alias, ertucum.name));
                    }
                });
            });
        });
    });

    readdir("./Events/", (err, files) => {
        if (err) console.error(err);
        files.forEach(f => {
            require(`./Events/${f}`);
            console.log(`[EVENT] (${f.replace(".js", "")})`)
        });
    });

    client.on(Events.ClientReady, async () => {
        client.user.setActivity({ name: 'Zwen was here ❤️', type: ActivityType.Listening });
        client.user.setStatus('dnd');

        const channel = client.channels.cache.get(system.botVoiceChannelId);
        let vcStatus = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            group: client.user.id,
            selfDeaf: true,
            selfMute: true
        });

        vcStatus.on('error', (err) => {
            console.log(err);
            vcStatus.rejoin();
        });

        setInterval(async () => {
            const secretRooms = client.guilds.cache.get(system.guildId).channels.cache
                .filter((channel) => channel.parentId === system.parentId && channel.type === ChannelType.GuildVoice && channel.id !== system.voiceChannelId)
                .map((channel) => channel);

            secretRooms.forEach(async (x) => {
                const channel = client.channels.cache.get(x.id);
                if (channel?.id === system.voiceChannelId) return;
                if (channel && channel.members.size === 0) {
                    await channel.delete().catch(() => { });
                    await room.deleteOne({ id: x.id }).catch(() => { });
                }
            });
        }, 10000);

        console.log(`[BOT] ${client.user.tag} olarak giriş yaptı!`);
    });

    client.on(Events.MessageCreate, async (message) => {
        if (!message.guild || message.author.bot) return;

        const reklamRegex = /discord\.gg\/\w+|discordapp\.com\/invite\/\w+/gi;
        if (reklamRegex.test(message.content) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            if (!reklamCooldowns.has(message.author.id)) reklamCooldowns.set(message.author.id, 1);
            else reklamCooldowns.set(message.author.id, reklamCooldowns.get(message.author.id) + 1);

            if (reklamCooldowns.get(message.author.id) >= 5) {
                message.member.timeout(300000);
                reklamCooldowns.delete(message.author.id);
            } else {
                message.delete();
                message.channel.send(`${message.author}, reklam yapmak yasaktır!`).then(s => setTimeout(() => s.delete().catch(() => {}), 5000));
            }
            return;
        }

        const linkRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;
        if (linkRegex.test(message.content) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            if (!linkCooldowns.has(message.author.id)) linkCooldowns.set(message.author.id, 1);
            else linkCooldowns.set(message.author.id, linkCooldowns.get(message.author.id) + 1);

            if (linkCooldowns.get(message.author.id) >= 5) {
                message.member.timeout(300000);
                linkCooldowns.delete(message.author.id);
            } else {
                message.delete();
                message.channel.send(`${message.author}, linkler yasaktır!`).then(s => setTimeout(() => s.delete().catch(() => {}), 5000));
            }
            return;
        }

        if (!message.content.startsWith(system.prefix)) return;
        const args = message.content.slice(system.prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
        if (cmd) {
            try {
                cmd.execute(client, message, args);
            } catch (err) {
                console.error(err);
                message.reply("Komutu çalıştırırken bir hata oluştu.");
            }
        }
    });

    const mongoose = require("mongoose");
    mongoose.connect(system.mongoURL).then(() => {
        console.log("[BOT] MongoDB bağlandı!");
    }).catch((err) => {
        throw err;
    });

    client.login(system.token);
