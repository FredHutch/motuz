# Motuz

A web based infrastructure for large scale data movements between on-premise and cloud

## Developer Installation

1. Install system dependencies

```bash
sudo apt-get install python3.5
# Work in progres... unsure what else is needed on a blank system. Might use docker soon
```

2. Initialize app

```bash
./bin/init.sh
```

3. Start Backend

```bash
./bin/backend_start.sh
```

4. Start frontend

```bash
./bin/frontend_start.sh
```

## Folder structure

### Overview

| Folder | Description |
| --- | --- |
| bin/ | Scripts for starting / installing / testing the application |
| docs/ | Documentation |
| sandbox/ | Temporary place for Proof of Concept code |
| src/ | All source code in one place |
| src/frontend | Frontend code |
| src/backend | Backend code |
| test/ | All test code in one place |
| test/frontend | Frontend testing |
| test/backend | Backend testing |


### Temp folders

Additional temporary folders - ignore and do not commit

| Folder | Description |
| --- | --- |
| __pycache__/ | Python Bytecode |
| node_modules/ | JavaScript dependencies |
| venv/ | Python dependencies |
