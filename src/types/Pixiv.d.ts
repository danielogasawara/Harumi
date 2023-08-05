export interface SearchResponse {
  illust: {
    data: Artwork[];
    total: number;
  };
}
export interface IllustResponse {
  id: string;
  title: string;
  description: string;
  createDate: string;
  uploadDate: string;
  xRestrict: number;
  urls: {
    mini: string;
    thumb: string;
    small: string;
    regular: string;
    original: string;
  };
  tags: {
    tags: [
      {
        tag: string;
        romaji?: string;
        translation?: {
          en: string;
        };
      }
    ];
  };
  alt: string;
  userId: string;
  userName: string;
  userAccount: string;
  width: number;
  height: number;
  pageCount: number;
  bookmarkCount: number;
  likeCount: number;
  viewCount: number;
  isOriginal: boolean;
  aiType: number;
}
export interface SearchPredictCandidate {
  tag_name: string;
  access_count: string;
  type: string;
  tag_translation: string;
}
export interface SearchPredict {
  candidates: Array<SearchPredictCandidate>;
}
export interface SearchOptions {
  mode: 'all' | 'safe' | 'r18';
  page?: number;
  ai: boolean;
}
export interface Artwork {
  id: string;
  title: string;
  description: string;
  tags: Array<string>;
  userId: string;
  userName: string;
  width: number;
  height: number;
  pageCount: number;
  alt: string;
  createDate: string;
  updateDate: string;
  profileImageUrl: string;
}
export interface Illust {
  AI: boolean;
  title: string;
  description: string;
  restrict: boolean;
  views: number;
  bookmarks: number;
  createDate: string;
  uploadDate: string;
  height: number;
  width: number;
  illustID: string;
  likes: number;
  pageCount: number;
  tags: [
    {
      tag: string;
      romaji?: string;
      translation?: {
        en: string;
      };
    }
  ];
  user: {
    id: string;
    name: string;
  };
  urls: {
    mini: string;
    thumb: string;
    small: string;
    regular: string;
    original: string;
  }[];
}
