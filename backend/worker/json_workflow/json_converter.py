import os.path

import fsspec
import ujson
from fsspec_reference_maker.hdf import SingleHdf5ToZarr

fs = fsspec.filesystem('file')


def gen_json(relative_input_path, relative_output_path, file_name):
    relative_input_path = os.path.join("..", "input", relative_input_path)
    relative_output_path = os.path.join("..", "output", relative_output_path)

    with fsspec.open(relative_input_path, 'rb') as f:
        h5chunks = SingleHdf5ToZarr(f, relative_input_path, inline_threshold=300)

        out_path = os.path.join(relative_output_path, file_name + ".json")
        with open(out_path, 'wb') as outf:
            outf.write(ujson.dumps(h5chunks.translate()).encode())
