import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: 'stockpilot-secret-key',

      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, PrismaService],

  // 다른 Module에서도 JwtService를 사용할 수 있도록 공개
  exports: [JwtModule],
})
export class AuthModule {}
