import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const email = dto.email.trim().toLowerCase();
    const nickname = dto.nickname.trim();

    // 1. 이미 가입된 이메일인지 확인
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 2. 비밀번호를 해시 처리
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // 3. 사용자 생성 + 포트폴리오 생성
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          nickname,
        },
      });

      await tx.portfolio.create({
        data: {
          userId: newUser.id,
        },
      });

      return newUser;
    });

    // 4. 회원가입 결과 반환
    return {
      id: user.id.toString(),
      email: user.email,
      nickname: user.nickname,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    // 1. 이메일로 사용자 찾기
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // 2. 사용자가 없으면 로그인 실패
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 3. 입력한 비밀번호와 저장된 해시 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    // 4. 비밀번호가 틀리면 로그인 실패
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 5. JWT 토큰 생성
    const accessToken = await this.jwtService.signAsync({
      sub: user.id.toString(),
      email: user.email,
    });

    // 6. 로그인 결과 반환
    return {
      accessToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        nickname: user.nickname,
      },
    };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.id.toString(),
      email: user.email,
      nickname: user.nickname,
    };
  }
}
