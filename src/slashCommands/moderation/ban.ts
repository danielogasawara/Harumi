import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { genericErrorMessage } from '../../utils/errors';

async function ban(interaction: ChatInputCommandInteraction<CacheType>) {
  const target = interaction.options.getUser('usuário', true);
  if (target.id === interaction.user.id) {
    await interaction.reply('Você não pode banir a si mesmo.');
    return;
  }
  const reason = interaction.options.getString('motivo', true);
  const time = interaction.options.getInteger('histórico', true);
  const embedImage =
    'https://media.giphy.com/media/fe4dDMD2cAU5RfEaCU/giphy.gif';
  const embed = new EmbedBuilder()
    .setTitle(`${target.username} foi banido(a)!`)
    .setThumbnail(target.avatarURL())
    .setColor('#35c1c8')
    .setFields([
      { name: '🪪 Usuário', value: `\`${target.username}\`` },
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

  await interaction.guild?.members
    .ban(target, {
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
