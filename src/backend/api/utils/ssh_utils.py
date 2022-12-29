import os

def get_ssh_key_path():
    if os.path.exists("/MOTUZ_SSH_KEY"): # in container
        return "/MOTUZ_SSH_KEY"
    # development mode, MOTUZ_DOCKER_ROOT is defined:
    if os.path.exists(f"{os.getenv('MOTUZ_DOCKER_ROOT')}/secrets/MOTUZ_SSH_KEY"):
        return f"{os.getenv('MOTUZ_DOCKER_ROOT')}/secrets/MOTUZ_SSH_KEY"
    # development mode, MOTUZ_DOCKER_ROOT is not defined:
    if os.path.exists("docker/secrets/MOTUZ_SSH_KEY"):
        return "docker/secrets/MOTUZ_SSH_KEY"
    raise Exception("Could not find SSH key")

