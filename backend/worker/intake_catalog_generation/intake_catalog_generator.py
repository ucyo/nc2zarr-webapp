import os.path

import intake
import requests


def generate_intake_catalog_for_zarr(absolute_input_path: str, file_name: str, complete_conversion_id: int):
    absolute_input_path = build_input_path(absolute_input_path)
    path = os.path.join(absolute_input_path, file_name + ".zarr")

    source = intake.open_zarr(path, decode_times=False)
    source.discover()

    domain = "host.docker.internal:8001"

    if os.environ["NC2ZARR_PROD"] == "True":
        domain = "django:8000"

    yaml = source.yaml().replace(os.environ['NC2ZARR_OUTPUT'], os.environ['NC2ZARR_PUBLIC_URL'] + 'output')

    response = requests.put(
        'http://' + domain + '/complete-conversion/intake-source/' + str(complete_conversion_id),
        data={'yaml': yaml})
    response.raise_for_status()


def generate_intake_catalog_for_json_metadata(absolute_input_path: str, file_name: str, json_workflow_id: int):
    absolute_input_path = build_input_path(absolute_input_path)

    if not file_name.endswith('.json'):
        file_name = file_name + '.json'

    path = os.path.join(absolute_input_path, file_name)

    source = intake.open_zarr(
        "reference://",
        storage_options={
            "fo": path,
            "remote_protocol": "http"
        },
        consolidated=False
    )
    source.discover()

    domain = "host.docker.internal:8001"

    if os.environ["NC2ZARR_PROD"] == "True":
        domain = "django:8000"

    yaml = source.yaml().replace(os.environ['NC2ZARR_OUTPUT'], os.environ['NC2ZARR_PUBLIC_URL'] + 'output')

    response = requests.put('http://' + domain + '/json-workflow/intake-source/' + str(json_workflow_id),
                            data={'yaml': yaml})
    response.raise_for_status()


def build_input_path(path: str) -> str:
    return build_absolute_path(os.environ['NC2ZARR_OUTPUT'], path)


def build_absolute_path(prefix: str, suffix: str) -> str:
    return os.path.join(prefix, suffix).replace("\\", "/")
