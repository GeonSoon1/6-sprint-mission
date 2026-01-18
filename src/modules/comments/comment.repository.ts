import {
  CommentCreateDto,
  CommentQueryDto,
  CommentUpdateDto,
} from '../comments/comment.dto';
import prisma from '../../libs/prismaClient';

export class CommentRepository {
  async create(dto: CommentCreateDto) {
    return prisma.comment.create({ data: dto });
  }

  async findManyComment(dto: CommentQueryDto) {
    return prisma.comment.findMany({
      where: {
        ...Object.fromEntries(
          Object.entries(dto).filter(
            ([_, v]) => v !== undefined && _ !== 'cursor' && _ !== 'take'
          )
        ),
      },
      take: dto.take || 10,
      skip: dto.cursor ? 1 : 0,
      ...(dto.cursor ? { cursor: { id: dto.cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true },
    });
  }

  async update(id: string, data: CommentUpdateDto) {
    return prisma.comment.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.comment.delete({ where: { id } });
  }
}
