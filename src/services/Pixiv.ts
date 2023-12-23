import {
  Artwork,
  SearchOptions,
  SearchPredict,
  SearchResponse,
  SearchPredictCandidate,
  IllustResponse,
  Illust,
} from '../types/Pixiv';
import encodeQueryParameter from '../utils/encodeQueryParameter';

class Pixiv {
  private cookies: string;
  private userAgent: string;

  constructor() {
    this.cookies = '';
    this.userAgent = '';
  }
  /**
   * Faz login na conta do pixiv.
   * @param {string} cookies Cookies da conta.
   * @param {string} userAgent O User-Agent usado pela conta.
   */
  login(cookies: string, userAgent: string): void {
    this.cookies = cookies;
    this.userAgent = userAgent;
  }
  /**
   * Verifica se o usuário está logado.
   * @returns {boolean} Um booleano.
   */
  async isLogged(): Promise<boolean> {
    if (this.cookies !== '' && this.userAgent !== '') {
      try {
        const imageInfo = await this.getIllustById('66917649');

        if (imageInfo.urls[0].mini) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    return false;
  }
  /**
   * Faz uma busca por ilustrações utilizando uma ou mais tags.
   * @param {string} tag Palavras ou nomes que serão usadas na busca.
   * @param {ISearchOptions} options Filtros para aprimorar a busca.
   * @returns {Artwork[]} Um array de artes.
   */
  async getIllustByTag(
    tag: string,
    options: SearchOptions
  ): Promise<Artwork[]> {
    const encodedTag = encodeQueryParameter(tag);
    const page = options.page ? options.page : 1;
    const ai = options.ai ? '' : '&ai_type=1';
    const url = new URL(
      `https://www.pixiv.net/ajax/search/illustrations/${encodedTag}?word=${encodedTag}&order=date_d&mode=${options.mode}&p=${page}&s_mode=s_tag&type=illust${ai}&lang=en`
    );
    const res = await this.fetch(url);
    const json: SearchResponse = JSON.parse(await res.text()).body;
    const artworks = json.illust.data;

    return artworks;
  }
  /**
   * Busca por informações sobre a ilustração com o ID correspondente.
   * @param {string} illustId ID da ilustração.
   * @returns {Promise<Illust>} Informações sobre uma ilustração.
   */
  async getIllustById(illustId: string): Promise<Illust> {
    const url = new URL(
      `https://www.pixiv.net/ajax/illust/${illustId}?lang=en`
    );
    const res = await this.fetch(url);
    const json: IllustResponse = JSON.parse(await res.text()).body;
    const imagesURLs = [];

    for (let i = 0; i < json.pageCount; i++) {
      imagesURLs.push({
        mini: json.urls.mini.replace('p0', `p${i}`),
        thumb: json.urls.thumb.replace('p0', `p${i}`),
        small: json.urls.small.replace('p0', `p${i}`),
        regular: json.urls.regular.replace('p0', `p${i}`),
        original: json.urls.original.replace('p0', `p${i}`),
      });
    }

    const illust: Illust = {
      AI: json.aiType == 2,
      illustID: json.id,
      title: json.title,
      description: json.description,
      restrict: json.xRestrict == 1,
      width: json.width,
      height: json.height,
      createDate: json.createDate,
      uploadDate: json.uploadDate,
      views: json.viewCount,
      likes: json.likeCount,
      bookmarks: json.bookmarkCount,
      pageCount: json.pageCount,
      tags: json.tags.tags,
      urls: imagesURLs,
      user: {
        id: json.userId,
        name: json.userName,
      },
    };

    return illust;
  }
  /**
   * Tenta associar o que o usuário está escrevendo com alguma tag conhecida.
   * @param {string} input Conjunto de caractéres para associar com uma tag.
   * @returns {Promise<SearchPredictCandidate[]>} Um array de candidatos.
   */
  async predict(input: string): Promise<SearchPredictCandidate[]> {
    const encodedInput = encodeQueryParameter(input);
    const url = new URL(
      `https://www.pixiv.net/rpc/cps.php?keyword=${encodedInput}&lang=en`
    );
    const res = await fetch(url, {headers: [['Referer', 'https://www.pixiv.net/en/']]});
    const json: SearchPredict = JSON.parse(await res.text());

    return json.candidates;
  }
  /**
   * Faz o download da imagem.
   * @param {URL} imageUrl URL da imagem que deseja baixar.
   * @returns {Promise<Buffer>} Um buffer contendo a imagem.
   */
  download(imageUrl: URL): Promise<Buffer> {
    return new Promise((resolve) =>
      resolve(
        this.fetch(imageUrl)
          .then((res) => res.arrayBuffer())
          .then((buff) => Buffer.from(buff))
      )
    );
  }
  /**
   * Versão adaptada do fetch do JavaScript, onde neste caso específico é incluido o cabeçario necessário para fazer requisições na plataforma do Pixiv.
   * @param {URL} url URL para fazer a requisição.
   * @returns {Promise<Response>} Uma requisição utilizando o fetch.
   */
  fetch(url: URL): Promise<Response> {
    const headers = [
      [
        'User-Agent',
        this.userAgent != '' ? this.userAgent : 'Cloudflare Workers',
      ],
      [
        'cookie',
        this.cookies != '' && this.userAgent != '' ? this.cookies : '',
      ],
      ['Referer', 'https://www.pixiv.net/en/'],
    ];

    return fetch(url, { headers: headers });
  }
}

export default Pixiv;
