#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>

int ls(const char * path) {
    DIR *d;
    struct dirent *dir;
    d = opendir(path);
    if (d) {
        while ((dir = readdir(d)) != NULL) {
            printf("%s\n", dir->d_name);
        }
        closedir(d);
    }
    return(0);
}



int main(int argc, char ** argv) {
    if (argc != 2) {
        printf("Error This should take exctly one argument - the name of the path to read");
        exit(1);
    }

    ls(argv[1]);
    return 0;
}