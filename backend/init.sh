#!/bin/source

# 가상 환경 생성
python3 -m venv myenv

# 가상 환경 활성화
source myenv/bin/activate

# requirements.txt에 나열된 패키지 설치
pip install -r requirements.txt