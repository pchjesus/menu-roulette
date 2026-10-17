# 뭐먹지? — Menu Roulette v0.1

점심·저녁·카페 메뉴를 골라 주는 가벼운 슬롯머신 웹앱.

- 실행: https://pchjesus.github.io/menu-roulette/
- 저장소: https://github.com/pchjesus/menu-roulette
- 추천 개수: 1~3개. 칸 수가 바뀌고 손잡이가 움직이며 순서대로 멈춥니다.
- 완전 랜덤 또는 최대 3개 카테고리의 합집합에서 메뉴별 균등 추첨.
- 음식 96개(점심 84 / 저녁 93), 카페 40개. 한 회차 중복 없음.
- 설정만 브라우저에 저장. 로그인·서버·API·추적·외부 런타임 의존성 없음.
- 키보드, 결과 알림, 시스템/사용자 동작 축소 지원.

## 실행과 테스트

```sh
python3 -m http.server 8000
# http://localhost:8000
node --test
```

ES Modules를 사용하므로 file://로 직접 열지 말고 HTTP 서버를 사용하세요.
GitHub Pages는 main 브랜치의 /(root)에서 배포합니다. 상대 경로만 사용합니다.

## 구조

- index.html / assets/css/styles.css: 화면과 반응형 스타일
- assets/js/data/menus.js: 메뉴·카테고리 데이터
- assets/js/logic/recommend.js: 후보 필터·추첨·설정 검증
- assets/js/state/storage.js: 버전별 설정 저장·복원
- assets/js/ui/slots.js: 슬롯 표시·손잡이·순차 정지
- assets/js/app.js: UI와 실행 상태
- tests/recommend.test.mjs: 데이터·로직·저장 경계 검증

## 추첨 원리

남은 후보 N개에서 최대 8개를 균등 비복원 추출한 뒤 그중 한 메뉴를 균등 선택합니다. N>8일 때 8/N × 1/8 = 1/N. 당첨 메뉴만 남은 풀에서 제거합니다. 다음 실행에서는 다시 등장할 수 있습니다. 슬롯은 이 후보들의 반복으로 회전하며 실제 당첨 메뉴에 멈춥니다.

## 범위와 다음 단계

v0.2: 후보 저장·저장 후보 재선택·선택적 최근 중복 방지.
v0.3: 가격·맵기·카페 필터. v1.0: 기기별 사용성·접근성 안정화.
위치·영업시간·알레르기·영양 정보를 판단하는 앱이 아닙니다. 메뉴 분류와 식사 적합성은 편집 기준이며 필요시 data 파일에서 조정합니다. 이미지와 폰트는 외부 서버에서 가져오지 않으며 슬롯머신은 CSS로 직접 제작했습니다. 참고 이미지 원본은 저장소에 포함하지 않습니다.
