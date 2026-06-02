# 🚀 Webket-Monster 통합 배포 가이드 (Deployment Guide)

Webket-Monster 프로젝트는 **Spring Boot 백엔드**와 **Plasmo (React) 크롬 익스텐션 프론트엔드**로 구성된 풀스택 프로젝트입니다. 본 문서는 로컬 실행부터 서버(AWS EC2) 및 크롬 웹스토어 배포 과정을 다룹니다.

---

## 📂 프로젝트 배포 파일 구조

```text
Webket-Monster/
├── backend/
│   ├── Dockerfile          # 백엔드 애플리케이션 Docker 이미지 빌드 파일
│   ├── docker-compose.yml  # 백엔드 + PostgreSQL 컨테이너 구성
│   └── deploy.sh           # AWS EC2(Ubuntu) 전용 배포 자동화 스크립트
├── frontend/
│   ├── .env.development    # 개발용 익스텐션 API 연동 파일
│   └── .env.production     # 배포용 익스텐션 API 연동 파일
├── build-all.sh            # 백엔드 & 프론트엔드 통합 로컬 빌드 스크립트 (권장)
└── DEPLOYMENT.md           # 본 배포 가이드 문서
```

---

## ☕ 1. 백엔드 (Spring Boot & PostgreSQL) 배포

백엔드는 가벼운 컨테이너 배포를 위해 **Docker 및 Docker Compose**를 적극 활용합니다.

### A. 로컬 개발 환경 실행
로컬 데이터베이스가 실행 중인 경우 아래 명령어로 직접 구동할 수 있습니다.
```bash
cd backend
./gradlew bootRun
```

### B. 로컬 Docker Compose 실행 (권장)
로컬에 DB가 설치되어 있지 않아도 Docker만 있다면 편리하게 백엔드 서버와 PostgreSQL DB를 묶어서 실행할 수 있습니다.
```bash
cd backend
# 1. backend/.env 파일의 DB_USER, DB_PASSWORD를 맞게 작성
# 2. docker-compose 실행
docker-compose up --build -d
```

### C. AWS EC2 (Ubuntu) 실서버 배포
실서비스 서버(Ubuntu)에 소스 코드를 내려받은 후, 배포 스크립트를 실행하여 배포합니다.
```bash
# 1. EC2 인스턴스에 SSH로 접속
# 2. 프로젝트 backend 폴더로 이동
cd backend

# 3. 배포 스크립트에 실행 권한 부여 및 실행
chmod +x deploy.sh
./deploy.sh
```
> [!NOTE]
> `deploy.sh`는 Docker & Docker Compose 설치, 기존 서버 종료 후 `docker-compose up --build -d` 실행까지 원스톱으로 처리합니다.

---

## 📦 2. 프론트엔드 (Chrome Extension) 배포 및 패키징

프론트엔드는 **Plasmo** 프레임워크를 기반으로 빌드되며, 최종 배포를 위해 크롬 브라우저가 인식할 수 있는 정적 파일 또는 압축파일(`.zip`)로 변환되어야 합니다.

### A. API 서버 주소 설정 (중요)
익스텐션 빌드 전에 연동할 API 서버 주소를 설정합니다.
- **개발 환경 (`frontend/.env.development`)**: `PLASMO_PUBLIC_API_URL=http://localhost:8080/api`
- **배포 환경 (`frontend/.env.production`)**: `PLASMO_PUBLIC_API_URL=http://3.106.199.213:8080/api` (실서버 IP)

### B. 로컬에서 수동 패키징
로컬 환경에서 크롬 익스텐션용 압축파일을 생성할 수 있습니다.
```bash
cd frontend
# 1. npm 패키지 설치
npm install

# 2. 크롬 웹스토어 업로드용 ZIP 파일 빌드
npm run build:zip
```
빌드가 완료되면 **`frontend/build/chrome-mv3-prod.zip`** 파일이 생성됩니다.

### C. 크롬 브라우저에 수동 등록하기
크롬 브라우저에서 스토어를 통하지 않고 테스트하거나 수동 배포할 때 아래 방법을 사용합니다.
1. `chrome://extensions` (확장 프로그램 관리) 페이지로 이동합니다.
2. 우측 상단의 **'개발자 모드'**를 활성화합니다.
3. 빌드로 생성된 `chrome-mv3-prod.zip`의 압축을 해제한 폴더(또는 `chrome-mv3-prod` 폴더)를 **'압축해제된 확장 프로그램을 로드'** 버튼을 통해 업로드합니다.

---

## 🛠️ 3. 초간단 통합 로컬 빌드 (원클릭)

로컬에서 백엔드 JAR 빌드와 프론트엔드 익스텐션 ZIP 패키징을 원클릭으로 수행하고자 할 경우, 루트 디렉토리에 있는 통합 스크립트를 사용합니다.
```bash
# 루트 디렉토리에서 실행
./build-all.sh
```
실행 결과물:
- 백엔드: `backend/build/libs/backend-0.0.1-SNAPSHOT.jar`
- 프론트엔드: `frontend/build/chrome-mv3-prod.zip`
