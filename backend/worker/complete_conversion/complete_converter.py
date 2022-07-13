import json
import os.path
import shutil

import fsspec
import numpy as np
import xarray as xr
import zarr

from worker.complete_conversion.complete_conversion_error import CompleteConversionError

fs = fsspec.filesystem('file')
DEFAULT_ZARR_COMPRESSOR = zarr.Blosc(cname="zstd", clevel=3, shuffle=2)


def remove_existing_folder(relative_output_path, file_name):
    relative_output_path = build_relative_output_path(relative_output_path)
    out_path = os.path.join(relative_output_path, file_name + ".zarr")

    if os.path.exists(out_path):
        print('Remove existing Zarr store: ' + out_path)
        shutil.rmtree(out_path)


def complete_conversion(relative_input_path,
                        relative_output_path,
                        file_name,
                        precision: float,
                        auto_chunks: bool,
                        packed: bool,
                        unique_times: bool,
                        chunk_dictionary):
    relative_input_path = build_relative_input_path(relative_input_path)
    relative_output_path = build_relative_output_path(relative_output_path)

    out_path = os.path.join(relative_output_path, file_name + ".zarr")

    nc_to_zarr(
        ncglob=relative_input_path,
        store=out_path,
        auto_chunks=auto_chunks,
        chunk_dictionary=chunk_dictionary,
        unique_times=unique_times,
        packed=packed,
        dtype="float32",
        precision=precision)


def nc_to_zarr(
        ncglob,
        store,
        chunk_dictionary,
        unique_times=True,
        packed=False,
        dtype="int32",
        precision=1e-3,
        fill_value=-32767,
        parallel=False,
        compressor=DEFAULT_ZARR_COMPRESSOR,
        mode="w",
        auto_chunks=True
):
    print("Open dataset from: {}".format(ncglob))
    dataset = xr.open_mfdataset(ncglob, parallel=parallel, decode_times=False)

    if isinstance(dtype, str):
        dtype = {v: dtype for v in dataset.data_vars}

    # Removing duplicate time indexes
    if unique_times and hasattr(dataset, 'time'):
        dataset = remove_duplicate_times(dataset)

    # Chunking dataset, will define chunking in zarr
    if auto_chunks:
        dataset = dataset.chunk("auto")
    else:
        try:
            dataset = dataset.chunk(chunk_dictionary)
        except ValueError as _:
            f = list(dataset.coords)
            raise CompleteConversionError(
                "Chunks are not valid.\nChunks requested: " + json.dumps(
                    chunk_dictionary) + "\nViable options are: " + str(f))

    # Setting encoding
    encoding = {}
    for data_var in dataset.data_vars:
        encoding[data_var] = {"compressor": compressor, "_FillValue": fill_value}
        if packed:
            encoding[data_var].update(
                {"dtype": dtype.get(data_var, "int32"), "scale_factor": precision}
            )
            # Avoid conflict with encoding read from file
            dataset[data_var].encoding = {}

    # Saving zarr
    print("Creating zarr store: {}".format(store))
    dataset.to_zarr(store=store, mode=mode, encoding=encoding, consolidated=True)

    return dataset


def remove_duplicate_times(dset):
    """Remove duplicate times from dataset."""
    _, index = np.unique(dset['time'], return_index=True)
    return dset.isel(time=index)


def build_relative_input_path(path: str) -> str:
    return build_relative_path(path, 'input')


def build_relative_output_path(path: str) -> str:
    return build_relative_path(path, 'output')


def build_relative_path(path: str, folder_name: str) -> str:
    return os.path.join("..", folder_name, path).replace("\\", "/")
