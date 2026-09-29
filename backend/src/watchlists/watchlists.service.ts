import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class WatchlistsService {
  constructor(private readonly prisma: PrismaService) {}

  // ========================================
  // 관심종목 전체 조회
  // ========================================
  async findAll(userId: string) {
    const parsedUserId = this.parseUserId(userId);

    const watchlists = await this.prisma.watchlist.findMany({
      where: {
        userId: parsedUserId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,
        symbol: true,
        createdAt: true,
      },
    });

    return watchlists.map((watchlist) => ({
      id: watchlist.id.toString(),
      symbol: watchlist.symbol,
      createdAt: watchlist.createdAt,
    }));
  }

  // ========================================
  // 관심종목 추가
  // ========================================
  async create(userId: string, symbol: string) {
    const parsedUserId = this.parseUserId(userId);
    const normalizedSymbol = symbol.trim();

    // 종목 코드가 6자리 숫자인지 확인
    if (!/^\d{6}$/.test(normalizedSymbol)) {
      throw new BadRequestException('종목 코드는 6자리 숫자여야 합니다.');
    }

    // 이미 등록된 관심종목인지 확인
    const existingWatchlist = await this.prisma.watchlist.findFirst({
      where: {
        userId: parsedUserId,
        symbol: normalizedSymbol,
      },
    });

    if (existingWatchlist) {
      throw new ConflictException('이미 관심종목에 등록된 종목입니다.');
    }

    // DB 저장
    const watchlist = await this.prisma.watchlist.create({
      data: {
        userId: parsedUserId,
        symbol: normalizedSymbol,
      },

      select: {
        id: true,
        symbol: true,
        createdAt: true,
      },
    });

    return {
      id: watchlist.id.toString(),
      symbol: watchlist.symbol,
      createdAt: watchlist.createdAt,
    };
  }

  // ========================================
  // 관심종목 삭제
  // ========================================
  async remove(userId: string, symbol: string) {
    const parsedUserId = this.parseUserId(userId);
    const normalizedSymbol = symbol.trim();

    // 종목 코드가 6자리 숫자인지 확인
    if (!/^\d{6}$/.test(normalizedSymbol)) {
      throw new BadRequestException('종목 코드는 6자리 숫자여야 합니다.');
    }

    // 현재 사용자의 관심종목인지 확인
    const watchlist = await this.prisma.watchlist.findFirst({
      where: {
        userId: parsedUserId,
        symbol: normalizedSymbol,
      },
    });

    if (!watchlist) {
      throw new NotFoundException('관심종목에 등록되지 않은 종목입니다.');
    }

    // 관심종목 삭제
    await this.prisma.watchlist.delete({
      where: {
        id: watchlist.id,
      },
    });

    return {
      message: '관심종목에서 삭제되었습니다.',
      symbol: normalizedSymbol,
    };
  }

  // ========================================
  // JWT의 userId를 BigInt로 변환
  // ========================================
  private parseUserId(userId: string): bigint {
    try {
      return BigInt(userId);
    } catch {
      throw new BadRequestException('사용자 ID가 올바르지 않습니다.');
    }
  }
}
