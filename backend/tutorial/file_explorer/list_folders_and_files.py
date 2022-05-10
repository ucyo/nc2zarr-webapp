import os


def list_folders_and_files(path):
    d = {'text': os.path.basename(path), 'value': path, 'checked': False, 'collapsed': True}
    if os.path.isdir(path):
        children = filter(lambda p: (os.path.isdir(os.path.join(path, p)) or p.endswith('.nc')), os.listdir(path))
        d['children'] = [list_folders_and_files(os.path.join(path, x)) for x in children]
    return d


def list_folders(path):
    d = {'text': os.path.basename(path), 'value': path, 'checked': False, 'collapsed': True}
    if os.path.isdir(path):
        children = filter(lambda p: os.path.isdir(os.path.join(path, p)), os.listdir(path))
        d['children'] = [list_folders(os.path.join(path, x)) for x in children]
    return d
