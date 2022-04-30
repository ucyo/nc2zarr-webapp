
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