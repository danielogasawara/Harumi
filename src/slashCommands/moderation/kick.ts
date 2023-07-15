import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import wait from '../../utils/wait';
import { genericErrorMessage } from '../../utils/errors';

async function kick(interaction: ChatInputCommandInteraction<CacheType>) {
  const target = interaction.options.getUser('usuário', true);
  if (target.id === interaction.user.id) {
    await interaction.reply({
      content: 'Você não pode expulsar a si mesmo.',
      ephemeral: true,
    });
    await wait(10000);
    await interaction.deleteReply();
    return;
  }
  const reason =
    interaction.options.getString('motivo', false) ??
    'Motivo não especificado.';
  const embedImage =
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2xtNXNyZWswdzVhdXQ0OWd0Y3VubGNvZ2RjcHQwbDU5aHUzZ3R0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AzXeweAMR6OBT1LUxy/giphy.gif';
  const embed = new EmbedBuilder()
    .setTitle(`${target.username} foi expulso(a)!`)
    .setThumbnail(target.avatarURL({ extension: 'webp' }))
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

  interaction.guild?.members
    .kick(target)
    .then(async () => await interaction.reply({ embeds: [embed] }))
    .catch(async (error) => {
      await interaction.reply(genericErrorMessage);
      console.error(error);
    });
  return;
}

export default kick;
