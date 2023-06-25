import { Artwork, Illust, Pixiv } from '@ibaraki-douji/pixivts';
import { randomInt } from 'node:crypto';
import { color } from '../functions';

const pixiv = new Pixiv();

const pixivCookie = process.env.PIXIV_COOKIE;
const pixivUserAgent = process.env.PIXIV_USER_AGENT;

if (pixivCookie && pixivUserAgent) {
  console.log(color('text', `🖼️ Pixiv 18+ liberado.`));
  pixiv.staticLogin(pixivCookie, pixivUserAgent);
} else {
  console.log(
    color('text', `🖼️ Pixiv os cookies ou user-agente não foram encontrados.`)
  );
}

export async function search(
  input: string,
  mode: 'r18' | 'safe'
): Promise<Artwork[]> {
  const searchResult = await pixiv.getIllustsByTag(input, {
    mode: mode,
    page: 1,
  });

  return searchResult;
}

export async function getArtwork(searchResult: Artwork[]): Promise<Illust> {
  const artworksOnResult: number = searchResult.length;
  const artwork = await pixiv.getIllustByID(
    searchResult[randomInt(artworksOnResult)].id
  );

  return artwork;
}

export default pixiv;
