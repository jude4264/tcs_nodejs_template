
# 탑코어시스템 NodeJS 프레임워크

## 사용 프레임워크 & 라이브러리

### Frontend
- React 18.2.0

### Backend
- Express

## 설치방법
1. Git Clone을 한다.
```shell
git clone https://github.com/topcoresystem/tcs_nodejs_template.git
```

2. NodeJS와 Yarn이 설치되어 있는지 확인한다.
```shell
# NodeJS 설치 확인법
node -v

# 에러 뜨면 설치 안되니 nodeJS 설치
# 버전은 v16.14.2

# Yarn 설치 확인법
yarn -v

# 에러 뜨면 설치 안된 것이니 yarn 설치 
# MacOS
brew install yarn
# NVM 같은 버전 관리 툴을 사용시에는 NodeJS의 설치를 제외하도록 한다.
brew install yarn --without-node

# Windows
## NPM 으로 설치 (권장)
npm install -g yarn

## Chocolatey 를 사용하는 설치
choco install yarn

## Scoop 를 사용하는 설치
scoop install yarn
```

3. tcs_nodejs_template 폴더 터미널로 이동
```shell
# 터미널로 이동하면 패키지 설치 
yarn install

# 설치 완료 되면 .env 파일 설정 후 테스트
# 개발자 버전 실행
yarn run server_dev_on
yarn run client_dev_on

```

4. github에 올리고 싶을 때
- 가장 먼저 기존 template 폴더와 연동된 git을 끊어야 한다.
- 프로젝트 root 경로로 이동 후
```shell
    # 원격 저장소 목록 확인
    git remote
    
    # 원격 저장소 제거
    git remote rm [이름]
    
    # .git 제거 후
    git init
    
    # 깃허브에서 레포지토리 만든 후 연결 후 
    git push -u
    
    
```
- 절대 올리지 말것
  - node_modules
  - .env 파일들