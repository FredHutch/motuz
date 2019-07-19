# Useful server recepies

## Create users

```bash
sudo useradd -d /home/aicioara -m aicioara
echo 'aicioara:ThisIsNotSecure' | sudo chpasswd
```

## Create test files

```bash
for size in {107374,1073741,10737418,107374182,1073741824}; do
    for i in $(seq 1 3); do
        filename="file_${size}_${i}.bin"
        echo "$filename"
        head -c "$size" < /dev/urandom > "$filename"
    done
done

```