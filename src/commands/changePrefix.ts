import { setGuildOption } from "../functions";
import { Command } from "../types";

const command: Command = {
  name: "mudarprefixo",
  execute: (message, args) => {
    let prefix = args[1];
    if (!prefix) return message.channel.send("Nenhum prefixo digitado.");
    if (!message.guild) return;
    setGuildOption(message.guild, "prefix", prefix);
    message.channel.send("Prefixo alterado com sucesso!");
  },
  permissions: ["Administrator"],
  aliases: [],
};

export default command;
