#!/bin/sh

python manage.py makemigrations
python manage.py migrate --noinput
#super user 생성
#echo "from users.models import User; User.objects.create_superuser('test123', 'test123@example123.com', 'test123')" | python manage.py shell
redis-server --daemonize yes
daphne -b 0.0.0.0 -p 8000 backend.asgi:application


