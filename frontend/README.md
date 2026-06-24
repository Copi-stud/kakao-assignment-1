# Todo 앱

Next.js 16 App Router 프론트엔드와 FastAPI 백엔드, SQLite 데이터베이스로 구성한 Todo 관리 앱입니다.

## 주요 기능

- Todo 생성, 수정, 삭제, 완료 토글
- `due_date` 기반 일간 뷰, 주간 뷰, 날짜 미분류 Todo 보기
- URL 기반 완료 상태 필터링
  - 전체: `/todos`
  - 진행 중: `/todos?filter=active`
  - 완료: `/todos?filter=completed`
- URL 기반 서버 검색
  - Todo 제목을 FastAPI 서버에서 DB 조건으로 검색
  - 검색어는 URL의 `search` 파라미터로 유지
- `filter`와 `search` 동시 적용
  - 예: `/todos?filter=active&search=과제`
- 새로고침, URL 공유, 뒤로가기 후에도 현재 필터와 검색어 유지

## 프로젝트 구조

```text
kakao-assignment-3/
├─ backend/
│  ├─ main.py              # FastAPI 앱, SQLAlchemy 모델, Todo API
│  ├─ requirements.txt     # 백엔드 의존성
│  └─ todos.db             # 로컬 SQLite DB, Git 제외 대상
└─ frontend/
   ├─ app/
   │  ├─ todos/            # Todo 화면, 생성/수정 폼, 버튼 컴포넌트
   │  ├─ api/todos/        # Next.js Route Handler
   │  ├─ actions.ts        # Server Component 데이터 조회
   │  └─ lib/              # 날짜, filter/search URL 유틸
   ├─ package.json
   └─ README.md
```

## 실행 방법

### 1. 백엔드 실행

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

백엔드 기본 주소:

```text
http://localhost:8000
```

### 2. 프론트엔드 실행

```powershell
cd frontend
npm.cmd run dev
```

브라우저 접속 주소:

```text
http://localhost:3000/todos
```

## 환경변수

실제 비밀값이나 개인 환경 값은 Git에 포함하지 않습니다. 아래는 필요한 변수 이름과 예시 형식입니다.

### frontend/.env.local

```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

- `BACKEND_URL`: Server Component와 Route Handler가 FastAPI 서버에 요청할 때 사용합니다.
- `NEXT_PUBLIC_API_URL`: Client Component가 Next.js Route Handler에 요청할 때 사용합니다.

### backend/.env.local

```env
DATABASE_URL=sqlite:///todos.db
```

- `DATABASE_URL`: SQLAlchemy가 사용할 데이터베이스 URL입니다.
- 상대 경로 SQLite URL은 `backend/main.py` 위치 기준으로 처리됩니다.

## URL 사용 예시

```text
/todos
/todos?filter=active
/todos?filter=completed
/todos?search=과제
/todos?filter=active&search=과제
/todos?filter=completed&search=과제
```

잘못된 `filter` 값은 프론트엔드에서 전체 목록으로 안전하게 처리합니다.

## 검사 명령

### 프론트엔드

```powershell
cd frontend
npm run lint
npm.cmd run build
```

### 백엔드

```powershell
cd backend
python -m compileall main.py
```

## 제출 시 제외할 파일

아래 파일과 폴더는 Git에 포함하지 않습니다.

```text
frontend/node_modules/
frontend/.next/
frontend/.env.local
frontend/.env*
backend/.venv/
backend/.env.local
backend/todos.db
backend/__pycache__/
*.pyc
.DS_Store
```
