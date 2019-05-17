import datetime
import os

def get_uid():
    uid = os.getuid()
    return {
        "uid": uid,
    }

def get_files():
    return [
    ]

