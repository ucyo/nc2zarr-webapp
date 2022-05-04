import os.path

import fsspec
import netCDF4
import ujson
from fsspec_reference_maker.hdf import SingleHdf5ToZarr

from worker.json_workflow.json_workflow_error import JsonWorkflowError

fs = fsspec.filesystem('file')


def gen_json(relative_input_path, relative_output_path, file_name):
    relative_input_path = os.path.join("..", "input", relative_input_path)
    relative_output_path = os.path.join("..", "output", relative_output_path)

    try:
        with fsspec.open(relative_input_path, 'rb') as f:
            h5chunks = SingleHdf5ToZarr(f, relative_input_path, inline_threshold=300)

            out_path = os.path.join(relative_output_path, file_name + ".json")
            with open(out_path, 'wb') as outf:
                outf.write(ujson.dumps(h5chunks.translate()).encode())
    except OSError as error:
        f = netCDF4.Dataset(relative_input_path)
        raise JsonWorkflowError(str(f))
