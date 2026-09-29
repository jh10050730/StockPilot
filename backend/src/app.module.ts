import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { StocksModule } from './stocks/stocks.module.js';
import { WatchlistsModule } from './watchlists/watchlists.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,

    AuthModule,

    StocksModule,

    WatchlistsModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
