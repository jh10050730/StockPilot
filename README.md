# StockPilot

주식 초보자와 숙련자 모두를 위한 모바일 중심 증권 서비스 프로젝트입니다. 실제 증권 주문을 목표로 하며, AI 기능은 시장·종목·포트폴리오 분석을 돕는 핵심 보조 기능으로 설계하고 있습니다.

## 프로젝트 구조

```text
StockPilot/
├─ backend/   NestJS, Prisma, MySQL 기반 API
└─ frontend/  HTML, CSS, JavaScript 기반 웹 프론트엔드
```

## 로컬 실행

### Backend

```powershell
cd backend
npm install
npm run start:dev
```

기본 주소: `http://localhost:3000`

### Frontend

```powershell
cd frontend
python -m http.server 5500
```

기본 주소: `http://localhost:5500`

## 현재 구현 범위

- 회원가입, 로그인, 로그아웃 및 JWT 인증
- 모바일 중심 공통 헤더와 하단 내비게이션
- 홈, 종목 검색, 종목 상세, 관심종목, 자산 화면
- Watchlists API와 프론트 관심종목 동기화
- 주가 차트와 주문·자동주문 목업 UI
- 공통 토스트, 로딩 및 오류 상태

주가, 차트, 자산, 주문 및 AI 데이터 일부는 현재 화면 개발용 목업입니다. 세부 실행 방법과 프론트 구조는 `frontend/README.md`를 참고하세요.
