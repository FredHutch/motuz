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

def ssh_prefix():
    if os.getenv("MOTUZ_SSH_HOST"):
        return ["ssh", "-i", get_ssh_key_path(), "-o", "StrictHostKeyChecking=no",
                "-o", "UserKnownHostsFile=/dev/null", f'root@{os.getenv("MOTUZ_SSH_HOST")}']
    raise Exception("Could not find SSH host, is MOTUZ_SSH_HOST defined?")
