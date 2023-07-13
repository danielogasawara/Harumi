import {
  EmbedBuilder,
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
    .setDescription('Comandos para moderação do servidor.')
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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('expulsar')
        .setDescription('Expulsa um usuário do seu servidor.')
        .addUserOption((option) => {
          return option
            .setName('usuário')
            .setDescription('Usuário que deseja expulsar.')
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName('motivo')
            .setDescription('Motivo por trás da expulsão.');
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
      case 'expulsar':
        const target = interaction.options.getUser('usuário', true);
        if (target.id === interaction.user.id) {
          interaction.reply({
            content: 'Você não pode expulsar a si mesmo.',
            ephemeral: true,
          });
          await wait(10000);
          interaction.deleteReply();
          return;
        }
        const reason =
          interaction.options.getString('motivo', false) ??
          'Motivo não especificado.';
        const embedImage =
          'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2xtNXNyZWswdzVhdXQ0OWd0Y3VubGNvZ2RjcHQwbDU5aHUzZ3R0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AzXeweAMR6OBT1LUxy/giphy.gif';
        const embed = new EmbedBuilder()
          .setTitle(`${target.username} foi expulso(a)!`)
          .setThumbnail(target.avatarURL())
          .setColor('#35c1c8')
          .setFields([
            {
              name: '🪪 Usuário',
              value: `\`${target.username}\``,
            },
            {
              name: '📜 Motivo',
              value: reason,
            },
          ])
          .setImage(embedImage)
          .setFooter({
            iconURL: interaction.user.avatarURL({
              extension: 'webp',
              forceStatic: true,
            })!,
            text: interaction.user.username,
          });

        return interaction.guild?.members
          .kick(target)
          .then(() => interaction.reply({ embeds: [embed] }))
          .catch((error) => {
            interaction.reply(genericErrorMessage);
            console.error(error);
          });
      default:
        return interaction.reply({ content: genericErrorMessage });
    }
  },
};

export default command;
