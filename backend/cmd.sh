#!/bin/sh

python manage.py makemigrations
python manage.py migrate --noinput
echo "from users.models import User; User.objects.create_superuser('test', 'tttest@example.com', 'test')" | python manage.py shell
#python manage.py runserver 0.0.0.0:8000
redis-server --daemonize yes
daphne -b 0.0.0.0 -p 8000 backend.asgi:application


