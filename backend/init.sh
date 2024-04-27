#!/bin/source

# 가상 환경 생성
python3 -m venv myvenv

# 가상 환경 활성화
source myvenv/bin/activate

# requirements.txt에 나열된 패키지 설치
pip install -r requirements.txt