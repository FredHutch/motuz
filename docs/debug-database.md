# Debugging the Database

Terminal 1

```bash
docker run -it --net='host' postgres:11.3
```

Terminal 2

```bash
docker run -it --net='host' postgres:11.3 /bin/bash
psql -h 0.0.0.0 -U postgres -d postgres
```
