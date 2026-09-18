import { Injectable } from '@nestjs/common';

@Injectable()
export class StocksService {
  search(keyword: string) {
    return {
      keyword,
      message: '종목 검색 API 연결 준비 완료',
    };
  }
}
