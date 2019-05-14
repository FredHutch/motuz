---
title: Cloud Data mover requirements 
last_modified_at: 2019-05-10
main_author: Dirk Petersen
---


# Backend system 

Technology stack: Flask, flask-restplus, celery, rclone


## functions to be exported via REST

* CopyJobStart
* CopyJobStatus
* CopyJobSave
* CopyJobReSync
* UserProfileAdd (one profile per user, are global settings required ?)
* UserProfileModify 
* UserProFileDelete
* UserConnectionAdd (many connections can by setup per user, called 'remotes' in rclone
* UserConnectionModify
* UserConnectionDelete
* UidGet
* DirList


 
# Frontend 

Technology stack: React JS

## UI requirements 

* if on-prem posix file system is the source it must be possible to either select individual files or a directory for a copy job
* if cloud storage is the source it must be possible to browse through virtual folders of a bucket and select individual object or virtual folders 



## V2 requirements

### Tagging

For storage systems that support it (such as S3) we should have the ability to tag objects that we are copying (or existing objects without re-copying them), via an attached CSV file where the first column is the object name and subsequent columns represent key value pairs.

Also having APIs for retrieving existing tags would be convenient so the user would not have to switch to a different tool to see an object's tags. 

We have a small but enthusiastic group of people for whom tagging is central to their workflow, and they are spreading the word, so there could be more users who would make use of this feature. 



