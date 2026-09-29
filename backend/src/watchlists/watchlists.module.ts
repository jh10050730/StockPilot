import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { WatchlistsController } from './watchlists.controller.js';
import { WatchlistsService } from './watchlists.service.js';

@Module({
  imports: [AuthModule],

  controllers: [WatchlistsController],

  providers: [WatchlistsService],
})
export class WatchlistsModule {}
