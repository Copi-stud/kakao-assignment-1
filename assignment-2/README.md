# Todo List

React와 Vite로 만든 미니멀 Todo 생산성 앱입니다.

## 구현 기능

- Todo 추가, 수정, 완료 처리, 삭제
- 빈 입력값 제출 방지 및 안내 메시지 표시
- 전체, 진행 중, 완료 상태별 필터
- 선택 날짜 기준 일간 Todo 목록
- 이전 날짜, 다음 날짜 이동
- 주간 날짜 목록과 날짜별 Todo 개수 표시
- 이전 주차, 다음 주차 이동
- 오늘 날짜와 선택 날짜 강조 표시
- Todo 데이터와 주간 뷰 위치 localStorage 저장
- 새로고침 후 Todo 데이터 유지

## 데이터 구조

Todo는 다음 형태로 관리합니다.

```js
{
  id: '고유 ID',
  text: 'Todo 내용',
  isCompleted: false,
  date: 'YYYY-MM-DD',
}
```

## 실행 방법

```bash
npm install
npm run dev
```

## 검증 명령

```bash
npm run lint
npm run build
```
