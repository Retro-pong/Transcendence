FROM python:3.12.1-slim

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