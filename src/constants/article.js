// TODO) Article-Constants: 게시글 관련 공통 상수
export const ARTICLE_ORDER = {
  RECENT: 'recent',
  OLDEST: 'oldest',
};

export const ARTICLE_ORDER_MAP = {
  [ARTICLE_ORDER.RECENT]: { createdAt: 'desc' },
  [ARTICLE_ORDER.OLDEST]: { createdAt: 'asc' },
};

export const DEFAULT_ARTICLE_ORDER = ARTICLE_ORDER.RECENT;
