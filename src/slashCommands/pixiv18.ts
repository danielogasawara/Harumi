import {
  AttachmentBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import pixiv from "../utils/pixiv";
import { randomInt } from "node:crypto";

interface PixivEmbed {
  author: string;
  dimensions: string;
}

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("pixiv18")
    .setDescription("Envia uma imagem 18+ do pixiv.")
    .addStringOption((option) => {
      return option
        .setName("pesquisa")
        .setDescription("Digite o que deseja pesquisar no pixiv.")
        .setRequired(true);
    })
    .setNSFW(true),
  execute: async (interaction) => {
    try {
      await interaction.deferReply();
      const searchInput: string = interaction.options.getString("pesquisa")!;
      const searchResult = await pixiv.getIllustsByTag(searchInput, {
        mode: "r18",
        page: 1,
      });

      if (!searchResult) {
        return interaction.editReply({ content: "Algo deu errado..." });
      }
      const imageData = await pixiv.getIllustByID(
        searchResult[randomInt(60)].id
      );

      if (!imageData) {
        console.error(imageData);
        return interaction.editReply({ content: "Algo deu errado..." });
      }

      const response = await pixiv.download(new URL(imageData.urls[0].regular));

      const embedPresets: PixivEmbed = {
        author: imageData.user.name,
        dimensions: String(`${imageData.height}x${imageData.width}`),
      };

      const image = new AttachmentBuilder(response, {
        name: "image.jpg",
        description: undefined,
      });

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("#35c1c8")
            .setTitle(imageData.title)
            .addFields(
              { name: "🎨 Autor", value: embedPresets.author, inline: true },
              {
                name: "📐 Dimensões",
                value: embedPresets.dimensions,
                inline: true,
              },
              {
                name: "📌 Original",
                value: `[Clique aqui](https://www.pixiv.net/en/artworks/${imageData.illustID})`,
              }
            )
            .setImage(`attachment://image.jpg`),
        ],
        files: [image],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({ content: "Algo deu errado..." });
    }
  },
  cooldown: 15,
};
export default command;
