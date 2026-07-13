# Сервис доставки продуктов

Учебный проект на Django 5. Основные сценарии: каталог, корзина, оформление и оплата заказа, кабинет клиента и рабочая панель сотрудников.

## Запуск через Docker Compose

Рекомендуемый локальный режим использует Django и PostgreSQL 16.

```powershell
Copy-Item .env.example .env
```

Перед первым запуском замените в `.env` как минимум `DJANGO_SECRET_KEY` и `POSTGRES_PASSWORD`, затем выполните:

```powershell
docker compose up --build
```

После запуска:

- сайт: `http://127.0.0.1:8000/`;
- внутри Docker база доступна как `db:5432`.

Порт PostgreSQL намеренно не публикуется наружу. Открыть SQL-консоль можно безопасно через контейнер:

```powershell
docker compose exec db psql -U delivery -d delivery
```

Миграции выполняются автоматически. Данные PostgreSQL сохраняются в именованном volume `delivery-project_postgres_data`, а каталог `media` подключён из проекта.

Создание администратора:

```powershell
docker compose exec web python manage.py createsuperuser
```

Остановка контейнеров без удаления базы:

```powershell
docker compose down
```

Чтобы удалить контейнеры вместе с локальной базой PostgreSQL, явно выполните `docker compose down -v`. Эта команда удаляет данные из volume.

### Перенос существующих данных SQLite

Если нужно перенести текущие товары, пользователей и заказы из `db.sqlite3`, до запуска Compose создайте fixture:

```powershell
.\venv\Scripts\python.exe manage.py dumpdata --natural-foreign --natural-primary --exclude contenttypes --exclude auth.permission --indent 2 --output seed-data.json
```

После запуска PostgreSQL загрузите её:

```powershell
docker compose exec web python manage.py loaddata seed-data.json
```

После успешного импорта `seed-data.json` лучше удалить: файл может содержать пользовательские данные и хэши паролей, поэтому его нельзя коммитить.

## Запуск без Docker

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Без `DATABASE_URL` проект использует прежний `db.sqlite3`. Настройки передаются через переменные окружения; перечень есть в `.env.example`. Файл `.env` автоматически читает Docker Compose, но сам Django без Docker его не загружает.

## Подготовка к production

`Dockerfile` запускает приложение через Gunicorn, собирает статику и использует порт из переменной `PORT`. Для контейнерного хостинга задайте:

```text
DJANGO_DEBUG=0
DJANGO_SECRET_KEY=<длинный случайный секрет>
DJANGO_ALLOWED_HOSTS=<домен сервиса>
DJANGO_CSRF_TRUSTED_ORIGINS=https://<домен сервиса>
DATABASE_URL=<строка подключения PostgreSQL от платформы>
DB_SSL_REQUIRE=1
DJANGO_MIGRATE=1
DJANGO_COLLECTSTATIC=1
```

Если платформа сама завершает HTTPS на reverse proxy, `DJANGO_SECURE_SSL_REDIRECT` можно оставить `0`. Если перенаправление должен выполнять Django, установите `1` после проверки proxy-заголовков.

WhiteNoise обслуживает CSS, JavaScript и статические изображения. Загружаемые пользователями файлы из `media` на большинстве бесплатных контейнерных сервисов не переживают перезапуск. Для production понадобится постоянный диск платформы либо S3-совместимое объектное хранилище.

## Оплата

По умолчанию включён безопасный учебный провайдер `PAYMENT_PROVIDER=demo`: реальные деньги не списываются, а реквизиты карты не сохраняются. Успешная тестовая карта: `4242 4242 4242 4242`, любая будущая дата в формате `ММ/ГГ` и любой трёхзначный CVV.

Для реальной оплаты нужен серверный адаптер выбранного банка/эквайринга и его ключи. Переключать `PAYMENT_PROVIDER` до подключения такого адаптера не следует.

## Проверка

```powershell
$env:DJANGO_FAST_TESTS='1'
python manage.py check
python manage.py test delivery_app
```
