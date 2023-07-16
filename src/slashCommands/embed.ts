import {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
  ColorResolvable,
} from 'discord.js';
import { SlashCommand } from '../types';
import { genericErrorMessage } from '../utils/errors';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Cria um novo embed.')
    .addStringOption((option) =>
      option
        .setName('título')
        .setDescription('Título do embed')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('descrição')
        .setDescription('Descrição do embed.')
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('canal')
        .setDescription('Canal de texto que o embed será enviado.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('cor')
        .setDescription(
          'Selecione uma opção ou digite uma cor em hex, por exemplo: #000000'
        )
        .setRequired(true)
        .setAutocomplete(true)
    ),
  autocomplete: async (interaction) => {
    try {
      const focusedValue = interaction.options.getFocused();
      const choices = [
        { name: 'Branco', value: 'White' },
        { name: 'Aqua', value: 'Aqua' },
        { name: 'Verde', value: 'Green' },
        { name: 'Azul', value: 'Blue' },
        { name: 'Amarelo', value: 'Yellow' },
        { name: 'Roxo', value: 'Purple' },
        { name: 'RosaVívidoClaro', value: 'LuminousVividPink' },
        { name: 'Fuchsia', value: 'Fuchsia' },
        { name: 'Ouro', value: 'Gold' },
        { name: 'Laranja', value: 'Orange' },
        { name: 'Vermelho', value: 'Red' },
        { name: 'Cinza', value: 'Grey' },
        { name: 'Navy', value: 'Navy' },
        { name: 'AquaEscuro', value: 'DarkAqua' },
        { name: 'VerdeEscuro', value: 'DarkGreen' },
        { name: 'AzulEscuro', value: 'DarkBlue' },
        { name: 'RoxoEscuro', value: 'DarkPurple' },
        { name: 'DarkVividPink', value: 'DarkVividPink' },
        { name: 'OuroEscuro', value: 'DarkGold' },
        { name: 'LaranjaEscuro', value: 'DarkOrange' },
        { name: 'VermelhoEscuro', value: 'DarkRed' },
        { name: 'CinzaEscuro', value: 'DarkGrey' },
        { name: 'CinzaBemEscuro', value: 'DarkerGrey' },
        { name: 'CinzaClaro', value: 'LightGrey' },
        { name: 'NavyEscuro', value: 'DarkNavy' },
      ];
      let filtered: { name: string; value: string }[] = [];
      for (let i = 0; i < choices.length; i++) {
        const choice = choices[i];
        if (choice.name.includes(focusedValue)) filtered.push(choice);
      }
      await interaction.respond(filtered);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  },
  execute: async (interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const options: { [key: string]: string | number | boolean } = {};
      if (!interaction.options)
        return interaction.editReply(genericErrorMessage);
      for (let i = 0; i < interaction.options.data.length; i++) {
        const element = interaction.options.data[i];
        if (element.name && element.value)
          options[element.name] = element.value;
      }
      const embed = new EmbedBuilder()
        .setColor(options.color.toString() as ColorResolvable)
        .setTitle(options.title.toString())
        .setDescription(options.description.toString())
        .setAuthor({
          name: interaction.client.user?.username || 'Default Name',
          iconURL: interaction.client.user?.avatarURL() || undefined,
        })
        .setThumbnail(interaction.client.user?.avatarURL() || null)
        .setTimestamp()
        .setFooter({
          text: 'Menssagem de teste do embed',
          iconURL: interaction.client.user?.avatarURL() || undefined,
        });
      let selectedTextChannel = interaction.channel?.client.channels.cache.get(
        options.channel.toString()
      ) as TextChannel;
      selectedTextChannel.send({ embeds: [embed] });
      return interaction.editReply({
        content: 'Embed enviado com sucesso.',
      });
    } catch (error) {
      interaction.editReply(genericErrorMessage);
    }
  },
  cooldown: 10,
};

export default command;
