import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { SlashCommand } from '../types';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('moderação')
    .setDescription('Comandos que precisam da permissão de administrador.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('apagar')
        .setDescription('Apaga as mensagens do chat.')
        .addNumberOption((option) => {
          return option
            .setName('quantidade')
            .setRequired(true)
            .setMinValue(1)
            .setDescription('Quantidade de mensagens para serem apagadas.');
        })
    ),
  execute: async (interaction) => {
    const subcommandName = interaction.options.getSubcommand(true);
    switch (subcommandName) {
      case 'apagar':
        try {
          const limit = interaction.options.getNumber('quantidade', true);
          const channel = interaction.channel;
          const messagesInChannel = await interaction.channel?.messages.fetch({
            limit: limit,
          });

          if (messagesInChannel?.size === 0)
            return interaction.reply({
              content: 'Não há mensagens para apagar.',
              ephemeral: true,
            });

          if (channel instanceof TextChannel) {
            channel.bulkDelete(limit).finally(() =>
              interaction.reply({
                content: 'Mensagem(ns) apagadas!',
                ephemeral: true,
              })
            );
          }
        } catch (error) {
          interaction.reply({
            content: 'Algo deu errado...',
            ephemeral: true,
          });
        }
        break;

      default:
        interaction.reply({ content: 'Algo deu errado...' });
        break;
    }
  },
};

export default command;
