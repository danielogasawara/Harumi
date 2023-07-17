import { Guild } from 'discord.js';
import { BotEvent } from '../types';
import { deleteGuildFromDatabase } from '../functions';

const event: BotEvent = {
  name: 'guildDelete',
  execute: (guild: Guild) => {
    let deletedGuildId = guild.id;
    deleteGuildFromDatabase(deletedGuildId);
  },
};

export default event;
