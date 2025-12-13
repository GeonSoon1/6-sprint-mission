// ======= create DTO =======
// 초기 요청 DTO
export interface CreateArticleRequestDto {
  title: string;
  content: string;
}

// 서비스용 DTO
export interface CreateArticleCommandDto {
  title: string;
  content: string;
  userId: number;
}

// ======= read DTO =======
// 초기 요청 DTO = query에 값이 없어도 됨
export interface GetArticlesRequestDto {
  offset?: number;
  limit?: number;
  order?: 'newest' | 'oldest';
  title?: string;
  content?: string;
}

// 서비스용 DTO = 모든 값이 확정되어 있음
export interface GetArticlesFinalRequestDto {
  offset: number;
  limit: number;
  orderBy: { createdAt: 'asc' | 'desc' };
  title: string;
  content?: string;
}

export interface GetArticleDto {
  id: number;
  userId?: number;
}

// ======= update DTO =======
// 요청 DTO
export interface UpdateArticleDto {
  title?: string;
  content?: string;
}
