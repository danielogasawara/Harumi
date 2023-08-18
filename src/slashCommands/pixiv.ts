import {
  AttachmentBuilder,
  ChannelType,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { IAutocompleteChoice, SlashCommand } from '../types';
import PixivInstance from '../instances/PixivInstance';
import { genericErrorMessage } from '../utils/errors';
import { randomInt } from 'crypto';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('pixiv')
    .setDescription('Envia uma imagem do pixiv.')
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
    .addIntegerOption((option) =>
      option
        .setName('ia')
        .setDescription(
          'Permitir que imagens geradas por I.A apareçam nos resultados.'
        )
        .setChoices({ name: 'Sim', value: 1 }, { name: 'Não', value: 0 })
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('nsfw')
        .setDescription(
          'Define que apareça apenas imagens 18+. (Apenas pode ser usado em canais NSFW.)'
        )
        .setChoices({ name: 'Sim', value: 1 }, { name: 'Não', value: 0 })
    ),
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

      const optionsValue = {
        input: interaction.options.getString('pesquisar', true),
        ai: Boolean(interaction.options.getInteger('ia', true)),
        mode: Boolean(interaction.options.getInteger('nsfw')),
      };

      if (interaction.channel?.type === ChannelType.GuildText) {
        if (!interaction.channel.nsfw && optionsValue.mode) {
          await interaction.deleteReply();
          await interaction.followUp({
            content:
              'Você só pode pedir imagens NSFW em canais específicos para isso!',
            ephemeral: true,
          });
          return;
        }
      }

      const searchResult = await PixivInstance.getIllustByTag(
        optionsValue.input,
        {
          mode: optionsValue.mode ? 'r18' : 'safe',
          ai: optionsValue.ai,
        }
      );

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
          { name: '🤖 I.A', value: artwork.AI ? 'Sim' : 'Não', inline: true }
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
