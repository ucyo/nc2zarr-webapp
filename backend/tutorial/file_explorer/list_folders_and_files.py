import os


def list_folders_and_files(path):
    d = {'text': os.path.basename(path), 'value': path, 'checked': False, 'collapsed': True}
    if os.path.isdir(path):
        # d['type'] = "directory"
        d['children'] = [list_folders_and_files(os.path.join(path, x)) for x in os.listdir(path)]
    # else:
        # d['type'] = "file"
    return d


def list_folders(path):
    d = {'text': os.path.basename(path), 'value': path, 'checked': False, 'collapsed': True}
    if os.path.isdir(path):
        # d['type'] = "directory"
        childs = filter(lambda p: os.path.isdir(p), os.listdir(path))
        d['children'] = [list_folders(os.path.join(path, x)) for x in childs]
    # else:
        # d['type'] = "file"
    return d
