"""
Django settings for blucher2 project.

Generated by 'django-admin startproject' using Django 3.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
import os
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'DswnfaLIvt9XDLXvtQkSkM5PBB3oO9Vdkm2phyIZAp0B5v5z25o'


env = environ.Env()
# reading .env file
environ.Env.read_env()

# Raises django's ImproperlyConfigured exception if SECRET_KEY not in os.environ
SECRET_KEY = env("SECRET_KEY")

# reads values from .env-file in folder with settings.py
# DATABASES = {
#    'default': {
#        'ENGINE': 'django.db.backends.postgresql_psycopg2',
#        'NAME': env("DATABASE_NAME"),
#        'USER': env("DATABASE_USER"),
#        'PASSWORD': env("DATABASE_PASSWORD"),
#        'HOST': env("DATABASE_HOST"),
#        'PORT': env("DATABASE_PORT"),
#    }
# }


# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = False

ALLOWED_HOSTS = ['happyblucher.com', '127.0.0.1:8000']


#DEBUG = False

#ALLOWED_HOSTS = ['happyblucher.com']

#SECURE_SSL_REDIRECT = True
#SECURE_HSTS_SECONDS = 2592000
#SECURE_HSTS_INCLUDE_SUBDOMAINS = True
#SECURE_HSTS_PRELOAD = True

#SESSION_COOKIE_SECURE = True
#CSRF_COOKIE_SECURE = True


# Application definition

INSTALLED_APPS = [
    'builder',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'builder.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'blucher2.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_USER_MODEL = 'builder.CustomUser'

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = (os.path.join(BASE_DIR, ""), )
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/builder/images/'

#LOGIN_REDIRECT_URL = '/'
#LOGOUT_REDIRECT_URL = '/'
