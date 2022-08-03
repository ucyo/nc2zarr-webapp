import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': os.environ['NC2ZARR_POSTGRES_PASSWORD'],
        'HOST': 'postgres',
        'PORT': '5432',
    }
}

ALLOWED_HOSTS = ['host.docker.internal', os.environ['NC2ZARR_URL'], 'django']
