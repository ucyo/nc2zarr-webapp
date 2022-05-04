class JsonWorkflowError(Exception):
    def __init__(self, file_info):
        super().__init__('\n\nFile info:\n\n' + file_info)
