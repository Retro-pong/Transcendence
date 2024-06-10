FROM python:3.12.1-slim

# .pyc 파일 생성 금지
# Docker 컨테이너 내에서 Django 애플리케이션을 실행할 때, 로그를 빠르게 확인하고 애플리케이션 출력을 실시간으로 볼 수 있도록 도와줌
# https://stackoverflow.com/questions/59812009/what-is-the-use-of-pythonunbuffered-in-docker-file
ENV PYTHONDONTWRITEBYTECODE=1

# 버퍼링을 꺼서 바로 터미널에 출력되게 함 -> 애플리케이션 출력(예: Django 로그)을 실시간으로 확인 가능
# 컨테이너 로그에서 실행 중인 애플리케이션의 정보를 빠르게 얻기 위함, 크래시 발생 시 출력 손실 방지 목적
# https://stackoverflow.com/questions/59812009/what-is-the-use-of-pythonunbuffered-in-docker-file
ENV PYTHONUNBUFFERED=1

ENV DJANGO_SETTINGS_MODULE=backend.settings

RUN apt-get update && apt-get install -y dumb-init

WORKDIR /app

COPY requirements.txt /app

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "cmd.sh"]

#docker build -t "imageName"
#docker run -p 8000:8000 "imageName"