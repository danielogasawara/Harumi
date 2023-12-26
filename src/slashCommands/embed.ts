import {
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
  ColorResolvable,
  ChannelType,
} from 'discord.js';
import { SlashCommand } from '../types';
import { genericErrorMessage } from '../utils/errors';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Cria um novo embed.')
    .setDMPermission(false)
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
        .addChannelTypes(ChannelType.GuildText)
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
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
      console.error(genericErrorMessage.unknown, error);
    }
  },
  execute: async (interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const options = {
        title: interaction.options.getString('título', true),
        description: interaction.options.getString('descrição', true),
        channel: interaction.options.getChannel('canal', true) as TextChannel,
        color: interaction.options.getString('cor', true) as ColorResolvable,
      };

      const embed = new EmbedBuilder()
        .setTitle(options.title)
        .setDescription(options.description)
        .setColor(options.color);

      await options.channel.send({ embeds: [embed] });

      await interaction.editReply('Embed enviado!');
    } catch (error) {
      interaction.editReply(genericErrorMessage.reply);
    }
  },
  cooldown: 10,
};

export default command;
