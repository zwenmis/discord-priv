const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require('discord.js');

module.exports = {
    name: "hesap",
    aliases: ["calc", "calculator"],

    execute: async (client, message) => {
        let current = "";

        const createButton = (label, style = ButtonStyle.Secondary, id = null) =>
            new ButtonBuilder()
                .setLabel(label)
                .setStyle(style)
                .setCustomId(id || label);

        // Rakamlar ve işlemler
        const rows = [
            new ActionRowBuilder().addComponents(
                createButton("7"), createButton("8"), createButton("9"), createButton("/", ButtonStyle.Primary)
            ),
            new ActionRowBuilder().addComponents(
                createButton("4"), createButton("5"), createButton("6"), createButton("*", ButtonStyle.Primary)
            ),
            new ActionRowBuilder().addComponents(
                createButton("1"), createButton("2"), createButton("3"), createButton("-", ButtonStyle.Primary)
            ),
            new ActionRowBuilder().addComponents(
                createButton("0"), createButton("."), createButton("=", ButtonStyle.Success), createButton("+", ButtonStyle.Primary)
            ),
            new ActionRowBuilder().addComponents(
                createButton("C", ButtonStyle.Danger, "clear"), createButton("Sil", ButtonStyle.Danger, "delete")
            )
        ];

        const display = await message.channel.send({
            content: "```\n0\n```",
            components: rows
        });

        const collector = display.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on("collect", async (interaction) => {
            await interaction.deferUpdate();

            const value = interaction.customId;

            if (value === "clear") {
                current = "";
            } else if (value === "delete") {
                current = current.slice(0, -1);
            } else if (value === "=") {
                try {
                    current = eval(current).toString();
                } catch {
                    current = "Hatalı işlem";
                }
            } else {
                if (current === "0" || current === "Hatalı işlem") current = "";
                current += value;
            }

            display.edit({
                content: `\`\`\`\n${current || "0"}\n\`\`\``,
                components: rows
            });
        });

        collector.on("end", () => {
            display.edit({ components: [] }).catch(() => {});
        });
    }
};
