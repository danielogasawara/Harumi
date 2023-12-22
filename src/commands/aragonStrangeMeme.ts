import { Command } from '../types';

const command: Command = {
  name: 'strange',
  execute: (message) => {
    message.channel.send({
      content:
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3I4cjh5cWluMTRqY3EzMDVybTRrMXdseXc3NDlrZmh2aTgxbnNibSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qPZZQEpS5INO9YknDB/giphy.gif',
    });
  },
  permissions: [],
  aliases: ['aragon-strange', 'lolicon'],
  cooldown: 10,
};

export default command;
