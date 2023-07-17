import { PermissionFlagsBits, SlashCommandBuilder, User } from 'discord.js';
import { IAutocompleteChoice, SlashCommand } from '../types';
import { genericErrorMessage } from '../utils/errors';
import { ban, clear, kick, unban } from './moderation/index';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('moderação')
    .setDescription('Comandos para moderação do servidor.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('limpar')
        .setDescription('Apaga as mensagens do chat.')
        .addNumberOption((option) => {
          return option
            .setName('quantidade')
            .setDescription('Quantidade de mensagens para serem apagadas.')
            .setMinValue(1)
            .setRequired(true);
        }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('expulsar')
        .setDescription('Expulsa um usuário do seu servidor.')
        .addUserOption((option) => {
          return option
            .setName('usuário')
            .setDescription('Usuário que deseja expulsar.')
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName('motivo')
            .setDescription('Motivo por trás da expulsão.');
        }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('banir')
        .setDescription('Bane um usuário do servidor.')
        .addUserOption((option) =>
          option
            .setName('usuário')
            .setDescription('Usuário que deseja banir.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('motivo')
            .setDescription('Motivo por trás do banimento.')
            .setAutocomplete(true)
            .setMinLength(4)
            .setMaxLength(512)
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName('deletar_mensagens')
            .setDescription(
              'O quanto do histórico de mensagem desse usuário deve ser apagado.',
            )
            .setChoices(
              { name: 'Não excluir mensagens', value: 0 },
              { name: 'Última hora', value: 3600 },
              { name: 'Últimas 6 horas', value: 21600 },
              { name: 'Últimas 12 horas', value: 43200 },
              { name: 'Últimas 24 horas', value: 86400 },
              { name: 'Últimos 3 dias', value: 259200 },
              { name: 'Últimos 7 dias', value: 604800 },
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('desbanir')
        .setDescription('Remove o banimento de um usuário.')
        .addStringOption((option) =>
          option
            .setName('usuário')
            .setDescription('Usuário que deseja desbanir.')
            .setAutocomplete(true)
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('motivo')
            .setDescription('Motivo por trás do desbanimento.')
            .setRequired(true),
        ),
    ),
  autocomplete: async (interaction) => {
    const focusedValue = interaction.options.getFocused();
    const subcommand = interaction.options.getSubcommand(true);
    let choices: Array<IAutocompleteChoice> = [];

    switch (subcommand) {
      case 'banir':
        choices = [
          {
            name: 'Conta suspeita ou de spam',
            value: 'Conta suspeita ou de spam',
          },
          {
            name: 'Conta comprometida ou hackeada',
            value: 'Conta comprometida ou hackeada',
          },
          {
            name: 'Quebrando regras do servidor',
            value: 'Quebrando regras do servidor',
          },
        ];
        break;
      case 'desbanir':
        const bannedList = await interaction.guild?.bans.fetch();
        if (!bannedList || bannedList?.size === 0) {
          break;
        }
        const bannedUsers = bannedList.map((item) => item.user);
        choices = bannedUsers.map((user) => ({
          name: user.username,
          value: user.id,
        }));
        break;
      default:
        break;
    }

    const filtered = choices.filter((choice) =>
      choice.name.startsWith(focusedValue),
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice.name, value: choice.value })),
    );
  },
  execute: async (interaction) => {
    const subcommandName = interaction.options.getSubcommand(true);
    switch (subcommandName) {
      case 'limpar':
        await clear(interaction);
        break;
      case 'expulsar':
        await kick(interaction);
        break;
      case 'banir':
        await ban(interaction);
        break;
      case 'desbanir':
        await unban(interaction);
        break;
      default:
        await interaction.reply({ content: genericErrorMessage });
        break;
    }
  },
};

export default command;
