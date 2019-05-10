---
title: Suggestions for technologies to try
last_modified_at: 2019-01-17
main_author: Dirk Petersen
---


## User Browsing a mounted file system with own permissions


we want to browse fast file with the credentials of the end user logged into the flask app, the flask app is started as root

Python can drop the privileges but the problem is of course that once it has done that it can never go back unless every user has sudo …. Not an option …

Instead the subprocess package has the preexec_fn option where it can demote a spawned process 

https://gist.githubusercontent.com/sweenzor/1685717/raw/ee5fdbf64f0979168313bf62393499b7d32b7209/subprocessdemote.py

now the problem with that is that if this spawned process is a python software it needs to be spawned each time a user wants to list another directory which is expensive an unelegant . I wonder how much effort it would be to write a C version of this node software:

https://www.npmjs.com/package/json-dir-listing

ideally it would just print the objects in the directory (no subdirectories) passed as argument (or the current one) as json to stdout and python could convert this right to a list of dictionaries.

```
[
    {
        "type": "file",
        "name": "myfile.txt",
        "owner": "john",
        "group": "staff",
        "modified": "2015-10-02T00:00:00",
        "size": 12345677
    },
    {
        "type": "folder",
        "name": "subdir",
        "owner": "john",
        "group": "staff",
        "modified": "2011-10-02T00:00:00",
        "size": 0
    }
]  
```




