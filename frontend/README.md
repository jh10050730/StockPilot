# StockPilot Frontend

모바일 앱 출시를 목표로 제작 중인 StockPilot의 HTML/CSS/JavaScript 프론트엔드입니다.

## 로컬 실행

백엔드와 프론트엔드를 각각 실행합니다.

```powershell
# backend 폴더
npm run start:dev

# frontend 폴더
python -m http.server 5500
```

- 프론트: `http://localhost:5500`
- 백엔드: `http://localhost:3000`
- API 주소 변경: `js/config.js`

## 주요 화면

| 화면 | 파일 | 설명 |
| --- | --- | --- |
| 홈 | `index.html` | 자산 요약, 시장 종목, AI 진입, 관심종목 |
| 종목 검색 | `search.html` | 실시간 검색, 인기 종목, 최근 검색 |
| 종목 상세 | `stock.html` | 차트, 관심종목, 주문·자동주문 UI |
| 관심종목 | `favorites.html` | Watchlists API 동기화 및 목록 관리 |
| 자산 | `assets.html` | 보유 종목과 자산 구성 목업 UI |
| 로그인 | `login.html` | JWT 로그인 및 원래 화면 복귀 |
| 회원가입 | `signup.html` | 회원가입 API 연결 |

## 공통 모듈

- `js/header.js`: 공통 헤더, 모바일 내비게이션, 로그아웃, 토스트
- `js/config.js`: 백엔드 API 기본 주소
- `js/stock-data.js`: 홈·검색·관심종목 공통 목업 종목 데이터
- `js/watchlist.js`: 로그인/게스트 관심종목 저장 및 서버 동기화

## 데이터 상태

- 인증과 Watchlists는 NestJS 백엔드 API에 연결되어 있습니다.
- 가격, 차트, 자산, 주문, AI 결과는 현재 프론트 확인용 목업입니다.
- 실제 주식 API 연결 시 공통 종목 데이터와 상세 차트 데이터를 API 응답으로 교체해야 합니다.
- 실제 주문을 연결하기 전 주문 확인, 계좌 인증, 위험 고지, 중복 주문 방지 절차가 필요합니다.

## 색상 규칙

- 상승: 빨간색 `#f04452`
- 하락: 파란색 `#3182f6`
- 주요 동작: 파란색 `#3182f6`

## 개발 시 주의사항

- 공통 기능을 화면별로 중복 구현하지 않습니다.
- 새 API는 `js/config.js`의 주소를 사용합니다.
- 관심종목은 반드시 `window.StockPilotWatchlist`를 통해 변경합니다.
- 모바일 하단 내비게이션과 토스트가 겹치지 않는지 확인합니다.
- 실제 API 연결 전까지 목업임을 사용자에게 명확히 표시합니다.
