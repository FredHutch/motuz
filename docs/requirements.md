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




