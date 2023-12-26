import Pixiv from '../services/Pixiv';

const PixivInstance = new Pixiv();
const cookies = process.env.PIXIV_COOKIE;
const userAgent = process.env.PIXIV_USER_AGENT;

PixivInstance.login(cookies, userAgent);

export default PixivInstance;
