import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { genericErrorMessage } from '../../utils/errors';
import wait from '../../utils/wait';

async function ban(interaction: ChatInputCommandInteraction<CacheType>) {
  const user = interaction.options.getUser('usuário', true);
  if (user.id === interaction.user.id) {
    await interaction.reply({
      content: 'Você não pode banir a si mesmo.',
      ephemeral: true,
    });
    await wait(10000);
    await interaction.deleteReply();
    return;
  }
  const reason = interaction.options.getString('motivo', true);
  const time = interaction.options.getInteger('deletar_mensagens', true);
  const embedImage =
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXZudnFlZm95cGQwN2RtanJ2MDZ4bmM0Y2s4dzRtc2NpYXV2MHZlaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/52j6m814RlDesZlWNd/giphy.gif';
  const userAvatar = interaction.user.avatarURL({
    extension: 'webp',
    forceStatic: true,
  });
  const embed = new EmbedBuilder()
    .setTitle(`${user.username} foi banido(a)!`)
    .setThumbnail(user.avatarURL())
    .setColor('#35c1c8')
    .setFields([
      { name: '🪪 Usuário', value: `\`${user.username}\`` },
      {
        name: '📜 Motivo',
        value: reason,
      },
    ])
    .setImage(embedImage)
    .setFooter({
      iconURL: userAvatar ? userAvatar : undefined,
      text: interaction.user.username,
    });

  interaction.guild?.members
    .ban(user, {
      reason: reason,
      deleteMessageSeconds: time,
    })
    .then(async () => await interaction.reply({ embeds: [embed] }))
    .catch(async (error) => {
      await interaction.reply(genericErrorMessage);
      console.error(error);
    });
  return;
}

export default ban;
