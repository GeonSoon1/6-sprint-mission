export interface QueryList {
  offset: number;
  limit: number;
  orderBy: { createdAt: 'asc' | 'desc' };
  name?: string;
  description?: string;
  title?: string;
  content?: string;
}
