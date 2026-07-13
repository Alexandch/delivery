from pathlib import Path

import os

import dj_database_url



BASE_DIR = Path(__file__).resolve().parent.parent



SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-only-change-me-before-production')



DEBUG = os.getenv('DJANGO_DEBUG', '1') == '1'



ALLOWED_HOSTS = [

    host.strip()

    for host in os.getenv('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')

    if host.strip()

]



INSTALLED_APPS = [

    'django.contrib.admin',

    'django.contrib.auth',

    'django.contrib.contenttypes',

    'django.contrib.sessions',

    'django.contrib.messages',

    'django.contrib.staticfiles',

    'delivery_app',

    'imagekit',

]



MIDDLEWARE = [

    'django.middleware.security.SecurityMiddleware',

    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',

    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]



ROOT_URLCONF = 'delivery_project.urls'



TEMPLATES = [

    {

        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        'DIRS': [os.path.join(BASE_DIR, 'templates')],

        'APP_DIRS': True,

        'OPTIONS': {

            'context_processors': [

                'django.template.context_processors.debug',

                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',

                'django.contrib.messages.context_processors.messages',

            ],

        },

    },

]



WSGI_APPLICATION = 'delivery_project.wsgi.application'



DATABASE_URL = os.getenv('DATABASE_URL', '').strip()

if DATABASE_URL:

    DATABASES = {

        'default': dj_database_url.parse(

            DATABASE_URL,

            conn_max_age=600,

            conn_health_checks=True,

            ssl_require=os.getenv('DB_SSL_REQUIRE', '0') == '1',

        )

    }

else:

    DATABASES = {

        'default': {

            'ENGINE': 'django.db.backends.sqlite3',

            'NAME': BASE_DIR / 'db.sqlite3',

        }

    }



AUTH_PASSWORD_VALIDATORS = [

    {

        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',

    },

    {

        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',

    },

    {

        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',

    },

    {

        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',

    },

]



if os.getenv('DJANGO_FAST_TESTS') == '1':

    PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']



LANGUAGE_CODE = 'ru-ru'



TIME_ZONE = 'Europe/Minsk'



USE_I18N = True



USE_L10N = True



USE_TZ = True



STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

STORAGES = {

    'default': {

        'BACKEND': 'django.core.files.storage.FileSystemStorage',

    },

    'staticfiles': {

        'BACKEND': (

            'django.contrib.staticfiles.storage.StaticFilesStorage'

            if DEBUG

            else 'whitenoise.storage.CompressedManifestStaticFilesStorage'

        ),

    },

}

LOGIN_REDIRECT_URL = 'delivery_app:home'

LOGOUT_REDIRECT_URL = 'delivery_app:home'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_URL = '/accounts/login/'



                              

EMAIL_BACKEND = os.getenv(

    'DJANGO_EMAIL_BACKEND',

    'django.core.mail.backends.console.EmailBackend',

)

EMAIL_HOST = os.getenv('DJANGO_EMAIL_HOST', '')

EMAIL_PORT = int(os.getenv('DJANGO_EMAIL_PORT', '587'))

EMAIL_USE_TLS = os.getenv('DJANGO_EMAIL_USE_TLS', '1') == '1'

EMAIL_HOST_USER = os.getenv('DJANGO_EMAIL_HOST_USER', '')

EMAIL_HOST_PASSWORD = os.getenv('DJANGO_EMAIL_HOST_PASSWORD', '')

DEFAULT_FROM_EMAIL = os.getenv('DJANGO_DEFAULT_FROM_EMAIL', 'noreply@localhost')



OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', '')

EXCHANGE_RATE_API_KEY = os.getenv('EXCHANGE_RATE_API_KEY', '')

PAYMENT_PROVIDER = os.getenv('PAYMENT_PROVIDER', 'demo')



CSRF_TRUSTED_ORIGINS = [

    origin.strip()

    for origin in os.getenv('DJANGO_CSRF_TRUSTED_ORIGINS', '').split(',')

    if origin.strip()

]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')



if not DEBUG:

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True

    SECURE_CONTENT_TYPE_NOSNIFF = True

    SECURE_REFERRER_POLICY = 'same-origin'

    SECURE_SSL_REDIRECT = os.getenv('DJANGO_SECURE_SSL_REDIRECT', '0') == '1'



                           

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'



LOG_LEVEL = os.getenv('DJANGO_LOG_LEVEL', 'INFO')

LOG_HANDLERS = ['console']

LOGGING_HANDLERS = {

    'console': {

        'level': LOG_LEVEL,

        'class': 'logging.StreamHandler',

        'formatter': 'verbose',

    },

}

if os.getenv('DJANGO_LOG_TO_FILE', '0') == '1':

    LOG_HANDLERS.append('file')

    LOGGING_HANDLERS['file'] = {

        'level': LOG_LEVEL,

        'class': 'logging.FileHandler',

        'filename': BASE_DIR / 'debug.log',

        'formatter': 'verbose',

    }



LOGGING = {

    'version': 1,

    'disable_existing_loggers': False,

    'formatters': {

        'verbose': {

            'format': '{levelname} {asctime} {module} {message}',

            'style': '{',

        },

    },

    'handlers': LOGGING_HANDLERS,

    'loggers': {

        'django': {

            'handlers': LOG_HANDLERS,

            'level': LOG_LEVEL,

            'propagate': True,

        },

        'delivery_app': {

            'handlers': LOG_HANDLERS,

            'level': LOG_LEVEL,

            'propagate': False,

        },

    },

}

