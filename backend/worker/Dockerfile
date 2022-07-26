FROM ubuntu:20.04

ENV LANG="C.UTF-8" LC_ALL="C.UTF-8" PATH="/home/python/.poetry/bin:/home/python/.local/bin:$PATH" PIP_NO_CACHE_DIR="false"

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv python-is-python3 curl ca-certificates wait-for-it libpq-dev python3-dev build-essential gettext-base && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/python/code
WORKDIR /home/python/code

RUN python -m pip install rq zarr xarray redis fsspec h5py kerchunk ujson netCDF4 Jinja2 dask numpy cftime intake[complete] intake-xarray aiohttp