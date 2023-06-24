import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";

const command: Command = {
  name: "teste",
  execute: (message, args) => {
    let toGreet = message.mentions.members?.first();
    message.channel.send(
      `Olá ${toGreet ? toGreet.user.username : message.member?.user.username}!`
    );
  },
  cooldown: 10,
  aliases: ["digaola"],
  permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers], // to test
};

export default command;
