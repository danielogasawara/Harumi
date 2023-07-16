import {
  CacheType,
  ChatInputCommandInteraction,
  TextChannel,
} from 'discord.js';
import { genericErrorMessage } from '../../utils/errors';
import wait from '../../utils/wait';

async function clear(interaction: ChatInputCommandInteraction<CacheType>) {
  const limit = interaction.options.getNumber('quantidade', true);
  const channel = interaction.channel;
  const messagesInChannel = await interaction.channel?.messages.fetch({
    limit: limit,
  });

  if (messagesInChannel?.size === 0) {
    await interaction.reply({
      content: 'Não há mensagens para apagar.',
      ephemeral: true,
    });
    return;
  }

  if (channel instanceof TextChannel) {
    channel
      .bulkDelete(limit, true)
      .then(async (messages) => {
        if (messages.size === 0) {
          await interaction.reply({
            content: 'Mensagens com mais de 14 dias não puderam ser apagadas.',
            ephemeral: true,
          });
          await wait(10000);
          await interaction.deleteReply();
          return;
        } else {
          await interaction.reply({
            content: `${messages.size} mensagem(ns) apagada(s) com sucesso!`,
            ephemeral: true,
          });
          await wait(10000);
          await interaction.deleteReply();
          return;
        }
      })
      .catch(async (error) => {
        await interaction.reply({
          content: genericErrorMessage,
        });
        console.error(error);
        return;
      });
  }
}

export default clear;
