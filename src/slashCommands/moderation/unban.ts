import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { genericErrorMessage } from '../../utils/errors';
import wait from '../../utils/wait';

async function unban(interaction: ChatInputCommandInteraction<CacheType>) {
  const userId = interaction.options.getString('usuário', true);
  try {
    const searchResult = await interaction.guild?.bans.fetch(userId)!;
    const user = searchResult.user;
    const reason = interaction.options.getString('motivo', true);
    const userAvatar = interaction.user.avatarURL({
      extension: 'webp',
      forceStatic: true,
    });
    const embedImage =
      'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejVrazM5a2NmZnk2NnpvdDZkb2lkM3psZm94azQwYmRzZnQ3anlzaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FAQWSPyLwBZqrHsdFR/giphy.gif';
    const embed = new EmbedBuilder()
      .setTitle(`${user.username} foi desbanido!`)
      .setThumbnail(user.avatarURL({ extension: 'webp' }))
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
      .unban(user, reason)
      .then(async () => {
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      })
      .catch(async (error) => {
        await interaction.reply({
          content: genericErrorMessage.reply,
          ephemeral: true,
        });
        if (error instanceof Error) {
          console.error(`Erro: ${error.message}`);
        }
        console.error(genericErrorMessage.unknown, error);
        return;
      });
  } catch (error) {
    await interaction.reply({
      content: `O usuário com id \`${userId}\` não existe ou não está banido.`,
      ephemeral: true,
    });
    await wait(15000);
    await interaction.deleteReply();
    return;
  }
}

export default unban;
