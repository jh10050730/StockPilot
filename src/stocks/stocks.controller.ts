import { Controller, Get, Query } from '@nestjs/common';
import { StocksService } from './stocks.service.js';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('search')
  search(@Query('keyword') keyword: string) {
    return this.stocksService.search(keyword);
  }
}
3;
