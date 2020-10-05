import unittest

from file_utils import remove_identical_branches

class TestRemoveIdenticalBranches(unittest.TestCase):
    def test_does_not_crash(self):
        a, b = remove_identical_branches([], [])
        self.assertEqual(len(a), 0)
        self.assertEqual(len(b), 0)

    def test_remove_is_correct(self):
        left = [
            {"title": "1", "hash": "123"},
            {"title": "2", "hash": "456"},
            {"title": "3", "hash": "789"},
        ]
        right = [
            {"title": "1", "hash": "123"},
            {"title": "2", "hash": "xxx"},
            {"title": "3", "hash": "789"},
        ]

        a, b = remove_identical_branches(left, right)
        self.assertEqual(len(a), 1)
        self.assertEqual(a[0]["title"], "2")
        self.assertEqual(a[0]["hash"], "456")
        self.assertEqual(len(b), 1)
        self.assertEqual(b[0]["title"], "2")
        self.assertEqual(b[0]["hash"], "xxx")

    def test_real_world(self):
        left = [
            {
                "title": "bazz", "children": [
                    {"title": "1.txt", "hash": "b026324c6904b2a9cb4b88d6d61c81d1"},
                    {"title": "original.tx", "hash": "d41d8cd98f00b204e9800998ecf8427e"}
                ]
            }, {
                "title": "foo", "children": [{
                    "title": "2.txt", "hash": "d41d8cd98f00b204e9800998ecf8427e"}
                ]
            }
        ]
        right = [
            {
                "title": "bazz", "children": [{
                    "title": "original.tx", "hash": "d41d8cd98f00b204e9800998ecf8427e"}
            ]}, {
                "title": "foo", "children": [
                    {"title": "1.txt", "hash": "b026324c6904b2a9cb4b88d6d61c81d1"},
                    {"title": "2.txt", "hash": "d41d8cd98f00b204e9800998ecf8427e"}
                ]
            }
        ]

        a, b = remove_identical_branches(left, right)
        from pprint import pprint as pp
        pp(a)



if __name__ == '__main__':
    unittest.main()