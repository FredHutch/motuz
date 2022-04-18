import unittest
import sys
import os
import logging

from api.utils.rclone_connection import RcloneConnection


class TestLogCommand(unittest.TestCase):

    def setUp(self):
        self.rclone_connection = RcloneConnection()


    @classmethod
    def setUpClass(cls):
        logging.disable(logging.INFO)


    @classmethod
    def tearDownClass(cls):
        logging.disable(logging.NOTSET)


    def test_allowlist(self):
        credentials = {
            "RCLONE_CONFIG_SRC_REGION": "one"
        }
        expected = "RCLONE_CONFIG_SRC_REGION='one' foo"
        self.assertEqual(self.rclone_connection._log_command(["foo"], credentials), expected)


    def test_blocklist(self):
        credentials = {
            "SECRET_ACCESS_KEY": "one two three"
        }
        expected = "SECRET_ACCESS_KEY='***' foo"
        self.assertEqual(self.rclone_connection._log_command(["foo"], credentials), expected)


    def test_no_list(self):
        credentials = {
            "SECRET_ACCESS_KEY": "one two three"
        }
        expected = "SECRET_ACCESS_KEY='***' foo"
        self.assertEqual(self.rclone_connection._log_command(["foo"], credentials), expected)


    def test_partial_allow(self):
        credentials = {
            "RCLONE_CONFIG_SRC_ACCESS_KEY_ID": "KHSNRYQPOFYN"
        }
        expected = "RCLONE_CONFIG_SRC_ACCESS_KEY_ID='***OFYN' foo"
        self.assertEqual(self.rclone_connection._log_command(["foo"], credentials), expected)
