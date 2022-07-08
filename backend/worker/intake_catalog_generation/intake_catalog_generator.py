import os.path

import intake


def generate_intake_catalog_for_zarr(relative_input_path, file_name):
    relative_input_path = build_relative_input_path(relative_input_path)
    path = os.path.join(relative_input_path, file_name + ".zarr")

    source = intake.open_zarr(path, decode_times=False)
    source.discover()

    with open(build_relative_intake_catalog_path(f'{file_name}.yaml'), 'w') as f:
        f.write(source.yaml())


def generate_intake_catalog_for_json_metadata(relative_input_path, file_name):
    relative_input_path = build_relative_input_path(relative_input_path)

    if not file_name.endswith('.json'):
        file_name = file_name + '.json'

    path = os.path.join(relative_input_path, file_name)

    source = intake.open_zarr(
        "reference://",
        storage_options={
            "fo": path,
            "remote_protocol": "file"
        },
        consolidated=False
    )
    source.discover()

    with open(build_relative_intake_catalog_path(f'{file_name}.yaml'), 'w') as f:
        f.write(source.yaml())


def build_relative_intake_catalog_path(path: str) -> str:
    return build_relative_path(path, 'intake-catalogs')


def build_relative_input_path(path: str) -> str:
    return build_relative_path(path, 'output')


def build_relative_path(path: str, folder_name: str) -> str:
    return os.path.join("..", folder_name, path).replace("\\", "/")
