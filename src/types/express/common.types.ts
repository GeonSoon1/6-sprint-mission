export enum OrderType {
  OLDEST = 'oldest',
  NEWEST = 'newest',
}

export const OrderByMap: Record <OrderType, { createdAt: 'asc' | 'desc' }> = {
  [OrderType.OLDEST]: { createdAt: 'asc' },
  [OrderType.NEWEST]: { createdAt: 'desc' },
};