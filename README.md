
# NetCDF 2 Zarr

The goal of this project is to access NetCDF4 files via [Zarr](https://zarr.readthedocs.io/en/stable/).

## Workflows

The application provides two workflows:

### JSON workflow

With the **JSON workflow** you can generate JSON metadata for NetCDF4 files to access them with `xarray` without using the NetCDF4 APIs. The conversion code was taken and modified from [this](https://medium.com/pangeo/fake-it-until-you-make-it-reading-goes-netcdf4-data-on-aws-s3-as-zarr-for-rapid-data-access-61e33f8fe685) article.

### Complete conversion

With the complete conversion a NetCDF 4 can be converted to Zarr.

## Getting Started

The project can be started with Docker. You can specify the amount of asynchronous workers with the last parameter:

```bash
docker-compose up -d --build --scale worker=4
```

Then open your browser and enter `http://localhost/`.

### Configuration

To configure the application the `docker-compose.override.yaml` must be overwritten. Set the volumes for input and output folders to the desired folders on your machine:

```yaml
worker:
  volumes:
    - /your/input/path:/home/python/input
    - /your/output/path:/home/python/output

django:
  volumes:
    - /your/input/path:/input
    - /your/output/path:/output
```

## Contributing

When contributing to the project it is helpful to run the Django backend and the Angular frontend in an IDE.
Here are the steps necessary to run them successfully.

### Other services

For the backend to work correctly other services from the `docker-compose.yaml` like Postgres are needed. You can start them with:

```commandline
docker-compose up -d
```

### Django backend

Set the following environment variables to configure your local environment:

```commandline
NC2ZARR_INPUT               = <absolute_path_to_input_folder> (e.g. Q:\nc2zarr\input on Windows)
NC2ZARR_OUTPUT              = <absolute_path_to_output_folder> (e.g. Q:\nc2zarr\output on Windows)
NC2ZARR_INTAKE_CATALOGS     = <absolute_path_to_intake_catalogs_folder> (e.g. Q:\nc2zarr\intake-catalogs on Windows)
NC2ZARR_POSTGRES_HOST       = localhost
NC2ZARR_POSTGRES_PASSWORD   = development
NC2ZARR_URL                 = localhost
PYTHONUNBUFFERED            = 1
```

Use the environment variables for all Django commands. 

To generate database migrations run:

```commandline
python manage.py makemigrations db
```

To apply database migrations run:

```commandline
python manage.py migrate
```

To start the server run: 

```commandline
python manage.py runserver 127.0.0.1:8001
```

### Angular frontend

For the frontend you need to have `npm` installed.

Then run:

```commandline
npm install
npm run start
```