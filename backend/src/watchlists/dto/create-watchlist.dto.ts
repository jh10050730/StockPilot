import { IsString, Matches } from 'class-validator';

export class CreateWatchlistDto {
  @IsString()
  @Matches(/^\d{6}$/, {
    message: '종목 코드는 6자리 숫자여야 합니다.',
  })
  symbol!: string;
}
