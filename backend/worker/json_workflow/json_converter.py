import os.path
import time

import fsspec
import netCDF4
import ujson
from fsspec_reference_maker.combine import MultiZarrToZarr
from fsspec_reference_maker.hdf import SingleHdf5ToZarr

from worker.json_workflow.json_workflow_error import JsonWorkflowError

fs = fsspec.filesystem('file')


def gen_json(relative_input_path, relative_output_path, file_name):
    relative_input_path = build_relative_input_path(relative_input_path)
    relative_output_path = build_relative_output_path(relative_output_path)

    try:
        with fsspec.open(relative_input_path, 'rb') as f:
            h5chunks = SingleHdf5ToZarr(f, relative_input_path, inline_threshold=300)

            out_path = os.path.join(relative_output_path, file_name + ".json")
            with open(out_path, 'wb') as outf:
                outf.write(ujson.dumps(h5chunks.translate()).encode())
    except OSError as _:
        f = netCDF4.Dataset(relative_input_path)
        raise JsonWorkflowError(str(f))


def combine_json(relative_input_paths, relative_output_path, file_name):
    # The input files are in the output folder for the combine process.
    # Therefore, we want to build input paths like '../output/foo.json'.
    input_paths = list(map(build_relative_output_path, relative_input_paths))

    time.sleep(3)

    print('Paths:')

    for p in input_paths:
        print(p)

    print('Content Length:')

    for p in input_paths:
        print(p + '\n')
        with open(p, 'r') as f:
            print(len(f.read()))
        print('\n')

    # Debugging Start
    with fsspec.open_files(input_paths) as ofs:
        fo_list = [ujson.load(of) for of in ofs]

    for fo in fo_list:
        print(fo)

    fss = [
        fsspec.filesystem(
            "reference", fo=fo,
            remote_protocol='file',
            remote_options={}
        ) for fo in fo_list
    ]
    print(len(fss))
    print(repr(fss[0]))
    print(repr(fss[0].fs))
    # Debugging End

    multi_zarr_to_zarr = MultiZarrToZarr(
        input_paths,
        remote_protocol='file',
        xarray_open_kwargs={
            "decode_cf": False,
            "mask_and_scale": False,
            "decode_times": False,
            "decode_timedelta": False,
            "use_cftime": False,
            "decode_coords": False
        },
        xarray_concat_args={
            'data_vars': 'minimal',
            'coords': 'minimal',
            'compat': 'override',
            'join': 'override',
            'combine_attrs': 'override',
            'dim': 't'
        }
    )

    if not file_name.endswith('.json'):
        file_name = file_name + '.json'

    output_path = os.path.join(build_relative_output_path(relative_output_path), file_name)
    multi_zarr_to_zarr.translate(output_path)


def build_relative_input_path(path: str) -> str:
    return build_relative_path(path, 'input')


def build_relative_output_path(path: str) -> str:
    return build_relative_path(path, 'output')


def build_relative_path(path: str, folder_name: str) -> str:
    return os.path.join("..", folder_name, path).replace("\\", "/")
