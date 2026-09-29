import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateWatchlistDto } from './dto/create-watchlist.dto.js';
import { WatchlistsService } from './watchlists.service.js';

@UseGuards(JwtAuthGuard)
@Controller('watchlists')
export class WatchlistsController {
  constructor(private readonly watchlistsService: WatchlistsService) {}

  // ========================================
  // 관심종목 전체 조회
  // GET /watchlists
  // ========================================

  @Get()
  findAll(@Req() request: any) {
    return this.watchlistsService.findAll(request.user.sub);
  }

  // ========================================
  // 관심종목 추가
  // POST /watchlists
  // ========================================

  @Post()
  create(@Req() request: any, @Body() dto: CreateWatchlistDto) {
    return this.watchlistsService.create(request.user.sub, dto.symbol);
  }

  // ========================================
  // 관심종목 삭제
  // DELETE /watchlists/:symbol
  // ========================================

  @Delete(':symbol')
  remove(@Req() request: any, @Param('symbol') symbol: string) {
    return this.watchlistsService.remove(request.user.sub, symbol);
  }
}
