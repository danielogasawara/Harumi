import { Artwork, Illust, Pixiv } from '@ibaraki-douji/pixivts';
import { randomInt } from 'crypto';

interface ISearchResult {
  artworks: Artwork[];
  quantity: number;
}
class PixivAdapted extends Pixiv {
  public async search(
    input: string,
    mode: 'r18' | 'safe',
  ): Promise<ISearchResult | void> {
    const encodedInput = encodeURIComponent(input)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');

    const searchResult = await this.getIllustsByTag(encodedInput, {
      mode: mode,
      page: 1,
    });
    if (searchResult.length === 0) {
      return;
    }
    const verifiedSearchResult: ISearchResult = {
      artworks: searchResult,
      quantity: searchResult.length,
    };

    return verifiedSearchResult;
  }
  public async getArtwork(searchResult: ISearchResult): Promise<Illust> {
    const artwork = await this.getIllustByID(
      searchResult.artworks[randomInt(searchResult.quantity + 1)].id,
    );

    return artwork;
  }
}

export default PixivAdapted;
