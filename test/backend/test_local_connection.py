import unittest
import sys
import os

from api.utils.local_connection import _parse_ls


class TestListLocalFiles(unittest.TestCase):

    def test_parse_ls_base_case(self):
        result = _parse_ls("drwxr-xr-x 7 4096 Dec 20 05:51 hello")
        assert len(result) == 1
        assert result[0]['name'] == 'hello'


    def test_parse_ls_skip_specials(self):
        result = _parse_ls("drwxr-xr-x 7 4096 Dec 20 05:51 .")
        assert len(result) == 0

        result = _parse_ls("drwxr-xr-x 7 4096 Dec 20 05:51 ..")
        assert len(result) == 0

        result = _parse_ls('\n'.join([
            "drwxr-xr-x 7 4096 Dec 20 05:51 .",
            "drwxr-xr-x 7 4096 Dec 20 05:51 ..",
        ]))
        assert len(result) == 0


    def test_parse_ls_poor_permissions(self):
        result = _parse_ls("l????????? ? ?      ?         ?            ? shared")
        assert len(result) == 1


    def test_parse_ls_many(self):
        input = [
            "-rw------- 1  573 Nov 27 23:37 .bash_history",
            "-rw-r--r-- 1  220 Apr  4  2018 .bash_logout",
            "-rw-r--r-- 1 3771 Apr  4  2018 .bashrc",
            "drwx------ 2 4096 Nov 27 22:19 .cache",
            "drwxrwxr-x 3 4096 Dec 20 05:51 .config",
            "drwx------ 3 4096 Nov 27 22:19 .gnupg",
            "-rw-r--r-- 1  807 Apr  4  2018 profile",
            "-rw------- 1    0 Nov 27 22:20 python_history",
            "drwx------ 2 4096 Nov 27 22:27 .ssh",
            "-rw-r--r-- 1    0 Nov 27 22:19 .sudo_as_admin_successful",
            "-rw------- 1  867 Nov 27 22:27 .viminfo",
            "l????????? ?    ?            ? shared",
            "total 12"
        ]
        output = '\n'.join(input)
        result = _parse_ls(output)

        assert len(result) == len(input) - 1
