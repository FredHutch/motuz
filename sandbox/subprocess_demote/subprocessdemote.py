#!/usr/bin/env python3

import os
import subprocess

def demote(user_uid, user_gid):
	"""Pass the function 'set_ids' to preexec_fn, rather than just calling
	setuid and setgid. This will change the ids for that subprocess only"""

	def set_ids():
		os.setgid(user_gid)
		os.setuid(user_uid)

	return set_ids


if __name__=='__main__':

	print ('uid:', os.getuid())
	print ('gid:', os.getgid())

	subprocess.run(['id'])
	subprocess.run(['id'], preexec_fn=demote(1001, 1001))
	subprocess.run(['id'])
