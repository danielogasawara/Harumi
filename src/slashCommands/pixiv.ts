import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { IAutocompleteChoice, SlashCommand } from '../types';
import pixiv, { pixivLogo } from '../services/pixiv';
import { genericErrorMessage } from '../utils/errors';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('pixiv')
    .setDescription('Envia uma imagem do pixiv.')
    .addStringOption((option) =>
      option
        .setName('pesquisar')
        .setDescription('Digite o que deseja pesquisar no pixiv.')
        .setMinLength(2)
        .setMaxLength(60)
        .setAutocomplete(true)
        .setRequired(true)
    ),
  autocomplete: async (interaction) => {
    const focusedValue = interaction.options.getFocused();
    let choices: Array<IAutocompleteChoice> = [];

    if (focusedValue.length > 0) {
      console.log(focusedValue);
      let results = await pixiv.predict(focusedValue);
      choices = results.map((tag) => {
        const autocompleteString = tag.tag_translation
          ? `🇯🇵 ${tag.tag_name} » 🇺🇸 ${tag.tag_translation}`
          : `🇺🇸 ${tag.tag_name}`;
        const choice = { name: autocompleteString, value: tag.tag_name };

        return choice;
      });
    }
    await interaction.respond(
      choices.map((choice) => ({ name: choice.name, value: choice.value }))
    );
  },
  execute: async (interaction) => {
    try {
      await interaction.deferReply();

      const input = interaction.options.getString('pesquisar', true);
      const searchResult = await pixiv.search(input, 'safe');

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
