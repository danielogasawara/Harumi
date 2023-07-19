import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../types';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra a latência do bot.')
    .setDMPermission(false),
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Harumi' })
      .setDescription(`🏓 Pong!\n📡 Ping: ${interaction.client.ws.ping} ms`)
      .setColor('#35c1c8');

    await interaction.reply({
      embeds: [embed],
    });
    return;
  },
  cooldown: 10,
};

export default command;
