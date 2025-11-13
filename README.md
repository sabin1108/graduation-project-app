# 한경국립대학교 AI 챗봇

한경국립대학교 학생들을 위한 지능형 대화 시스템으로, 학사 일정, 공지사항, 수강 신청 등 다양한 대학 생활 정보를 실시간으로 제공하여 어려움을 해결합니다.

![메인 화면면](https://i.postimg.cc/QCgssXSr/meinlogeu.png)

## 목차

- [개요](#-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [개발 환경](#-개발-환경)

## 개요

한경국립대학교 AI 챗봇은 학생들이 대학 생활에 필요한 정보를 쉽고 빠르게 얻을 수 있도록 돕는 대화형 인공지능 시스템입니다. 자연어 처리 기술을 활용하여 학생들의 질문을 이해하고, 학사 일정, 수강 신청, 공지사항 등 다양한 정보를 실시간으로 제공합니다.

### 프로젝트 목표

- 학생들의 정보 접근성 향상 - 분활된 정보 그룹화
- 실시간 학사 정보 제공
- 다양한 학교 연계 사이트 제공
- 학교 행사 및 공모전에 대한 홍보 및 정보 제공
- 직관적이고 사용하기 쉬운 인터페이스 구현 - 사용자의 UX를 우선

## 주요 기능
### 1. 메인 화면
![main page](https://i.postimg.cc/j2CYxr7s/meinhwamyeon.png)
- 좌측 사이드바: 메뉴 네비게이션
- 중앙: 대화 인터페이스
### 2. 지능형 대화 시스템
- 자연어 기반 질의응답
- 맥락을 이해하는 대화 연속성
- 다양한 학사 관련 질문 처리
- 실시간 응답 제공
- 데이터베이스를 통한 정확한 정보 제공

### 3. 학사 일정 관리
![Calendar Feature](https://i.postimg.cc/yxWC1zZ7/kaellindeohwamyeon.png)

- 인터랙티브 캘린더 UI
- 학기별 주요 일정 표시
  - 수강 신청 기간
  - 시험 기간
  - 학사 일정
  - 방학 정보
- 월별/일별 일정 조회
    - 이벤트 색상 코딩
### 4. 공지사항 및 소식
![Notification Feature](https://i.postimg.cc/8CnqZ0YB/image.png)
- 최신 공지사항 자동 업데이트
- 학사, 장학, 한경 공지 카테고리별 분류
- 제공된 공지사항 링크화
- 시간순 공지 나열

#### 4.1 학교 행사 및 소식 

![Image](https://github.com/user-attachments/assets/425d2ad5-99ce-41e4-831b-a12a93bbdf0e)

- 행사 및 대회 정보 제공

#### 4.2 식단 정보
![menu](https://i.postimg.cc/rsz2VLrc/sigdanjegong.png)

- 학생 식당 메뉴 확인
- 기숙사 식당 메뉴 확인
- 교직원 식당 메뉴 확인
- 원하는 날짜 메뉴 확인 가능능

### 5. 사용자 편의성 기능
![UX](https://i.postimg.cc/Y0jBrwWM/gaeinseoljeonghwamyeon.png)
- 폰트 크기 조절기능
- 대화 내보내기 기능
- 대화 삭제 기능
 
#### 5.1 대화 내보내기 기능
![Image](https://github.com/user-attachments/assets/7c242aa5-4363-4435-88a5-df214eb1d121)
- 필요한 대화 내용 txt 파일로 저장

#### 5.2 폰트 조절기능
![Image](https://github.com/user-attachments/assets/df1b8ef7-f264-42f6-a65f-918f2cb4b414)

- 원하는 폰트로 크기 변환




## 🛠 기술 스택

### Frontend
```
- React Native
iOS와 Android 앱을 위한 크로스 플랫폼 개발 하기위해 사용했습니다. 단일 코드베이스로 두 플랫폼에 일관된 사용자 경험을 제공하고 개발 리소스를 효율적으로 사용하기 위해 채택했습니다.

- Expo
React Native 개발을 위한 프레임워크 및 도구로 네이티브 모듈 관리, 빌드 및 배포 프로세스를 단순화하여 개발 생산성을 위해 사용되었습니다.

-  TypeScript
코드 안정성과 유지보수성을 높이고, 컴파일 단계에서 오류를 미리 발견하여 버그를 줄이기 위해 사용되었습니다.

- Expo Router
웹(Next.js)과 유사한 직관적인 방식으로 내비게이션 구조를 설계하고 딥 링킹을 손쉽게 구현하기 위해 채택했습니다.

- React Navigation
Expo Router와 함께 사용되어 드로어, 탭, 스택 등 복잡하고 유연한 내비게이션 패턴을 구현하기위해 사용되어졌습니다.

- Axios
HTTP 클라이언트 라이브러리로 서버와의 비동기 통신을 간결하게 처리하고, 요청/응답 가로채기(interceptor) 기능을 활용해 API 연동을 효율적으로 관리하기 위해 사용되었습니다.

- ESLint
정적 코드 분석로 eslint-config-expo 설정을 기반으로 프로젝트 전체의 코드 스타일을 일관되게 유지하고 잠재적인 오류를 사전에 발견하기 위해 사용되었습니다.
```

**Frontend**

![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Expo Router](https://img.shields.io/badge/Expo_Router-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-6B46C1?style=for-the-badge&logo=reactnavigation&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)



**Backend**

![NCP](https://img.shields.io/badge/NCP-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) 
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![OpenAI API](https://img.shields.io/badge/OpenAI%20API-412991?style=for-the-badge&logo=openai&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white)


<div sytle="overflow:hidden;">
<table>
  <tr>
    <td colspan="1" align="center"><strong>FrontEnd</strong></td>
    <td colspan="1" align="center"><strong>BackEnd</strong></td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/sabin1108"><img src="https://avatars.githubusercontent.com/u/67681246?v=4" width="150px" alt="민사빈"/><br/><sub><b>민사빈</b></sub></a>
    </td>
    <td align="center">
      <a href="https://github.com/thatgirls00"><img src="https://avatars.githubusercontent.com/u/109068985?v=4" width="150px;" alt="전현수"/><br/><sub><b>전현수</b></sub></a>
    </td>
  </tr>
</table>

> 민사빈 : React Native (Expo 프레임워크 기반), TypeScript,  Expo Router 및 React Navigation (하단 탭, 드로어 내비게이션 포함) UI/UX구성, Axios 통신, ESLint <br><br>
> 전현수 : Spring API Server (Java) / NCP 서버 연동 / 학교 데이터 크롤러 및 전처리(Python) / 
</div>
<br>









