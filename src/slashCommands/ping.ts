import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Mostra a latência do bot."),
  execute: (interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: "Harumi" })
          .setDescription(`🏓 Pong!\n📡 Ping: ${interaction.client.ws.ping} ms`)
          .setColor("#35c1c8"),
      ],
    });
  },
  cooldown: 10,
};

export default command;
