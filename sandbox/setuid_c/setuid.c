/**
 * Invoke as
 * ./setuid path/to/folder uid_to_impersonate
 */

#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>

extern int errno;

int ls(const char * path) {
    DIR *d;
    struct dirent *dir;
    d = opendir(path);
    if (d) {
        while ((dir = readdir(d)) != NULL) {
            printf("%s\n", dir->d_name);
        }
        closedir(d);
    } else {
        printf("Permission denied");
        exit(1);
    }
    return(0);
}



int main(int argc, char ** argv) {
    if (argc != 3) {
        printf("Error: Invoke as \n./setuid path/to/folder uid");
        exit(1);
    }

    const char * path = argv[1];
    int desired_uid = atoi(argv[2]);

    uid_t uid, euid;

    uid = getuid();
    euid = geteuid();
    printf("uid: %d | euid: %d\n", uid, euid);

    setuid(desired_uid);
    if (errno != 0) {
        printf("Error %d while executing setuid", errno);
        exit(0);
    }

    ls(path);

    return 0;
}
