import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { IAutocompleteChoice, SlashCommand } from '../types';
import { genericErrorMessage } from '../utils/errors';
import PixivInstance from '../instances/PixivInstance';
import { randomInt } from 'crypto';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('pixiv18')
    .setDescription('Envia uma imagem 18+ do pixiv.')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('pesquisar')
        .setDescription('Digite o que deseja pesquisar no pixiv.')
        .setMinLength(2)
        .setMaxLength(80)
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName('ia')
        .setDescription(
          'Permitir que imagens geradas por I.A apareçam nos resultados.'
        )
        .setRequired(true)
    )
    .setNSFW(true),
  autocomplete: async (interaction) => {
    const focusedValue = interaction.options.getFocused();
    let choices: Array<IAutocompleteChoice> = [];

    if (focusedValue.length > 0) {
      let results = await PixivInstance.predict(focusedValue);
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
      const aiOption = interaction.options.getBoolean('ia', true);
      const searchResult = await PixivInstance.getIllustByTag(input, {
        ai: aiOption,
        mode: 'r18',
      });

      if (searchResult.length === 0) {
        await interaction.editReply('Nenhuma imagem encontrada.');
        return;
      }

      const randomArtwork = searchResult[randomInt(0, searchResult.length + 1)];
      const artwork = await PixivInstance.getIllustById(randomArtwork.id);
      const imageOfArtwork = await PixivInstance.download(
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
          iconURL: 'https://i.imgur.com/qm2lhiu.png',
        })
        .setImage('attachment://image.jpg');

      await interaction.editReply({
        embeds: [embed],
        files: [image],
      });
    } catch (error) {
      await interaction.editReply(genericErrorMessage.reply);
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
      console.error(genericErrorMessage.unknown, error);
      return;
    }
  },
  cooldown: 10,
};
export default command;
