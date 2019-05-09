import os, sys, subprocess, atexit
from setuptools import setup
from setuptools.command.install import install

__version__ = "0.0.2"

CLASSIFIERS = [
    "Development Status :: 3 - Alpha",
    "Intended Audience :: Developers",
    "Intended Audience :: Science/Research",
    "Intended Audience :: System Administrators",
    "License :: OSI Approved :: Apache Software License",
    "Natural Language :: English",
    "Operating System :: POSIX :: Linux",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.5",
    "Programming Language :: Python :: 3.6",
    "Programming Language :: Python :: 3.7",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: Implementation :: CPython",
    "Programming Language :: Unix Shell",
    "Topic :: Software Development :: Libraries :: Python Modules",
    "Topic :: System :: Systems Administration",
    "Topic :: Utilities"
]
OSPKG_APT=['fping',]
OSPKG_YUM=['fping',]

class CustomInstall(install):
    def run(self):
        def _post_install():
            pass
            #def find_module_path():
            #    for p in sys.path:
            #        if os.path.isdir(p) and my_name in os.listdir(p):
            #            return os.path.join(p, my_name)
            #install_path = find_module_path()
            #print('    package installed in %s' % install_path)

        # Add your post install code here
        if os.path.exists('/usr/bin/apt-get'):
            inst=['apt-get', 'install', '-y']
            print('    executing %s ...' % " ".join(inst+OSPKG_APT)) 
            subprocess.Popen(inst+OSPKG_APT)
        elif os.path.exists('/usr/bin/yum'):
            inst=['yum', 'install']
            print('    executing %s ...' % " ".join(inst+OSPKG_YUM))
            subprocess.Popen(inst+OSPKG_YUM)

        atexit.register(_post_install)
        install.run(self)

setup(
    name='motuz',
    version=__version__,
    description='a web based infrastructure for large scale data movements between on-premise and cloud ',
    long_description=open('README.rst', 'r').read(),
    packages=['motuz'],
    #scripts=[
    #    'bin/sci',
    #    ],
    author = 'Dirk Petersen',
    author_email = 'dp@nowhere.com',
    url = 'https://github.com/FredHutch/motuz',
    download_url = 'https://github.com/FredHutch/motuz/tarball/%s' % __version__,
    keywords = ['hpc', 'scientific computing'], # arbitrary keywords
    classifiers = CLASSIFIERS,
    install_requires=[
        'requests',
        'python-hostlist'
        ],
    cmdclass={'install': CustomInstall},
    #entry_points={
    #    # we use console_scripts here to allow virtualenv to rewrite shebangs
    #    # to point to appropriate python and allow experimental python 2.X
    #    # support.
    #    'console_scripts': [
    #        'slurm-script=slurm_toys.slurm_script:main',
    #    ]
    #}
)
