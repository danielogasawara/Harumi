import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../types';
import pixiv, { pixivLogo } from '../services/pixiv';
import { genericErrorMessage } from '../utils/errors';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('pixiv18')
    .setDescription('Envia uma imagem 18+ do pixiv.')
    .addStringOption((option) =>
      option
        .setName('pesquisar')
        .setDescription('Digite o que deseja pesquisar no pixiv.')
        .setMinLength(2)
        .setMaxLength(60)
        .setRequired(true)
    )
    .setNSFW(true),
  execute: async (interaction) => {
    try {
      await interaction.deferReply();

      const input = interaction.options.getString('pesquisar', true);
      const searchResult = await pixiv.search(input, 'r18');

      if (!searchResult) {
        await interaction.editReply('Nenhuma imagem encontrada.');
        return;
      }

      const artwork = await pixiv.getArtwork(searchResult);
      const imageOfArtwork = await pixiv.download(
        new URL(artwork.urls[0].regular)
      );
      const image = new AttachmentBuilder(imageOfArtwork, {
        name: 'image.jpg',
        description: undefined,
      });
      const embed = new EmbedBuilder()
        .setColor('#35c1c8')
        .setTitle(artwork.title)
        .setFields(
          { name: '🎨 Autor', value: artwork.user.name, inline: true },
          {
            name: '📏 Dimensões',
            value: `${artwork.width}x${artwork.height}`,
            inline: true,
          }
        )
        .setFooter({
          text: `https://www.pixiv.net/en/artworks/${artwork.illustID}`,
          iconURL: pixivLogo,
        })
        .setImage('attachment://image.jpg');

      await interaction.editReply({
        embeds: [embed],
        files: [image],
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply(genericErrorMessage);
      return;
    }
  },
  cooldown: 10,
};
export default command;
