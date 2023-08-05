import { color } from '../functions';
import Pixiv from '../services/Pixiv';

const PixivInstance = new Pixiv();
const cookies = process.env.PIXIV_COOKIE;
const userAgent = process.env.PIXIV_USER_AGENT;

if (cookies.length > 1000 && userAgent.length > 40) {
  PixivInstance.login(cookies, userAgent);
}

PixivInstance.isLogged().then((result) => {
  if (result) {
    return console.log(color('text', '🖼️ Pixiv +18 liberado!'));
  }
  return console.log(color('error', '🖼️ Pixiv +18 não está disponível.'));
});

export default PixivInstance;
