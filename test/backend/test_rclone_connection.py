import unittest
import sys
import os

from api.utils.rclone_connection import sanitize


class TestSanitize(unittest.TestCase):

    def test_base_case(self):
        payload = (
            "RCLONE_CONFIG_TEST_ACCESS_KEY_ID='thisIsAPassword' "
            "RCLONE_CONFIG_SRC='here' "
            "rclone ls"
        )

        expected = (
            "RCLONE_CONFIG_TEST_ACCESS_KEY_ID='***word' "
            "RCLONE_CONFIG_SRC='here' "
            "rclone ls"
        )

        actual = sanitize(payload)

        self.assertEqual(expected, actual)
