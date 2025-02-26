# kontrol-hands-on-bootstrap-catstagram
Kontrol 핸즈온에서 사용되는 예제 프로젝트입니다.

## Install dependencies
빠른 핸즈온 실습을 위해 빌드 시간을 최소화하려고 yarn zero-install을 사용하고 있어요.
종속성 패키지를 추가하면 패키지의 zip 파일을 커밋하여 관리하는 방식인데,
`yarn install` 하면 플랫폼마다 다른 zip 파일이 다운 받아지는 문제가 있어요.

Docker build 할 때를 기준으로 해야하므로 종속성 업데이트는 아래와 같이 `docker run`
명령어로 진행해주세요.

```bash
docker run --rm -v $PWD:/app -w /app node:22-alpine yarn add <package-name>
```
