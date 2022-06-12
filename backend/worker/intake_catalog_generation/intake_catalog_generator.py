import os.path

import intake


def generate_intake_catalog_for_zarr(relative_input_path, file_name):
    relative_input_path = build_relative_input_path(relative_input_path)
    path = os.path.join(relative_input_path, file_name + ".zarr")

    source = intake.open_zarr(path, decode_times=False)
    source.discover()

    with open(build_relative_intake_catalog_path(f'{file_name}.yaml'), 'w') as f:
        f.write(source.yaml())


def build_relative_intake_catalog_path(path: str) -> str:
    return build_relative_path(path, 'intake-catalogs')


def build_relative_input_path(path: str) -> str:
    return build_relative_path(path, 'output')


def build_relative_path(path: str, folder_name: str) -> str:
    return os.path.join("..", folder_name, path).replace("\\", "/")
