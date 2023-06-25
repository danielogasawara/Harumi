import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../types';
import pixiv, { getArtwork, search } from '../utils/pixiv';

interface PixivEmbed {
  author: string;
  dimensions: string;
}

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('pixiv')
    .setDescription('Envia uma imagem do pixiv.')
    .addStringOption((option) => {
      return option
        .setName('pesquisar')
        .setDescription('Digite o que deseja pesquisar no pixiv.')
        .setRequired(true);
    }),
  execute: async (interaction) => {
    try {
      await interaction.deferReply();

      const input = interaction.options.getString('pesquisa');
      const searchResult = input ? await search(input, 'safe') : false;
      const artwork = searchResult ? await getArtwork(searchResult) : false;
      const imageOfArtwork = artwork
        ? await pixiv.download(new URL(artwork.urls[0].regular))
        : false;

      if (!searchResult || !artwork || !imageOfArtwork) {
        return interaction.editReply({ content: 'Algo deu errado...' });
      }

      const embedPresets: PixivEmbed = {
        author: artwork.user.name,
        dimensions: String(`${artwork.height}x${artwork.width}`),
      };

      const image = new AttachmentBuilder(imageOfArtwork, {
        name: 'image.jpg',
        description: undefined,
      });

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('#35c1c8')
            .setTitle(artwork.title)
            .addFields(
              { name: '🎨 Autor', value: embedPresets.author, inline: true },
              {
                name: '📐 Dimensões',
                value: embedPresets.dimensions,
                inline: true,
              }
            )
            .setFooter({
              text: `https://www.pixiv.net/en/artworks/${artwork.illustID})`,
            })
            .setImage('attachment://image.jpg'),
        ],
        files: [image],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({ content: 'Algo deu errado...' });
    }
  },
  cooldown: 10,
};
export default command;
