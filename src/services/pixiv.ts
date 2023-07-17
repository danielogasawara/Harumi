import { color } from '../functions';
import PixivAdapted from '../extensions/PixivAdapted';

const pixiv = new PixivAdapted();
const pixivCookie = process.env.PIXIV_COOKIE;
const pixivUserAgent = process.env.PIXIV_USER_AGENT;

if (pixivCookie && pixivUserAgent) {
  console.log(color('text', `🖼️  Pixiv 18+ liberado.`));
  pixiv.staticLogin(pixivCookie, pixivUserAgent);
} else {
  console.log(
    color(
      'text',
      `🖼️  Pixiv os cookies ou o user-agent não foram encontrados.`,
    ),
  );
}

export const pixivLogo = 'https://i.imgur.com/qm2lhiu.png';

export default pixiv;
