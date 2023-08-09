import {
  Client,
  Collection,
  BitFieldResolvable,
  IntentsBitField,
  GatewayIntentsString,
  Partials,
} from 'discord.js';

const intents = Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
  GatewayIntentsString,
  number
>;
const client = new Client({
  intents: [intents],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
});

import { Command, SlashCommand } from './types';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
config();

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, './handlers');
readdirSync(handlersDir).forEach((handler) => {
  require(`${handlersDir}/${handler}`)(client);
});

client.login(process.env.BOT_TOKEN);
