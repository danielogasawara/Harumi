import { Artwork, Illust, Pixiv } from '@ibaraki-douji/pixivts';
import { randomInt } from 'node:crypto';
import { color } from '../functions';
import { AttachmentBuilder } from 'discord.js';

const pixiv = new Pixiv();

const pixivCookie = process.env.PIXIV_COOKIE;
const pixivUserAgent = process.env.PIXIV_USER_AGENT;

interface ISearchResult {
  artworks: Artwork[];
  quantity: number;
}

if (pixivCookie && pixivUserAgent) {
  console.log(color('text', `🖼️ Pixiv 18+ liberado.`));
  pixiv.staticLogin(pixivCookie, pixivUserAgent);
} else {
  console.log(
    color('text', `🖼️ Pixiv os cookies ou o user-agent não foram encontrados.`)
  );
}

export async function search(
  input: string,
  mode: 'r18' | 'safe'
): Promise<ISearchResult | false> {
  const searchResult = await pixiv.getIllustsByTag(input, {
    mode: mode,
    page: 1,
  });

  const verifiedSearchResult: ISearchResult | false =
    searchResult.length > 0
      ? {
          artworks: searchResult,
          quantity: searchResult.length,
        }
      : false;

  return verifiedSearchResult;
}

export async function getArtwork(searchResult: ISearchResult): Promise<Illust> {
  const artwork = await pixiv.getIllustByID(
    searchResult.artworks[randomInt(searchResult.quantity)].id
  );

  return artwork;
}

export const pixivLogo = {
  image: new AttachmentBuilder(`./images/pixiv_icon.webp`),
  url: 'attachment://pixiv_icon.webp',
};

export default pixiv;
