import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { SlashCommand } from '../types';
import { genericErrorMessage } from '../utils/errors';
import { setTimeout as wait } from 'node:timers/promises';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('moderação')
    .setDescription('Comandos que precisam da permissão de administrador.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('limpar')
        .setDescription('Apaga as mensagens do chat.')
        .addNumberOption((option) => {
          return option
            .setName('quantidade')
            .setDescription('Quantidade de mensagens para serem apagadas.')
            .setMinValue(1)
            .setRequired(true);
        })
    ),
  execute: async (interaction) => {
    const subcommandName = interaction.options.getSubcommand(true);
    switch (subcommandName) {
      case 'limpar':
        const limit = interaction.options.getNumber('quantidade', true);
        const channel = interaction.channel;
        const messagesInChannel = await interaction.channel?.messages.fetch({
          limit: limit,
        });

        if (messagesInChannel?.size === 0) {
          return interaction.reply({
            content: 'Não há mensagens para apagar.',
            ephemeral: true,
          });
        }

        if (channel instanceof TextChannel) {
          return channel
            .bulkDelete(limit, true)
            .then(async (messages) => {
              if (messages.size === 0) {
                interaction.reply({
                  content:
                    'Mensagens com mais de 14 dias não puderam ser apagadas.',
                  ephemeral: true,
                });
                await wait(10000);
                interaction.deleteReply();
              } else {
                interaction.reply({
                  content: `${messages.size} mensagem(ns) apagada(s) com sucesso!`,
                  ephemeral: true,
                });
                await wait(10000);
                interaction.deleteReply();
              }
            })
            .catch((reason) => {
              interaction.reply({
                content: genericErrorMessage,
              });
              console.error(reason);
            });
        }
        break;

      default:
        interaction.reply({ content: genericErrorMessage });
        break;
    }
  },
};

export default command;
