import os.path

import intake
import requests


def generate_intake_catalog_for_zarr(relative_input_path: str, file_name: str, complete_conversion_id: int):
    relative_input_path = build_relative_input_path(relative_input_path)
    path = os.path.join(relative_input_path, file_name + ".zarr")

    source = intake.open_zarr(path, decode_times=False)
    source.discover()

    domain = "host.docker.internal:8001"

    if os.environ["NC2ZARR_PROD"] == "True":
        domain = "django:8000"

    response = requests.put(
        'http://' + domain + '/complete-conversion/intake-source/' + str(complete_conversion_id),
        data={'yaml': source.yaml()})
    response.raise_for_status()


def generate_intake_catalog_for_json_metadata(relative_input_path: str, file_name: str, json_workflow_id: int):
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

    domain = "host.docker.internal:8001"

    if os.environ["NC2ZARR_PROD"] == "True":
        domain = "django:8000"

    response = requests.put('http://' + domain + '/json-workflow/intake-source/' + str(json_workflow_id),
                            data={'yaml': source.yaml()})
    response.raise_for_status()


def build_relative_intake_catalog_path(path: str) -> str:
    return build_relative_path(path, 'intake-catalogs')


def build_relative_input_path(path: str) -> str:
    return build_relative_path(path, 'output')


def build_relative_path(path: str, folder_name: str) -> str:
    return os.path.join("..", folder_name, path).replace("\\", "/")
