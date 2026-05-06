#!/bin/bash
# EC2 서버 배포 스크립트 (Ubuntu 기준)

echo "🚀 웹켓 몬스터 백엔드 배포를 시작합니다..."

# 1. 필수 패키지 설치
echo "📦 필수 패키지 설치 중..."
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose git

# 2. Docker 데몬 시작 및 권한 설정
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# 3. 기존 컨테이너 중지 및 삭제
echo "🛑 기존 컨테이너 종료 중..."
sudo docker-compose down

# 4. 최신 이미지 빌드 및 컨테이너 백그라운드 실행
echo "🏗️ 백엔드 및 DB 컨테이너 빌드 및 실행 중..."
sudo docker-compose up --build -d

echo "✅ 배포가 완료되었습니다!"
echo "서버 상태 확인: sudo docker-compose ps"
echo "서버 로그 확인: sudo docker-compose logs -f app"
